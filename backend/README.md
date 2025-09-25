# AI Video Generator - FastAPI Backend

This is the FastAPI backend for the AI Video Generator application. It uses Hugging Face's Stable Video Diffusion model to generate AI videos with consistent characters.

## Features

- 🎬 AI video generation using Stable Video Diffusion
- 🎭 Character consistency across video frames
- 📤 Image upload and processing
- 🔄 Real-time generation status tracking
- 🎯 Free Hugging Face inference endpoints
- 📊 Generation history management

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Character Upload
- `POST /upload-character` - Upload character image
  - Accepts: `multipart/form-data` with `character` file
  - Returns: `{"imageUrl": "/uploads/filename.jpg"}`

### Video Generation
- `POST /generate-video` - Start video generation
  - Body: `{"characterImageUrl": "string", "script": "string", "duration": 5, "quality": "768"}`
  - Returns: Generation object with ID and status

### Status Tracking
- `GET /generation/{id}` - Get specific generation status
- `GET /generations` - Get all generations (latest first)

## Environment Variables

- `HUGGING_FACE_TOKEN` or `HF_TOKEN` - Your Hugging Face API token (required for video generation)
- `PORT` - Server port (default: 7860 for Hugging Face Spaces)

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set your Hugging Face token:
```bash
export HUGGING_FACE_TOKEN="your_token_here"
```

3. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:7860`

## Deployment on Hugging Face Spaces

1. Create a new Hugging Face Space
2. Select "Custom" as the SDK
3. Upload all files from this `backend/` directory to your Space
4. Set the following in your Space settings:
   - SDK: `Other`
   - Entrypoint: `uvicorn app:app --host 0.0.0.0 --port 7860`
   - Add your `HUGGING_FACE_TOKEN` as a secret

5. Your Space will automatically deploy and be available at:
   `https://your-username-space-name.hf.space`

## Model Information

This backend uses the [Stable Video Diffusion](https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt) model:
- **Model**: `stabilityai/stable-video-diffusion-img2vid-xt`
- **Type**: Image-to-Video generation
- **Input**: Character image + text prompt
- **Output**: MP4 video file
- **Duration**: 3-10 seconds (configurable)
- **Quality**: 512x512 to 1024x1024 (configurable)

## API Usage Examples

### Upload Character Image
```bash
curl -X POST "http://localhost:7860/upload-character" \
  -F "character=@/path/to/character.jpg"
```

### Generate Video
```bash
curl -X POST "http://localhost:7860/generate-video" \
  -H "Content-Type: application/json" \
  -d '{
    "characterImageUrl": "/uploads/character_123.jpg",
    "script": "The character waves hello and smiles at the camera",
    "duration": 5,
    "quality": "768"
  }'
```

### Check Generation Status
```bash
curl "http://localhost:7860/generation/generation-id-here"
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid file types (only images allowed)
- Missing Hugging Face token
- API rate limits and model loading delays
- File system errors
- Network timeouts

## Security Notes

- CORS is enabled for all origins (restrict in production)
- File uploads are limited to images only
- Generated files are served statically
- No authentication required (add in production if needed)

## Performance

- Background processing for video generation
- Automatic retry for model loading delays
- File size optimization for uploads
- Efficient status polling system

For more information about the complete AI Video Generator project, see the root README.md file.