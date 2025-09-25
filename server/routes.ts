import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoGenerationSchema } from "@shared/schema";
import multer from "multer";
import fs from "fs";
import path from "path";

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    res.json({ status: "ok" });
  });

  // Upload character image endpoint
  app.post("/api/upload-character", upload.single('character'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // In a real implementation, you would upload to a cloud storage service
      // For now, we'll just return a local file path
      const imageUrl = `/uploads/${req.file.filename}`;
      
      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Generate video endpoint
  app.post("/api/generate-video", async (req, res) => {
    try {
      const validation = insertVideoGenerationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request data",
          errors: validation.error.errors 
        });
      }

      const generation = await storage.createVideoGeneration(validation.data);
      
      // Start video generation process (async)
      generateVideoAsync(generation.id);
      
      res.json(generation);
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ message: "Failed to start video generation" });
    }
  });

  // Get video generation status
  app.get("/api/generation/:id", async (req, res) => {
    try {
      const generation = await storage.getVideoGeneration(req.params.id);
      if (!generation) {
        return res.status(404).json({ message: "Generation not found" });
      }
      res.json(generation);
    } catch (error) {
      console.error("Status check error:", error);
      res.status(500).json({ message: "Failed to check generation status" });
    }
  });

  // Get generation history
  app.get("/api/generations", async (req, res) => {
    try {
      const generations = await storage.getVideoGenerations();
      res.json(generations);
    } catch (error) {
      console.error("History fetch error:", error);
      res.status(500).json({ message: "Failed to fetch generation history" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const httpServer = createServer(app);
  return httpServer;
}

async function generateVideoAsync(generationId: string) {
  try {
    // Update status to processing
    await storage.updateVideoGeneration(generationId, { status: "processing" });
    
    const generation = await storage.getVideoGeneration(generationId);
    if (!generation) return;

    // Call Hugging Face Stable Video Diffusion API
    const huggingFaceToken = process.env.HUGGING_FACE_TOKEN || process.env.HF_TOKEN || "";
    
    if (!huggingFaceToken) {
      console.error("No Hugging Face token found");
      await storage.updateVideoGeneration(generationId, { 
        status: "failed" 
      });
      return;
    }

    // Read the uploaded image file
    const imagePath = path.join(process.cwd(), generation.characterImageUrl.replace('/', ''));
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    const imageBuffer = fs.readFileSync(imagePath);
    
    // Create FormData for multipart request
    const formData = new FormData();
    const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('inputs', imageBlob, 'character.jpg');
    
    // Add parameters including the script as prompt
    const parameters: any = {
      num_frames: Math.min(generation.duration * 8, 25), // ~8 fps, max 25 frames
      motion_bucket_id: 127,
      fps: 8,
      noise_aug_strength: 0.02
    };
    
    if (generation.script && generation.script.trim()) {
      parameters.conditioning_text = generation.script;
    }
    
    formData.append('parameters', JSON.stringify(parameters));

    // Retry logic for model loading
    const maxRetries = 3;
    let retryDelay = 20;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      console.log(`Attempting video generation (attempt ${attempt + 1}/${maxRetries})`);
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt",
        {
          headers: {
            Authorization: `Bearer ${huggingFaceToken}`,
            Accept: "video/mp4",
          },
          method: "POST",
          body: formData,
        }
      );

      // Handle model loading (503 status)
      if (response.status === 503) {
        try {
          const errorData = await response.json();
          const estimatedTime = errorData.estimated_time || retryDelay;
          console.log(`Model loading, waiting ${estimatedTime} seconds...`);
          
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, estimatedTime * 1000));
            retryDelay *= 1.5; // Exponential backoff
            continue;
          }
        } catch {
          console.log(`Model loading, waiting ${retryDelay} seconds...`);
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, retryDelay * 1000));
            continue;
          }
        }
      }
      
      if (!response.ok) {
        let errorMessage = `API request failed: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.error || errorData.message || response.statusText}`;
        } catch {
          errorMessage += ` - ${response.statusText}`;
        }
        
        if (attempt === maxRetries - 1) {
          throw new Error(errorMessage);
        } else {
          console.log(`${errorMessage}, retrying...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay * 1000));
          continue;
        }
      }

      // Check if response is video content
      const contentType = response.headers.get('content-type') || '';
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      
      if (!contentType.includes('video') && !contentType.includes('application/octet-stream') && contentLength < 1000) {
        // Likely an error response
        const responseText = await response.text();
        throw new Error(`Invalid response: ${responseText}`);
      }

      const videoBlob = await response.blob();
      
      if (videoBlob.size < 1000) {
        throw new Error('Generated video is too small, likely an error');
      }
      
      // Save video file
      const videoPath = `uploads/video_${generationId}.mp4`;
      const buffer = Buffer.from(await videoBlob.arrayBuffer());
      fs.writeFileSync(videoPath, buffer);
      
      console.log(`Video generated successfully: ${videoPath} (${videoBlob.size} bytes)`);
      
      // Update generation with completed video
      await storage.updateVideoGeneration(generationId, {
        status: "completed",
        videoUrl: `/${videoPath}`,
      });
      
      return; // Success, exit retry loop
    }
    
    // If we get here, all retries failed
    throw new Error('All retry attempts failed');

  } catch (error) {
    console.error("Video generation failed:", error);
    await storage.updateVideoGeneration(generationId, { 
      status: "failed" 
    });
  }
}
