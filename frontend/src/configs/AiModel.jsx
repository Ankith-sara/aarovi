const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const generateScript = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "write a two different script for 30 Seconds video on Topic: kids Story,\n\nGive me response in JSON format and follow the schema\n-{\nscripts:[\n{\ncontent:\"\n},\n],\n}" },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n{\n  \"scripts\": [\n    {\n      \"content\": \"**(Scene: Open on a child, around 5 years old, sitting wide-eyed on a comfy rug, holding a brightly illustrated book.)**\\n\\n**(VOICEOVER, warm and inviting):** Adventures await! Unleash your child's imagination with captivating kids' stories.\\n\\n**(Quick cuts of different book illustrations: a dragon, a spaceship, a friendly monster.)**\\n\\n**(VOICEOVER):** Filled with wonder, excitement, and valuable life lessons.\\n\\n**(Scene: Back to the child, now smiling and pointing at something in the book.)**\\n\\n**(VOICEOVER):** Give the gift of reading. Start their story today! [Website/App Name] \\n\\n**(On-screen text: [Website/App Name] & a call to action: \\\"Explore Stories!\\\")**\"\n    },\n    {\n      \"content\": \"**(Scene: Fast-paced montage of short, engaging video clips of diverse children reacting to audio stories: laughing, gasping, looking thoughtful.)**\\n\\n**(SOUND: Upbeat, playful music throughout)**\\n\\n**(VOICEOVER, energetic and enthusiastic):** Tired of bedtime battles?\\n\\n**(Scene: Close-up on a child's face as they listen intently, eyes closed.)**\\n\\n**(VOICEOVER):** Discover magical audio stories that make bedtime a breeze! \\n\\n**(Scene: A quick shot of a phone/tablet screen displaying the story app with colorful icons.)**\\n\\n**(VOICEOVER):** Engaging narratives, soothing voices, and endless possibilities.  Download [App Name] now! \\n\\n**(On-screen text: [App Name] & a call to action: \\\"Free Trial!\\\")**\"\n    }\n  ]\n}\n```" },
      ],
    },
  ],
});

export const GenerateImageScript = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "Generate Image prompt of cinematic style with all details for each scene for 30 seconds video: script: The dim glow of streetlights flickers through the windows. The bus lurches forward, half-empty, with weary passengers swaying in their seats. ROSA PARKS (42, dignified, resolute) clutches her purse, staring ahead as the BUS DRIVER (white, stern, late 40s) stops and glances back.\n- Just Give specifing image prompt dependds on the stort line\n- do not give camera angle image prompt\n- Follow the following schema and return JSON data (Max 4-5 Images)\n- [\n    {\n        imagePrompt:'',\n        sceneContent: '<Script Content>'\n    }\n]\nand don't  mention this text I am unable to generate image prompts with the \"Gemini 2.0 Flash Experimental\" model when the selected output format is \"Images and text\". However, I can help you answer your prompt" },
      ],
    },
    {
      role: "model",
      parts: [
        { text: "```json\n[\n    {\n        \"imagePrompt\": \"Cinematic still. Dimly lit bus interior at night. Streetlights blur through rain-streaked windows. Rosa Parks, 42, looking straight ahead, holding a purse. Focus on her dignified and resolute expression. Weary passengers in the background, softly illuminated by the flickering lights. Realistic rendering, film grain.\",\n        \"sceneContent\": \"The dim glow of streetlights flickers through the windows. The bus lurches forward, half-empty, with weary passengers swaying in their seats. ROSA PARKS (42, dignified, resolute) clutches her purse, staring ahead...\"\n    },\n    {\n        \"imagePrompt\": \"Cinematic still. Close-up on the Bus Driver, white, stern, late 40s. He is looking back over his shoulder, a disapproving expression on his face. The interior of the bus is visible behind him, softly lit. Moody lighting, dramatic shadows, film grain.\",\n        \"sceneContent\": \"...as the BUS DRIVER (white, stern, late 40s) stops and glances back.\"\n    }\n]\n```" },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
