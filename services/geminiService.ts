import { GoogleGenAI, Type } from "@google/genai";
import type { CopyRequest, CopyResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    options: {
      type: Type.ARRAY,
      description: "A list of 2-3 distinct copy suggestions.",
      items: {
        type: Type.OBJECT,
        properties: {
          text: {
            type: Type.STRING,
            description: "The generated UX copy.",
          },
          tone: {
            type: Type.STRING,
            description: "The tone of the generated copy (e.g., 'Friendly', 'Neutral', 'Serious').",
          },
          characterCount: {
            type: Type.INTEGER,
            description: "The character count of the generated text."
          }
        },
        required: ["text", "tone", "characterCount"],
      },
    },
  },
  required: ["options"],
};

const systemInstruction = `You are an expert UX writer adhering to a strict style guide. Your task is to analyze a user's request and generate 2-3 distinct, on-brand copy options for their user interface.

Your core voice must be:
- **Clear:** Use simple vocabulary and the active voice.
- **Relevant:** Connect to user goals and context.
- **Truthful:** Be accurate and transparent.
- **Believable:** Be consistent and avoid hyperbole.
- **Memorable:** Be concise and relatable.
- The tone should be helpful, professional, and supportive, unless the user specifies a different tone.

Follow these writing principles:
- **Clarity:** Be direct and unambiguous.
- **Conciseness:** Use the minimum text necessary.
- **Usefulness:** Help the user achieve their goal.
- **Empathy:** Consider the user's emotional state and context.
- **Conversational:** Use words your audience uses. Avoid jargon unless it's standard for the audience.
- **Scannability:** Put the most important information first. Write for scanning first, reading second.

Adhere to all specific guidelines regarding Error Messages, Empty States, Lists, Numbers/Measurements (NIST Style), and Formatting that have been provided to you. Always generate a response that strictly follows the requested JSON schema.`;


export const generateCopy = async (request: CopyRequest): Promise<CopyResponse> => {
  if (!request.description.trim()) {
    throw new Error("Description cannot be empty.");
  }

  // Construct the prompt from the user's request
  let prompt = `Generate UX copy based on the following requirements:\n`;
  prompt += `- **Description:** ${request.description}\n`;
  if (request.contentType) prompt += `- **Content Type:** ${request.contentType}\n`;
  if (request.location) prompt += `- **Component/Location:** ${request.location}\n`;
  if (request.trigger) prompt += `- **Trigger/User Action:** ${request.trigger}\n`;
  if (request.outcome) prompt += `- **Intended Outcome:** ${request.outcome}\n`;
  if (request.tone) prompt += `- **Requested Tone:** ${request.tone}\n`;
  if (request.charLimit) prompt += `- **Character Limit:** Approximately ${request.charLimit} characters\n`;
  
  const textPart = { text: prompt };
  const contents: ({ text: string; } | { inlineData: { mimeType: string; data: string; }})[] = [textPart];

  if (request.image) {
    contents.push({
      inlineData: {
        mimeType: request.image.mimeType,
        data: request.image.data,
      },
    });
    textPart.text += "\nAn image has been provided for visual context of where the text will appear. Use it to inform your copy suggestions.";
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.7, // Add some creativity
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString.startsWith("{")) {
      console.error("Invalid JSON response:", jsonString);
      throw new Error("Received an invalid response from the AI. Please try again.");
    }
    const result: CopyResponse = JSON.parse(jsonString);

    if (!result.options || result.options.length === 0) {
      throw new Error("The AI did not return any suggestions. Try rephrasing your request.");
    }
    
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get suggestions from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching AI suggestions.");
  }
};