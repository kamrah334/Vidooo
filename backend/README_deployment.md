# Deployment Guide - FastAPI Backend

This guide covers deploying the AI Video Generator FastAPI backend to Hugging Face Spaces.

## 🚀 Hugging Face Spaces Deployment

### Quick Deploy Method

1. **Create a new Space on Hugging Face**
   - Go to [Hugging Face Spaces](https://huggingface.co/spaces)
   - Click "Create new Space"
   - Choose a name: `your-username/ai-video-generator`
   - Select SDK: "Docker"
   - Set visibility: Public or Private

2. **Upload Backend Files**
   ```bash
   # Clone your space repository
   git clone https://huggingface.co/spaces/your-username/ai-video-generator
   cd ai-video-generator
   
   # Copy all backend files
   cp -r /path/to/your/backend/* .
   
   # Add and commit files
   git add .
   git commit -m "Initial deployment of AI Video Generator backend"
   git push
   ```

3. **Configure Space Settings**
   - Go to your Space settings
   - Add secrets:
     - `HUGGING_FACE_TOKEN`: Your HF API token
   - Save settings

4. **Your Space will build and deploy automatically**
   - URL: `https://your-username-ai-video-generator.hf.space`
   - API docs: `https://your-username-ai-video-generator.hf.space/docs`

### Manual Setup Method

1. **Create Space with Git**
   ```bash
   # Initialize git repository
   git init
   git remote add origin https://huggingface.co/spaces/your-username/ai-video-generator
   
   # Copy backend files to repository
   cp app.py requirements.txt Dockerfile .dockerignore spaces_config.yaml .
   
   # Create Space metadata
   echo "# AI Video Generator Backend" > README.md
   echo "" >> README.md
   echo "Backend API for AI video generation with character consistency." >> README.md
   
   # Commit and push
   git add .
   git commit -m "Deploy AI Video Generator backend"
   git push origin main
   ```

2. **Configure Environment**
   - Set `HUGGING_FACE_TOKEN` in Space secrets
   - Optionally set `PORT` (defaults to 7860)

## 🔧 Configuration Options

### Environment Variables
```bash
# Required
HUGGING_FACE_TOKEN=hf_xxx...  # Your HF API token

# Optional
PORT=7860                     # Server port (HF Spaces default)
MODEL_ID=stabilityai/stable-video-diffusion-img2vid-xt  # Model to use
MAX_FILE_SIZE=10485760       # Max upload size (10MB)
```

### Hardware Requirements
- **CPU Basic**: Sufficient for API hosting (model runs on HF infrastructure)
- **GPU**: Not required (uses HF Inference API)
- **Memory**: 2GB minimum
- **Storage**: 1GB for uploaded files and generated videos

### Custom Domain (Pro)
If you have HF Pro:
1. Go to Space settings
2. Enable custom domain
3. Point your domain CNAME to HF Spaces
4. Update frontend `VITE_API_URL` to your custom domain

## 🔍 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Check Dockerfile syntax
docker build -t ai-video-generator .

# Check requirements.txt
pip install -r requirements.txt
```

**Space Won't Start**
- Check logs in Space interface
- Verify `HUGGING_FACE_TOKEN` is set
- Ensure port 7860 is exposed

**API Not Responding**
- Check health endpoint: `/health`
- Verify CORS settings
- Check model availability on HF

**Upload Errors**
- Check file size limits
- Verify uploads directory permissions
- Check disk space on Space

### Debug Mode
Add to Space secrets for debugging:
```bash
DEBUG=true
LOG_LEVEL=debug
```

### Monitoring
Monitor your Space:
- View logs in HF Spaces interface
- Check `/health` endpoint regularly
- Monitor disk usage for uploads/videos

## 🔄 Updates and Maintenance

### Update Deployment
```bash
# Make changes to backend code
git add .
git commit -m "Update: description of changes"
git push origin main
# Space rebuilds automatically
```

### Rollback
```bash
# View commit history
git log --oneline

# Rollback to previous version
git reset --hard <commit-hash>
git push --force origin main
```

### Backup
- Generated videos are ephemeral (lost on restart)
- Important data should be stored externally
- Regular backups of Space configuration recommended

## 📊 Performance Tips

1. **File Management**
   - Implement automatic cleanup of old videos
   - Set reasonable file size limits
   - Use efficient image formats

2. **API Optimization**
   - Cache frequently used responses
   - Implement request rate limiting
   - Use background tasks for long operations

3. **Model Efficiency**
   - Use appropriate model parameters
   - Implement retry logic for model loading
   - Handle 503 errors gracefully

## 🔒 Security

1. **Secrets Management**
   - Never commit API tokens to git
   - Use HF Spaces secrets for sensitive data
   - Rotate tokens regularly

2. **Input Validation**
   - Validate all uploaded files
   - Sanitize file names
   - Implement size and type restrictions

3. **CORS Configuration**
   - Restrict origins in production
   - Remove wildcard CORS for security
   - Use HTTPS in production

For more deployment options and advanced configuration, see the main [README.md](../README.md).