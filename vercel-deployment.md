# Vercel Deployment Guide

## Environment Variables Setup

Before deploying to Vercel, you must configure the backend API URL in your Vercel project settings:

### 1. Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Import your project
3. Vercel will detect the configuration from `vercel.json`

### 2. Configure Environment Variables
In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variable:
   ```
   Name: VITE_API_URL
   Value: https://your-username-ai-video-generator.hf.space
   ```
3. Replace `your-username-ai-video-generator` with your actual HF Space name
4. Select all environments (Production, Preview, Development)

### 3. Redeploy
After setting the environment variable:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Select **Redeploy** to apply the new environment variable

## Example URLs
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-username-ai-video-generator.hf.space`
- **API Docs**: `https://your-username-ai-video-generator.hf.space/docs`

## Testing Deployment
1. Visit your Vercel deployment URL
2. Upload a character image
3. Verify API calls to your HF Space backend work
4. Test video generation end-to-end

## Troubleshooting
- **CORS Issues**: Ensure your HF Space backend allows your Vercel domain
- **API Errors**: Check that `VITE_API_URL` is set correctly
- **Build Failures**: Verify `npx vite build` works locally