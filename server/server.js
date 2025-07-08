import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js'; 
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();
const PORT = 3000;

// Connect to MongoDB
await connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Show Management API');
});
app.use('/api/inngest', serve({ client: inngest, functions }));

// Import routes
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
