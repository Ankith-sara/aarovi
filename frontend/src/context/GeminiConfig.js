import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp", // Using the latest experimental model
});

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// AI Design Generator
export const generateDesignChat = () => {
  return model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `Generate a fashion design customization in JSON format.

Return this exact structure:
{
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "zoneColors": {
    "body": "#hex",
    "sleeve_left": "#hex",
    "sleeve_right": "#hex"
  },
  "embroidery": {
    "type": "maggam|threadWork|sequins|beadwork|zardozi|none",
    "zones": ["body"],
    "density": "light|medium|heavy"
  },
  "fabricPrint": "block|bagru|floral|kalamkari|shibori|painting|none",
  "printZones": ["body"],
  "sleeveStyle": "full|elbow|short|sleeveless",
  "designDescription": "description",
  "tailorNotes": "instructions"
}`
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `{
  "colorPalette": ["#DC2626", "#F59E0B", "#FFFFFF"],
  "zoneColors": {
    "body": "#DC2626",
    "sleeve_left": "#F59E0B",
    "sleeve_right": "#F59E0B"
  },
  "embroidery": {
    "type": "maggam",
    "zones": ["body"],
    "density": "heavy"
  },
  "fabricPrint": "none",
  "printZones": [],
  "sleeveStyle": "full",
  "designDescription": "Traditional red kurta with golden sleeves and heavy maggam embroidery",
  "tailorNotes": "Apply heavy maggam work on the body section with traditional patterns"
}`
          },
        ],
      },
    ],
  });
};

// AI Design Editor
export const editDesignChat = () => {
  return model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `Modify a garment design based on user request.

Return this exact JSON structure:
{
  "modifications": {
    "sleeveStyle": "full|elbow|short|sleeveless|null",
    "baseColor": "#hex or null",
    "zoneColors": {"zone_id": "#hex"},
    "applyEmbroidery": {"zones": ["zone_id"], "pattern": "maggam|threadWork|sequins"},
    "applyPrint": {"zones": ["zone_id"], "print": "block|floral"},
    "removeFromZones": ["zone_id"]
  },
  "explanation": "What changed"
}`
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `{
  "modifications": {
    "sleeveStyle": "short",
    "baseColor": null,
    "zoneColors": {
      "sleeve_left": "#3B82F6",
      "sleeve_right": "#3B82F6"
    },
    "applyEmbroidery": null,
    "applyPrint": null,
    "removeFromZones": []
  },
  "explanation": "Changed sleeve length to short and made sleeves blue"
}`
          },
        ],
      },
    ],
  });
};

export default genAI;