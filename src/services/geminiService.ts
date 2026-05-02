import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatWithHealthu = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `You are Healthu, a dedicated medical AI assistant within the MedVault app. 
        Your goal is to help patients understand their health data, provide general wellbeing advice, and explain medical terminology in simple terms.
        
        STRICT RULES:
        1. Always state you are an AI, not a doctor.
        2. Never provide a definitive diagnosis.
        3. Always suggest consulting a professional for serious concerns.
        4. Be empathetic, professional, and clear.
        5. Keep responses concise and mobile-friendly.`,
      }
    });

    const response = await chat.sendMessage({
      message: message,
    });

    return response.text;
  } catch (error) {
    console.error("Healthu Error:", error);
    throw new Error("I'm having trouble connecting right now. Please try again later.");
  }
};
