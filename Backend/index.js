import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import cors from 'cors';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
  }
  catch(err){
    console.log("Failed to connect with DB", err);
  }
}

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.post("/test", async (req, res) => {
  try {
    const response = await client.chat.completions.create({
      model: "cohere/north-mini-code:free",
      messages: [{ role: "user", content: "hello!" }]
    });

    const reply = response.choices[0].message.content;
    console.log(reply);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
  connectDB();
});