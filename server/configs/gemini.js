import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

async function main(prompt) {
  try {
    // Use the text-only model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    // Generate content with proper formatting
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Get the response text
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export default main;
