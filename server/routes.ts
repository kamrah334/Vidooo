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

  // Serve uploaded files and generated content
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

    const huggingFaceToken = process.env.HUGGING_FACE_TOKEN || process.env.HF_TOKEN || "";
    
    if (!huggingFaceToken) {
      console.error("No Hugging Face token found");
      await storage.updateVideoGeneration(generationId, { 
        status: "failed" 
      });
      return;
    }

    console.log(`Starting video-like generation for: ${generation.script}`);
    
    // Since video generation models aren't available through free Inference API,
    // we'll create a sequence of images that simulates video using available text-to-image models
    await generateImageSequence(generationId, generation, huggingFaceToken);

  } catch (error) {
    console.error("Video generation failed:", error);
    await storage.updateVideoGeneration(generationId, { 
      status: "failed" 
    });
  }
}

async function generateImageSequence(generationId: string, generation: any, token: string) {
  try {
    // Generate multiple frames using FLUX text-to-image (which IS available)
    const numFrames = Math.min(generation.duration * 2, 8); // Generate fewer frames for demo
    const frames: Buffer[] = [];
    
    console.log(`Generating ${numFrames} frames for video simulation...`);
    
    for (let i = 0; i < numFrames; i++) {
      // Create slightly varied prompts for each frame to simulate motion
      const framePrompt = createFramePrompt(generation.script, i, numFrames);
      
      console.log(`Generating frame ${i + 1}/${numFrames}: ${framePrompt}`);
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: framePrompt,
            parameters: {
              num_inference_steps: 20,
              guidance_scale: 3.5,
              width: 1024,
              height: 768
            }
          }),
        }
      );

      if (!response.ok) {
        // Handle model loading or temporary errors
        if (response.status === 503) {
          console.log(`Model loading for frame ${i + 1}, waiting...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
          // Skip this frame and continue
          continue;
        }
        throw new Error(`Frame ${i + 1} generation failed: ${response.status}`);
      }

      const imageBlob = await response.blob();
      if (imageBlob.size > 1000) {
        frames.push(Buffer.from(await imageBlob.arrayBuffer()));
      }

      // Small delay between frames to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (frames.length === 0) {
      throw new Error('No frames were generated successfully');
    }

    console.log(`Generated ${frames.length} frames, creating video...`);
    
    // Create a simple "video" by saving the frames as individual images
    // In a real implementation, you'd combine these into an actual video file
    const videoDir = path.join(process.cwd(), 'uploads', `video_${generationId}`);
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }
    
    // Save frames as images
    frames.forEach((frame, index) => {
      fs.writeFileSync(path.join(videoDir, `frame_${index + 1}.jpg`), frame);
    });
    
    // Create a simple HTML file that shows the frames in sequence (animated slideshow)
    const htmlContent = createVideoHTML(generationId, frames.length);
    const htmlPath = `uploads/video_${generationId}.html`;
    fs.writeFileSync(htmlPath, htmlContent);
    
    console.log(`Video simulation created: ${frames.length} frames saved`);
    
    // Update generation with completed "video" (actually an animated slideshow)
    await storage.updateVideoGeneration(generationId, {
      status: "completed",
      videoUrl: `/${htmlPath}`,
    });
    
  } catch (error) {
    console.error('Image sequence generation failed:', error);
    throw error;
  }
}

function createFramePrompt(baseScript: string, frameIndex: number, totalFrames: number): string {
  // Create variations for each frame to simulate motion/progression
  const variations = [
    "", "slight movement", "gentle motion", "dynamic action", 
    "flowing movement", "subtle change", "graceful motion", "smooth transition"
  ];
  
  const variation = variations[frameIndex % variations.length];
  return `${baseScript}, ${variation}, high quality, cinematic, detailed`;
}

function createVideoHTML(generationId: string, frameCount: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>AI Generated Video Simulation</title>
    <style>
        body { 
            margin: 0; 
            background: #000; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        .video-container { 
            text-align: center; 
            max-width: 800px;
        }
        .frame { 
            max-width: 100%; 
            height: auto; 
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(255,255,255,0.1);
        }
        .controls { 
            margin-top: 20px; 
            color: white;
        }
        .info {
            color: #888;
            margin-bottom: 20px;
            font-size: 14px;
        }
        button {
            background: #6366f1;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            margin: 0 5px;
            cursor: pointer;
        }
        button:hover { background: #4f46e5; }
    </style>
</head>
<body>
    <div class="video-container">
        <div class="info">
            AI Video Simulation - ${frameCount} frames generated<br>
            <small>Note: Due to API limitations, this shows an animated sequence instead of a true video</small>
        </div>
        <img id="frame" class="frame" src="/uploads/video_${generationId}/frame_1.jpg" alt="Video frame">
        <div class="controls">
            <button onclick="play()">▶️ Play</button>
            <button onclick="pause()">⏸️ Pause</button>
            <button onclick="reset()">⏮️ Reset</button>
            <div style="margin-top: 10px;">
                Frame: <span id="frameNumber">1</span> / ${frameCount}
            </div>
        </div>
    </div>

    <script>
        let currentFrame = 1;
        let isPlaying = false;
        let interval;
        const totalFrames = ${frameCount};

        function updateFrame() {
            document.getElementById('frame').src = \`/uploads/video_${generationId}/frame_\${currentFrame}.jpg\`;
            document.getElementById('frameNumber').textContent = currentFrame;
        }

        function play() {
            if (isPlaying) return;
            isPlaying = true;
            interval = setInterval(() => {
                currentFrame++;
                if (currentFrame > totalFrames) {
                    currentFrame = 1; // Loop
                }
                updateFrame();
            }, 500); // 2 FPS for demo
        }

        function pause() {
            isPlaying = false;
            clearInterval(interval);
        }

        function reset() {
            pause();
            currentFrame = 1;
            updateFrame();
        }
    </script>
</body>
</html>`;
}
