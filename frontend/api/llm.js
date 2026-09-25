import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
  const { prompt_text } = req.body;
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ text: "Lỗi: Chưa cấu hình LLM_API_KEY trên Vercel" });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
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
      // Nếu không phải lỗi 503 (quá tải) hoặc 404 (không tồn tại), mà là lỗi xác thực 400/403 thì nên dừng luôn
      if (error.message.includes("API key not valid")) {
        break;
      }
    }
  }

  // Nếu tất cả đều thất bại
  console.error("All Gemini models failed. Last error:", lastError);
  return res.status(500).json({ text: `Lỗi AI (Hệ thống Google đang quá tải): ${lastError?.message}` });
}
