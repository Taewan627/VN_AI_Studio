
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI SDK with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateDialogue(context: string, characters: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 lines of visual novel dialogue based on this context: "${context}". Available characters: ${characters.join(", ")}. Narrator is also available.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              characterName: { type: Type.STRING },
              text: { type: Type.STRING }
            },
            required: ["characterName", "text"]
          }
        }
      }
    });

    // Extract text output directly from the response object's .text property.
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
}

export async function generateImage(prompt: string, aspectRatio: "16:9" | "1:1" | "3:4" = "16:9") {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Visual novel style art, high quality, professional illustration, ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    // Iterate through candidates and parts to find the image data.
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}

export async function generatePlotIdeas(theme: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 3 unique visual novel plot summaries based on the theme: "${theme}". Include a title and a 2-sentence summary for each.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING }
            },
            required: ["title", "summary"]
          }
        }
      }
    });

    // Extract text output directly from the response object's .text property.
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Plot Idea Error:", error);
    return [];
  }
}
