// src/lib/genai.js or genaiService.js

import { GoogleGenAI } from '@google/genai';

export async function generateFromAI(promptText) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY,
  });

  const model = 'gemini-2.0-flash';

  const response = await ai.models.generateContentStream({
    model,
    contents: [
      {
        role: 'user',
        parts: [{ text: promptText }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  let result = '';
  for await (const chunk of response) {
    if (chunk.text) result += chunk.text;
  }

  return result;
}
