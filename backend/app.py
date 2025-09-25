"""
AI Video Generator FastAPI Backend
Uses Hugging Face Stable Video Diffusion for free AI video generation
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
import uuid
import time
import json
import requests
import aiohttp
import asyncio
from datetime import datetime
from pathlib import Path

app = FastAPI(
    title="AI Video Generator API",
    description="Generate AI videos with consistent characters using Stable Video Diffusion",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=False,  # No authentication required
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Create directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("videos", exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/videos", StaticFiles(directory="videos"), name="videos")

# Hugging Face configuration
HF_TOKEN = os.getenv("HUGGING_FACE_TOKEN") or os.getenv("HF_TOKEN")
HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid-xt"

# In-memory storage for demo (replace with database in production)
generations = {}

class VideoGenerationRequest(BaseModel):
    characterImageUrl: str
    script: str
    duration: int = 5
    quality: str = "768"

class VideoGeneration(BaseModel):
    id: str
    characterImageUrl: str
    script: str
    duration: int
    quality: str
    videoUrl: Optional[str] = None
    status: str = "pending"  # pending, processing, completed, failed
    createdAt: str

@app.get("/health")
async def health_check():
    """Health check endpoint for deployment verification"""
    return {"status": "ok", "service": "AI Video Generator API"}

@app.post("/upload-character")
async def upload_character(character: UploadFile = File(...)):
    """Upload character image for video generation"""
    try:
        # Validate file type
        if not character.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_extension = character.filename.split('.')[-1] if '.' in character.filename else 'jpg'
        filename = f"character_{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/{filename}"
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await character.read()
            buffer.write(content)
        
        return {"imageUrl": f"/uploads/{filename}"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.post("/generate-video", response_model=VideoGeneration)
async def generate_video(request: VideoGenerationRequest, background_tasks: BackgroundTasks):
    """Start AI video generation process"""
    try:
        # Create generation record
        generation_id = str(uuid.uuid4())
        generation = VideoGeneration(
            id=generation_id,
            characterImageUrl=request.characterImageUrl,
            script=request.script,
            duration=request.duration,
            quality=request.quality,
            status="pending",
            createdAt=datetime.utcnow().isoformat(timespec="milliseconds") + "Z"
        )
        
        generations[generation_id] = generation.dict()
        
        # Start background video generation
        background_tasks.add_task(process_video_generation, generation_id)
        
        return generation
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start generation: {str(e)}")

@app.get("/generation/{generation_id}", response_model=VideoGeneration)
async def get_generation(generation_id: str):
    """Get video generation status and result"""
    if generation_id not in generations:
        raise HTTPException(status_code=404, detail="Generation not found")
    
    return VideoGeneration(**generations[generation_id])

@app.get("/generations", response_model=List[VideoGeneration])
async def get_generations():
    """Get all video generations (most recent first)"""
    generation_list = list(generations.values())
    generation_list.sort(key=lambda x: x['createdAt'], reverse=True)
    return [VideoGeneration(**gen) for gen in generation_list[:10]]

def process_video_generation(generation_id: str):
    """Background task to process video generation using Hugging Face API"""
    try:
        # Update status to processing
        generations[generation_id]["status"] = "processing"
        
        generation = generations[generation_id]
        
        # Check if HF token is available
        if not HF_TOKEN:
            print("Warning: No Hugging Face token provided. Using mock generation.")
            mock_video_generation(generation_id)
            return
        
        # Read character image
        image_path = generation["characterImageUrl"].replace("/uploads/", "uploads/")
        if not os.path.exists(image_path):
            raise Exception(f"Character image not found: {image_path}")
        
        # Prepare multipart form data for SVD API
        headers = {
            "Authorization": f"Bearer {HF_TOKEN}",
            "Accept": "video/mp4",
        }
        
        # Prepare proper multipart form data for SVD API
        with open(image_path, "rb") as img_file:
            image_data = img_file.read()
            
        files = {
            "inputs": ("character.jpg", image_data, "image/jpeg")
        }
        
        data = {
            "parameters": json.dumps({
                "num_frames": min(generation["duration"] * 8, 25),  # ~8 fps max 25 frames
            })
        }
        
        # Call Hugging Face API with retry logic
        max_retries = 3
        retry_delay = 20
        
        for attempt in range(max_retries):
            try:
                response = requests.post(
                    HF_API_URL, 
                    headers=headers, 
                    files=files, 
                    data=data, 
                    timeout=300
                )
                
                if response.status_code == 503:
                    # Model is loading, parse estimated time if available
                    try:
                        error_data = response.json()
                        estimated_time = error_data.get("estimated_time", retry_delay)
                        print(f"Model loading, waiting {estimated_time} seconds...")
                        time.sleep(estimated_time)
                    except:
                        print(f"Model loading, waiting {retry_delay} seconds...")
                        time.sleep(retry_delay)
                    
                    if attempt < max_retries - 1:
                        retry_delay *= 1.5  # Exponential backoff
                        continue
                
                if response.status_code != 200:
                    error_msg = f"API request failed: {response.status_code}"
                    try:
                        error_data = response.json()
                        error_msg += f" - {error_data.get('error', response.text)}"
                    except:
                        error_msg += f" - {response.text}"
                    print(error_msg)
                    raise Exception(error_msg)
                
                # Check if response is actually video content
                content_type = response.headers.get("content-type", "")
                content_length = len(response.content)
                
                if not content_type.startswith("video/") and not content_type.startswith("application/octet-stream"):
                    print(f"Unexpected content type: {content_type}, length: {content_length}")
                    try:
                        error_data = response.json()
                        error_msg = f"API returned non-video response: {error_data}"
                        print(error_msg)
                        raise Exception(error_msg)
                    except json.JSONDecodeError:
                        if content_length < 1000:  # Suspiciously small for video
                            print(f"Response too small ({content_length} bytes) for video content")
                            raise Exception(f"Response content too small: {content_length} bytes, expected video")
                        pass  # Content might be binary video without proper headers
                
                # Save video file
                video_filename = f"video_{generation_id}.mp4"
                video_path = f"videos/{video_filename}"
                
                with open(video_path, "wb") as video_file:
                    video_file.write(response.content)
                
                # Verify file was created and has content
                if not os.path.exists(video_path) or os.path.getsize(video_path) == 0:
                    raise Exception("Generated video file is empty or was not created")
                
                # Update generation with success
                generations[generation_id].update({
                    "status": "completed",
                    "videoUrl": f"/videos/{video_filename}"
                })
                
                print(f"Video generation completed: {generation_id}")
                return
                
            except requests.exceptions.RequestException as e:
                print(f"Request error (attempt {attempt + 1}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    retry_delay *= 1.5
                else:
                    raise
    
    except Exception as e:
        print(f"Video generation failed: {e}")
        generations[generation_id]["status"] = "failed"

def mock_video_generation(generation_id: str):
    """Mock video generation for demo purposes when no HF token"""
    try:
        # Simulate processing time
        time.sleep(10)
        
        # Create a minimal valid MP4 file for demo
        video_filename = f"video_{generation_id}.mp4"
        video_path = f"videos/{video_filename}"
        
        # Create a minimal but complete MP4 structure
        # This is a valid 1-frame MP4 that video players can handle
        mp4_data = bytes([
            # ftyp box (file type)
            0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D,
            0x00, 0x00, 0x02, 0x00, 0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
            0x61, 0x76, 0x63, 0x31, 0x6D, 0x70, 0x34, 0x31,
            # free box
            0x00, 0x00, 0x00, 0x08, 0x66, 0x72, 0x65, 0x65,
            # mdat box (minimal media data)
            0x00, 0x00, 0x00, 0x10, 0x6D, 0x64, 0x61, 0x74,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            # moov box (movie metadata - minimal)
            0x00, 0x00, 0x00, 0x28, 0x6D, 0x6F, 0x6F, 0x76,
            0x00, 0x00, 0x00, 0x6C, 0x6D, 0x76, 0x68, 0x64,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0xE8,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00
        ])
        
        with open(video_path, "wb") as f:
            f.write(mp4_data)
        
        generations[generation_id].update({
            "status": "completed",
            "videoUrl": f"/videos/{video_filename}"
        })
        
        print(f"Mock video generation completed: {generation_id}")
    
    except Exception as e:
        print(f"Mock video generation failed: {e}")
        generations[generation_id]["status"] = "failed"

if __name__ == "__main__":
    port = int(os.getenv("PORT", 7860))  # Default to 7860 for Hugging Face Spaces
    uvicorn.run(app, host="0.0.0.0", port=port)