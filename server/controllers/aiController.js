import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";
import FormData from "form-data";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const geminiPro = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

/* -------------------- HELPERS -------------------- */

const getUserUsage = async (userId) => {
  try {
    const [usage] = await sql`
      SELECT free_usage FROM usage_tracking WHERE user_id = ${userId}
    `;
    return usage?.free_usage || 0;
  } catch (error) {
    console.error("Error fetching usage:", error);
    return 0;
  }
};

const incrementUsage = async (userId) => {
  try {
    await sql`
      INSERT INTO usage_tracking (user_id, free_usage)
      VALUES (${userId}, 1)
      ON CONFLICT (user_id)
      DO UPDATE SET free_usage = usage_tracking.free_usage + 1
    `;
  } catch (error) {
    console.error("Error incrementing usage:", error);
  }
};

/* Convert frontend length → Gemini tokens */
const getMaxTokensFromLength = (length) => {
  if (!length) return 1024;

  const l = length.toLowerCase();
  if (l.includes("short")) return 1200;
  if (l.includes("medium")) return 2000;
  if (l.includes("long")) return 3000;

  return 1024;
};

/* -------------------- ARTICLE -------------------- */

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const free_usage = await getUserUsage(userId);

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const result = await geminiFlash.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: getMaxTokensFromLength(length),
      },
    });

    const content = result.response.text();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await incrementUsage(userId);
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("ARTICLE ERROR:", error?.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Article generation failed",
    });
  }
};

/* -------------------- BLOG TITLE -------------------- */

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;

    if (!prompt?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const free_usage = await getUserUsage(userId);

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const result = await geminiFlash.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100,
      },
    });

    const content = result.response.text();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await incrementUsage(userId);
    }

    res.json({ success: true, content });
  } catch (error) {
    console.error("BLOG TITLE ERROR:", error?.message || error);
    res.status(500).json({
      success: false,
      message: error.message || "Blog title generation failed",
    });
  }
};

/* -------------------- IMAGE GENERATION -------------------- */

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(
      data
    ).toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("IMAGE ERROR:", error?.message || error);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------- BACKGROUND REMOVE -------------------- */

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.error("BG REMOVE ERROR:", error?.message || error);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------- OBJECT REMOVE -------------------- */

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error("OBJECT REMOVE ERROR:", error?.message || error);
    res.json({ success: false, message: error.message });
  }
};

/* -------------------- RESUME REVIEW -------------------- */

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "Premium only feature",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `Review this resume and give detailed feedback:\n\n${pdfData.text}`;

    const result = await geminiPro.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const content = result.response.text();

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume review', ${content}, 'resume-review')
    `;

    res.json({ success: true, content });
  } catch (error) {
    console.error("RESUME ERROR:", error?.message || error);
    res.json({ success: false, message: "Resume review failed" });
  }
};
