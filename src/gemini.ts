import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

// 1. Initialize the Client
// It will automatically check process.env.GEMINI_API_KEY if you leave the object empty
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_KEY
});
const imagePath = "../public/image1.jpg"; // Update this path to your image file

export default async function main() {
  try {
    // 2. Prepare the image data
    // Read the file and convert to Base64
    const fileData = fs.readFileSync(imagePath);
    const base64Data = fileData.toString("base64");

    // 3. Call the API using the new structure
    // We use gemini-2.0-flash (or 1.5-flash) for fast multimodal tasks
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: "Describe this image in detail, focusing on the main subjects and the background." },
            {
              inlineData: {
                mimeType: "image/jpeg", // Ensure this matches your file type
                data: base64Data,
              },
            },
          ],
        },
      ],
    });

    // 4. Output the result
    console.log("--- Description ---");
    console.log(response.text);

  } catch (error) {
    if (error instanceof Error) {
      console.error("API Error:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
  }
}

// Run the function
