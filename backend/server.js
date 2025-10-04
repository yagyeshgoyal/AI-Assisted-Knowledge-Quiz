import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generate quiz questions
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

// Generate AI feedback based on quiz performance
app.post('/api/feedback', async (req, res) => {
  const { 
    topic, 
    totalQuestions, 
    correctCount, 
    incorrectCount, 
    percentage, 
    incorrectQuestions 
  } = req.body;
  
  if (!topic || totalQuestions === undefined) {
    return res.status(400).json({ 
      message: "Invalid request. Topic and quiz data are required." 
    });
  }
  
  console.log(`Generating feedback for topic: ${topic}, Score: ${correctCount}/${totalQuestions}`);
  
  // Build the prompt for AI feedback
  let prompt = `You are an expert tutor analyzing a student's quiz performance.

Topic: ${topic}
Score: ${correctCount} out of ${totalQuestions} (${percentage}%)

`;

  if (incorrectQuestions && incorrectQuestions.length > 0) {
    prompt += `The student answered ${incorrectQuestions.length} question(s) incorrectly:\n\n`;
    
    incorrectQuestions.forEach((q, index) => {
      prompt += `Question ${index + 1}: ${q.question}
Student's Answer: ${q.userAnswer}
Correct Answer: ${q.correctAnswer}
All Options: ${q.allOptions.join(', ')}

`;
    });
    
    prompt += `
Please provide:
1. A brief analysis of the student's performance
2. Specific explanations for why each incorrect answer was wrong
3. Key concepts the student needs to review
4. Actionable study recommendations tailored to their mistakes
5. Encouragement and next steps

Keep the response clear, constructive, and under 100 words and point wise.`;
  } else {
    prompt += `The student answered all questions correctly! 

Please provide:
1. Congratulations on their perfect score
2. Recognition of their mastery of ${topic}
3. Suggestions for more advanced topics to explore
4. Tips for maintaining and expanding their knowledge

Keep the response encouraging and under 200 words.`;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const feedback = response.text.trim();
    
    res.json({ 
      feedback,
      topic,
      score: `${correctCount}/${totalQuestions}`,
      percentage 
    });
    
  } catch (err) {
    console.error("Error generating feedback:", err);
    res.status(500).json({ 
      message: "Failed to generate AI feedback. Please try again.",
      error: err.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));