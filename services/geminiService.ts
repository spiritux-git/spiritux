
import { GoogleGenAI, Type } from "@google/genai";

export const updateSEOVisibility = async (): Promise<string[]> => {
  try {
    // Fix: Always use a named parameter { apiKey: ... } when initializing GoogleGenAI
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Analyse les tendances actuelles du marché mondial des ebooks de spiritualité, de bien-être et de mystères. Donne-moi une liste de 15 mots-clés SEO ultra-performants en français pour optimiser une boutique en ligne nommée Spiritux.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["keywords"]
        }
      }
    });

    // Fix: Access the generated text using the .text property (not a method)
    const result = JSON.parse(response.text || "{}");
    return result.keywords || [];
  } catch (error) {
    console.error("Gemini SEO update failed:", error);
    return ["spiritualité", "ebooks sacrés", "développement personnel", "mystères célestes", "bien-être holistique"];
  }
};
