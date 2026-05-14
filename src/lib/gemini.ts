import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getFutureSelfResponse(systemPrompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [...history.map(h => ({
      role: h.role === 'model' ? 'assistant' : 'user',
      parts: h.parts
    })), { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: systemPrompt,
    }
  });

  return response.text || "No response received.";
}
