import express from 'express';
import axios from 'axios';

const imageGenerationRouter = express.Router();

const BASE_URL = 'https://aigurulab.tech';

// POST /api/generate-design-image
imageGenerationRouter.post('/generate-design-image', async (req, res) => {
    try {
        const {
            prompt,
            dressType = 'Kurta',
            fabric = 'Cotton',
            gender = 'Women',
            imageCount = 3,
            model = 'sdxl'
        } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Prompt is required'
            });
        }

        const apiKey = process.env.AIGURULAB_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: 'Image generation API key not configured'
            });
        }

        // Build an enhanced prompt incorporating dress context (same style as project b)
        const enhancedPrompt = `${prompt}, ${gender.toLowerCase()} ${dressType} fashion design, ${fabric} fabric, Indian ethnic wear, detailed textile pattern, high quality fashion illustration`;

        // Generate multiple images in parallel (same approach as project b's GenerateImages step)
        const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
            try {
                const result = await axios.post(
                    BASE_URL + '/api/generate-image',
                    {
                        width: 1024,
                        height: 1024,
                        input: enhancedPrompt,
                        model: model,       
                        aspectRatio: '1:1' 
                    },
                    {
                        headers: {
                            'x-api-key': apiKey,
                            'Content-Type': 'application/json'
                        },
                        timeout: 60000
                    }
                );

                return {
                    success: true,
                    url: result.data.image,
                    description: `${prompt} - Design ${i + 1}`
                };
            } catch (err) {
                console.error(`Image ${i + 1} generation failed:`, err.message);
                return {
                    success: false,
                    error: err.message,
                    url: null,
                    description: `Design ${i + 1} - Generation failed`
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
        return res.status(500).json({
            success: false,
            error: error.message || 'Image generation failed'
        });
    }
});

export default imageGenerationRouter;