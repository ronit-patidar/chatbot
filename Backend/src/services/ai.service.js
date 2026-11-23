
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from .env");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateResponse(content) {
    try {

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: content,
            config: {
                temperature: 0.7,
                systemInstruction: "You are Aurora, a helpful and accurate AI assistant. Give clear and concise answers."
            }
        });


        const text = response.text;

        if (!text) {
            console.log("Gemini returned no text:", response);
            throw new Error("Gemini returned an empty response");
        }

        return text;

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        console.error("Status:", error.status);
        throw error;
    }
}
module.exports = {
    generateResponse
};
