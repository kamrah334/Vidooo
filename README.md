# AI Video Generator

A complete AI-powered video generation platform that creates videos with consistent characters using Stable Video Diffusion. Users can upload character images, write scripts, and generate professional AI videos with character consistency.

![AI Video Generator](https://img.shields.io/badge/AI-Video%20Generation-blue) ![React](https://img.shields.io/badge/React-18.0-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green) ![Hugging%20Face](https://img.shields.io/badge/Hugging%20Face-Stable%20Video%20Diffusion-orange)

## 🚀 Features

### 🎬 AI Video Generation
- **Stable Video Diffusion**: Uses Hugging Face's state-of-the-art model
- **Character Consistency**: Maintains character appearance across video frames
- **Custom Scripts**: Generate videos based on your written prompts
- **Quality Control**: Adjustable video quality and duration settings

### 🎨 User Experience
- **Drag & Drop Upload**: Easy character image uploading
- **Real-time Progress**: Live status updates during generation
- **Generation History**: Track and manage all your video creations
- **Responsive Design**: Works on desktop and mobile devices

### 🔧 Technical Features
- **React Frontend**: Modern, responsive UI with TailwindCSS
- **FastAPI Backend**: High-performance Python API
- **Free AI Models**: Uses free Hugging Face inference endpoints
- **Cloud Deployment**: Ready for Vercel + Hugging Face Spaces

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   FastAPI       │    │ Hugging Face    │
│   (Frontend)    │────│   Backend       │────│ Stable Video    │
│   Vercel        │    │   HF Spaces     │    │ Diffusion API   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side navigation
- **Forms**: React Hook Form with Zod validation

### Backend (FastAPI + Python)
- **API Framework**: FastAPI with automatic OpenAPI docs
- **AI Integration**: Hugging Face Inference API
- **File Handling**: Multipart upload with static file serving
- **Background Processing**: Async video generation with status tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Hugging Face account and API token

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-video-generator
cd ai-video-generator
```

### 2. Development Setup

Choose one of these development approaches:

#### Option A: Integrated Development (Recommended)
Uses the Express backend for development with auto-reload:
```bash
# Install all dependencies
npm install

# Start integrated development server
npm run dev
```
- Application: http://localhost:5000
- API endpoints available at `/api/*`

#### Option B: FastAPI Development
Uses the FastAPI backend for testing production-like features:
```bash
# Setup and start FastAPI backend
cd backend
pip install -r requirements.txt
export HUGGING_FACE_TOKEN="your_hf_token_here"
python app.py

# In another terminal, setup frontend
cd client
cp .env.example .env
# Edit .env and set: VITE_API_URL=http://localhost:7860
npm install
npm run dev
```
- Frontend: http://localhost:5000
- Backend API: http://localhost:7860
- API Docs: http://localhost:7860/docs

## 📁 Project Structure

```
ai-video-generator/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and configuration
│   │   └── hooks/          # Custom React hooks
│   ├── .env.example        # Environment variables template
│   └── README.md           # Frontend documentation
├── backend/                # FastAPI backend (production)
│   ├── app.py              # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend documentation
├── server/                 # Express backend (development)
│   ├── index.ts            # Express server with Vite integration
│   ├── routes.ts           # API routes for development
│   └── storage.ts          # In-memory storage interface
├── shared/                 # Shared types and schemas
│   └── schema.ts           # TypeScript/Zod schemas
├── uploads/                # Uploaded character images
└── README.md               # This file
```

## 🌐 Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables:
   - `VITE_API_URL`: Your deployed backend URL
4. Deploy automatically on push to main

### Backend (Hugging Face Spaces)
1. Create a new Hugging Face Space
2. Upload backend files to your Space
3. Configure Space settings:
   - SDK: Custom
   - Entrypoint: `uvicorn app:app --host 0.0.0.0 --port 7860`
4. Add your `HUGGING_FACE_TOKEN` as a secret
5. Your Space deploys automatically

## 🔑 Environment Variables

### Frontend (.env)
```bash
# For development (Express backend)
# VITE_API_URL=

# For production (FastAPI backend)
VITE_API_URL=https://your-space.hf.space
```

### Backend
```bash
HUGGING_FACE_TOKEN=your_token_here
PORT=7860
```

## 🎯 Usage

1. **Upload Character Image**: Drag and drop or click to upload a character image
2. **Write Script**: Describe what you want the character to do in the video
3. **Configure Settings**: Choose video duration (3-10 seconds) and quality
4. **Generate Video**: Click generate and wait for AI processing (1-3 minutes)
5. **Download Result**: Preview and download your generated video

## 🛠️ Development

### Frontend Development
```bash
cd client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
python app.py        # Start FastAPI server
# API docs available at http://localhost:7860/docs
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Zod**: Runtime schema validation

## 🔧 Configuration

### Customizing Video Generation
Edit `backend/app.py` to modify:
- Video duration limits
- Quality presets
- Model parameters
- Error handling

### Styling the Frontend
- Edit `client/src/index.css` for global styles
- Modify `tailwind.config.ts` for theme customization
- Add components in `client/src/components/ui/`

## 📚 API Documentation

Once the backend is running, visit:
- Interactive docs: http://localhost:7860/docs
- OpenAPI spec: http://localhost:7860/openapi.json

### Key Endpoints
- `POST /upload-character` - Upload character image
- `POST /generate-video` - Start video generation
- `GET /generation/{id}` - Check generation status
- `GET /generations` - List all generations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-video-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-video-generator/discussions)
- **Documentation**: See `/client/README.md` and `/backend/README.md`

## 🌟 Acknowledgments

- [Stability AI](https://stability.ai/) for Stable Video Diffusion
- [Hugging Face](https://huggingface.co/) for the inference API
- [Vercel](https://vercel.com/) for frontend hosting
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

---

**Built with ❤️ using React, FastAPI, and Stable Video Diffusion**