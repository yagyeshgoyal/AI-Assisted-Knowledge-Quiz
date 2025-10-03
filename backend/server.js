import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Use a relative route
app.post('/api/generate', async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic is required" });
  console.log("Received topic:", topic);
  const prompt = `
    Write 5 multiple choice questions on "${topic}". 
    Return output strictly in JSON format as array of objects:
    [
      { "question": "string", "options": ["string","string","string","string"], "answer": "string" }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    let raw = response.text.trim();
    raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const data = JSON.parse(raw);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
