import OpenAI from 'openai';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Helper: Try Gemini first, fallback to OpenAI if error.
 */
async function generateWithGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Gemini API failed: ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
}

/**
 * Chat Completion Handler
 */
const chatCompletion = async (req, res) => {
  try {
    const { message, context = "general" } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const systemPrompts = {
      fashion: "You are Aharyas Fashion Advisor, an expert in Indian heritage fashion, traditional crafts like Ikkat and Kalamkari, styling advice, and conscious luxury fashion.",
      general: "You are a helpful assistant for Aharyas, India's conscious luxury fashion brand.",
      support: "You are a customer support assistant for Aharyas fashion brand, helping with policies, orders, and general inquiries.",
    };

    const prompt = `${systemPrompts[context] || systemPrompts.general}\n\nUser: ${message}`;

    let aiResponse = "";

    // ✅ Try Gemini first
    try {
      aiResponse = await generateWithGemini(prompt);
      console.log("✅ Response generated using Gemini API");
    } catch (err) {
      console.warn("⚠️ Gemini failed, falling back to OpenAI:", err.message);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompts[context] || systemPrompts.general },
          { role: "user", content: message },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      aiResponse = completion.choices[0].message.content;
    }

    res.json({ success: true, response: aiResponse });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    res.status(500).json({ success: false, message: "AI service failed", error: error.message });
  }
};

/**
 * Product Description Generator
 */
const generateProductDescription = async (req, res) => {
  try {
    const { productName, features, category, heritage } = req.body;

    const prompt = `Create an elegant product description for "${productName}", a ${category} from Aharyas conscious luxury fashion brand.

Features: ${features}
Heritage/Craft: ${heritage}

Write in a sophisticated tone that highlights the craftsmanship, heritage value, and luxury positioning. Keep it between 100-150 words.`;

    let description = "";

    // Try Gemini first
    try {
      description = await generateWithGemini(prompt);
      console.log("Description generated using Gemini API");
    } catch (err) {
      console.warn("Gemini failed, falling back to OpenAI:", err.message);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a luxury fashion copywriter specializing in Indian heritage and conscious fashion." },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.8,
      });

      description = completion.choices[0].message.content;
    }

    res.json({ success: true, description });
  } catch (error) {
    console.error("Product Description Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to generate product description", error: error.message });
  }
};

export { chatCompletion, generateProductDescription };