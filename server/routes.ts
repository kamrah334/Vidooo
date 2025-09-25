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
      await storage.updateVideoGeneration(generationId, { 
        status: "failed" 
      });
      return;
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt",
      {
        headers: {
          Authorization: `Bearer ${huggingFaceToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: generation.script,
          parameters: {
            image: generation.characterImageUrl,
            num_frames: Math.min(generation.duration * 8, 25), // ~8 fps
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const videoBlob = await response.blob();
    
    // Save video file
    const videoPath = `uploads/video_${generationId}.mp4`;
    const buffer = Buffer.from(await videoBlob.arrayBuffer());
    fs.writeFileSync(videoPath, buffer);
    
    // Update generation with completed video
    await storage.updateVideoGeneration(generationId, {
      status: "completed",
      videoUrl: `/${videoPath}`,
    });

  } catch (error) {
    console.error("Video generation failed:", error);
    await storage.updateVideoGeneration(generationId, { 
      status: "failed" 
    });
  }
}
