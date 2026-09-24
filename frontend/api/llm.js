import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
  const { prompt_text } = req.body;
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ text: "Lỗi: Chưa cấu hình LLM_API_KEY trên Vercel" });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Bắt buộc dùng gemini-2.5-flash cho độ ổn định cao nhất năm 2026
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt_text);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ text: `Lỗi AI: ${error.message}` });
  }
}
