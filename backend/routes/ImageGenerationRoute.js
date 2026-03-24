import express from 'express';
import axios from 'axios';

const imageGenerationRouter = express.Router();

// Hugging Face Inference API — SDXL
const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0';

// Retry helper — HF cold-starts models, first request often returns 503
const queryHuggingFace = async (payload, apiToken, retries = 3, delayMs = 8000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(HF_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          Accept: 'image/png'
        },
        responseType: 'arraybuffer',
        timeout: 120000
      });
      return response.data;
    } catch (err) {
      const status = err.response?.status;

      // 503 = model loading, wait and retry
      if (status === 503 && attempt < retries) {
        console.log(`HF model loading, retrying in ${delayMs / 1000}s (attempt ${attempt}/${retries})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }

      // Surface the real error body for every other failure
      const errBody = err.response?.data
        ? Buffer.from(err.response.data).toString('utf8')
        : err.message;
      throw new Error(`HF API [${status}]: ${errBody}`);
    }
  }
};

// POST /api/generate-design-image
imageGenerationRouter.post('/generate-design-image', async (req, res) => {
  try {
    const {
      prompt,
      dressType = 'Kurta',
      fabric = 'Cotton',
      gender = 'Women',
      imageCount = 3
    } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    const apiToken = process.env.HF_API_TOKEN;
    if (!apiToken) {
      return res.status(500).json({ success: false, error: 'HF_API_TOKEN not configured' });
    }

    // Craft a detailed fashion-specific prompt
    const enhancedPrompt = `${prompt}, ${gender.toLowerCase()} ${dressType} Indian ethnic fashion design, ${fabric} fabric, ` +
      `detailed textile pattern, haute couture illustration, flat lay product shot, ` +
      `white background, sharp focus, 4k, professional fashion photography`;

    const negativePrompt = 'blurry, low quality, deformed, ugly, watermark, text, signature, ' +
      'cartoon, anime, 3d render, person wearing clothes';

    // Generate images in parallel with slight prompt variation for variety
    const variations = [
      enhancedPrompt,
      `${enhancedPrompt}, floral motifs, intricate embroidery`,
      `${enhancedPrompt}, geometric patterns, minimal design`
    ].slice(0, imageCount);

    const imagePromises = variations.map(async (variantPrompt, i) => {
      try {
        const imageBuffer = await queryHuggingFace(
          {
            inputs: variantPrompt,
            parameters: {
              negative_prompt: negativePrompt,
              num_inference_steps: 30,
              guidance_scale: 7.5,
              width: 1024,
              height: 1024
            }
          },
          apiToken
        );

        // Convert binary buffer → base64 data URL
        const base64 = Buffer.from(imageBuffer).toString('base64');
        const dataUrl = `data:image/png;base64,${base64}`;

        return {
          success: true,
          url: dataUrl,
          description: `${prompt} — Design ${i + 1}`
        };
      } catch (err) {
        console.error(`Image ${i + 1} generation failed:`, err.message);
        return {
          success: false,
          error: err.message,
          url: null,
          description: `Design ${i + 1} — Generation failed`
        };
      }
    });

    const images = await Promise.all(imagePromises);
    const successCount = images.filter(img => img.success).length;

    return res.status(200).json({
      success: successCount > 0,
      images,
      totalRequested: imageCount,
      totalGenerated: successCount
    });

  } catch (error) {
    console.error('Image generation route error:', error.message);
    return res.status(500).json({ success: false, error: error.message || 'Image generation failed' });
  }
});

export default imageGenerationRouter;