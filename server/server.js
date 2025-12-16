import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import sql from './configs/db.js';

const app = express();

// Initialize database tables
async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS usage_tracking (
        user_id TEXT PRIMARY KEY,
        free_usage INTEGER DEFAULT 0,
        last_reset TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Database initialized: usage_tracking table ready');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Don't exit - let the app continue, but log the error
  }
}

// Run database initialization
await initDatabase();
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