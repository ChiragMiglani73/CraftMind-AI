import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express();

await connectCloudinary();

app.use(cors({
  origin: 'https://craft-mind-ai.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('Server is Live!'));


app.use('/api/ai', aiRouter); // already uses auth middleware per route
app.use('/api/user', userRouter); // same here

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
