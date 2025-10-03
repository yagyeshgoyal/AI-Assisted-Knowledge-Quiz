import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function main() {
  const prompt = `
  Write 5 multiple choice questions on web development. 
  Return the output strictly in JSON format as an array of objects like this:
  [
    {
      "question": "string",
      "options": ["string","string","string","string"],
      "answer": "string"
    }
  ]
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let raw = response.text.trim();

  // Remove Markdown ```json ... ``` wrappers if present
  raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    const data = JSON.parse(raw);
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Still not valid JSON. Raw output was:\n", raw);
  }
}

main().catch(err => {
  console.error("Error from Gemini:", err);
});
