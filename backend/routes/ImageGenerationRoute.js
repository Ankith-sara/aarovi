import express from 'express';
import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';

const imageGenerationRouter = express.Router();

const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0';

const generateImageHF = async (prompt, apiKey) => {
    const response = await axios.post(
        HF_API_URL,
        {
            inputs: prompt,
            parameters: { width: 1024, height: 1024, num_inference_steps: 30, guidance_scale: 7.5 }
        },
        {
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', Accept: 'image/png' },
            responseType: 'arraybuffer',
            timeout: 120000
        }
    );
    return Buffer.from(response.data);
};

const uploadBufferToCloudinary = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'aarovi/ai-designs', public_id: filename, resource_type: 'image', format: 'webp', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
            (error, result) => { if (error) reject(error); else resolve(result.secure_url); }
        );
        stream.end(buffer);
    });
};

imageGenerationRouter.post('/generate-design-image', async (req, res) => {
    try {
        const {
            prompt,
            dressType = 'Kurta',
            fabric = 'Cotton',
            gender = 'Women',
            imageCount = 2,
            model = 'sdxl'
        } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ success: false, error: 'Prompt is required' });
        }

        const hfKey = process.env.HF_API_KEY;
        if (!hfKey) {
            console.error('[ImageGen] HF_API_KEY is not set. Add it to backend/.env');
            return res.status(500).json({ success: false, error: 'Image generation API key not configured. Add HF_API_KEY to backend/.env' });
        }

        const enhancedPrompt = `${prompt}, ${gender.toLowerCase()} ${dressType} fashion design, ${fabric} fabric, Indian ethnic wear, intricate traditional patterns, detailed textile, studio photography, high quality, 8k`;
        console.log(`[ImageGen] Generating ${imageCount} image(s) via HF SDXL | prompt: "${enhancedPrompt.slice(0, 80)}..."`);

        const images = [];
        for (let i = 0; i < imageCount; i++) {
            try {
                console.log(`[ImageGen] Requesting image ${i + 1}/${imageCount}...`);
                const buffer = await generateImageHF(enhancedPrompt, hfKey);
                const filename = `design_${Date.now()}_${i}`;
                const url = await uploadBufferToCloudinary(buffer, filename);
                console.log(`[ImageGen] Image ${i + 1} OK → ${url.slice(0, 70)}`);
                images.push({ success: true, error: null, url, description: `${prompt} - Design ${i + 1}` });
            } catch (err) {
                const status = err.response?.status;
                let body = '';
                if (err.response?.data) {
                    try { body = Buffer.from(err.response.data).toString('utf-8'); }
                    catch (_) { body = String(err.response.data); }
                }
                console.error(`[ImageGen] Image ${i + 1} failed — HTTP ${status}: ${body || err.message}`);

                if (status === 503) {
                    console.log('[ImageGen] Model loading — waiting 20s then retrying...');
                    await new Promise(r => setTimeout(r, 20000));
                    try {
                        const buffer = await generateImageHF(enhancedPrompt, hfKey);
                        const filename = `design_${Date.now()}_${i}_retry`;
                        const url = await uploadBufferToCloudinary(buffer, filename);
                        console.log(`[ImageGen] Image ${i + 1} retry OK → ${url.slice(0, 70)}`);
                        images.push({ success: true, error: null, url, description: `${prompt} - Design ${i + 1}` });
                        continue;
                    } catch (retryErr) {
                        console.error(`[ImageGen] Image ${i + 1} retry also failed:`, retryErr.message);
                    }
                }

                const msg = (() => {
                    try { return JSON.parse(body)?.error || body || err.message; }
                    catch (_) { return body || err.message || 'Unknown error'; }
                })();
                images.push({ success: false, error: `${status ? `HTTP ${status}: ` : ''}${msg}`, url: null, description: `Design ${i + 1} - Failed` });
            }
        }

        const successCount = images.filter(img => img.success).length;
        console.log(`[ImageGen] Done — ${successCount}/${imageCount} succeeded`);
        return res.status(200).json({ success: successCount > 0, images, totalRequested: imageCount, totalGenerated: successCount });

    } catch (error) {
        console.error('[ImageGen] Route error:', error.message);
        return res.status(500).json({ success: false, error: error.message || 'Image generation failed' });
    }
});

export default imageGenerationRouter;