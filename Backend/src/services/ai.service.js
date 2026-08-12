import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let model = null;

function initializeModel() {
  if (!model) {
    if (!process.env.GOOGLE_API_KEY) {
      console.warn("Warning: GOOGLE_API_KEY not found in environment variables");
      return null;
    }
    model = new ChatGoogleGenerativeAI({
    //   model: "gemini-2.0-flash",
      model: "gemini-3.5-flash",
    //   model: "antigravity",
      apiKey: process.env.GOOGLE_API_KEY
    });
  }
  return model;
}

export async function TestAi() {
  try {
    const aiModel = initializeModel();
    if (!aiModel) {
      console.log("AI model not initialized - API key missing");
      return null;
    }
    const response = await aiModel.invoke("Hello, how are you?");
    console.log("AI Response:", response);
    return response;
  } catch (error) {
    console.error("Error invoking AI model:", error);
    throw error;
  }
}