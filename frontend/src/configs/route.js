// app/api/generate-design-image/route.js
// API Route for DesignCanvas AI Image Generation

import { GenerateImageScript } from "@/configs/AiModel";
import { NextResponse } from "next/server";

const BASE_URL = 'https://aigurulab.tech';
const API_KEY = process.env.NEXT_PUBLIC_AIGURULAB_API_KEY || 'ee7a3cfc-f5a6-4dab-a3cc-57e88cc5b4d2';

/**
 * POST /api/generate-design-image
 * Generates textile design images for garments using Gemini AI + AIGuruLab
 * 
 * Request Body:
 * {
 *   prompt: string,        // User's design description
 *   dressType: string,     // e.g., "Kurti", "Kurta", "Lehenga"
 *   fabric: string,        // e.g., "Silk", "Cotton", "Linen"
 *   gender: string,        // "Women" or "Men"
 *   imageCount?: number,   // Optional, default 3
 *   model?: string         // Optional, "sdxl" or "flux", default "sdxl"
 * }
 * 
 * Response:
 * {
 *   success: boolean,
 *   images: [{
 *     prompt: string,
 *     url: string,
 *     description: string,
 *     generatedAt: string,
 *     model: string,
 *     source: string
 *   }],
 *   error?: string
 * }
 */
export async function POST(req) {
  try {
    const { 
      prompt, 
      dressType = 'Kurti', 
      fabric = 'Cotton', 
      gender = 'Women',
      imageCount = 3,
      model = 'sdxl'
    } = await req.json();

    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Design prompt is required' 
        },
        { status: 400 }
      );
    }

    // Step 1: Generate detailed image prompts using Gemini AI
    console.log('🎨 Step 1: Generating AI prompts...');
    
    const fullPrompt = `Generate image prompts for garment design reference based on: "${prompt}". 
      
Context:
- Garment Type: ${dressType}
- Fabric: ${fabric}
- Gender: ${gender}

Create ${imageCount} detailed image prompts suitable for textile patterns, fabric prints, or embroidery designs.
Focus on patterns, textures, motifs, and design elements that would work well on ${fabric} fabric.
Each prompt should be detailed, cinematic, and production-ready for garment manufacturing.

IMPORTANT: Make prompts suitable for seamless textile patterns and production use.

Return in this exact JSON format:
[
  {
    "imagePrompt": "detailed image generation prompt here with specific colors, patterns, and style",
    "sceneContent": "brief description of the design element and its application on ${dressType}"
  }
]

Example format for good prompts:
- Include specific colors and patterns
- Mention textile/fabric design
- Add keywords like "seamless", "repeating pattern", "production ready"
- Describe style (traditional, modern, geometric, floral, etc.)
- Include fabric texture and finish details`;

    const geminiResult = await GenerateImageScript.sendMessage(fullPrompt);
    const responseText = geminiResult.response.text();
    
    // Parse Gemini response
    let imagePrompts;
    try {
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      imagePrompts = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ Failed to parse Gemini response:', parseError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to generate design prompts',
          details: parseError.message 
        },
        { status: 500 }
      );
    }

    // Validate Gemini response
    if (!Array.isArray(imagePrompts) || imagePrompts.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid prompt generation response' 
        },
        { status: 500 }
      );
    }

    console.log(`✅ Generated ${imagePrompts.length} design prompts`);

    // Step 2: Generate actual images using AIGuruLab API
    console.log('🖼️ Step 2: Generating images with AIGuruLab...');
    
    const generatedImages = await Promise.all(
      imagePrompts.map(async (item, index) => {
        try {
          console.log(`  → Generating image ${index + 1}/${imagePrompts.length}...`);
          
          const response = await fetch(`${BASE_URL}/api/generate-image`, {
            method: 'POST',
            headers: {
              'x-api-key': API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              width: 1024,
              height: 1024,
              input: item.imagePrompt,
              model: model,
              aspectRatio: model === 'flux' ? '1:1' : undefined
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`AIGuruLab API error: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          
          console.log(`  ✅ Image ${index + 1} generated successfully`);
          
          return {
            prompt: item.imagePrompt,
            url: data.image,
            description: item.sceneContent,
            generatedAt: new Date().toISOString(),
            model: model,
            source: 'aigurulab',
            index: index + 1,
            success: true
          };
        } catch (error) {
          console.error(`  ❌ Failed to generate image ${index + 1}:`, error.message);
          
          return {
            prompt: item.imagePrompt,
            url: null,
            description: item.sceneContent,
            generatedAt: new Date().toISOString(),
            model: model,
            source: 'error',
            index: index + 1,
            success: false,
            error: error.message
          };
        }
      })
    );

    // Count successful generations
    const successfulImages = generatedImages.filter(img => img.success);
    const failedImages = generatedImages.filter(img => !img.success);

    console.log(`✅ Successfully generated ${successfulImages.length}/${generatedImages.length} images`);
    if (failedImages.length > 0) {
      console.log(`⚠️ ${failedImages.length} image(s) failed to generate`);
    }

    // Return response
    return NextResponse.json({
      success: true,
      images: generatedImages,
      stats: {
        total: generatedImages.length,
        successful: successfulImages.length,
        failed: failedImages.length,
        model: model,
        dressType: dressType,
        fabric: fabric
      }
    });

  } catch (error) {
    console.error('❌ Design image generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate design images',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate-design-image
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Design Image Generation API',
    endpoints: {
      post: {
        description: 'Generate textile design images',
        requiredFields: ['prompt', 'dressType', 'fabric', 'gender'],
        optionalFields: ['imageCount', 'model']
      }
    },
    models: ['sdxl', 'flux'],
    provider: 'AIGuruLab'
  });
}