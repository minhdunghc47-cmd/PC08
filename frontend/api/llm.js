import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
  const { prompt_text } = req.body;
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ text: "Lỗi: Chưa cấu hình LLM_API_KEY trên Vercel" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.7-flash", "gemini-3.5-flash"];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt_text);
      const response = await result.response;
      return res.status(200).json({ text: response.text() });
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      lastError = error;
      // Dừng vòng lặp nếu lỗi xác thực hoặc lỗi quá tải 429 (vì các model dùng chung quota RPM)
      if (error.message.includes("API key not valid") || error.message.includes("429") || error.message.includes("quota")) {
        // Trích xuất số giây cần đợi nếu có
        const match = error.message.match(/retry in ([0-9.]+)s/);
        const waitTime = match ? Math.ceil(parseFloat(match[1])) : 30;
        return res.status(429).json({ text: `Google AI đang quá tải (Hết hạn mức). Vui lòng đợi ${waitTime} giây rồi bấm lại nhé!` });
      }
    }
  }

  // Nếu tất cả đều thất bại
  console.error("All Gemini models failed. Last error:", lastError);
  return res.status(500).json({ text: `Lỗi AI (Hệ thống Google đang quá tải): ${lastError?.message}` });
}
