# AI Video Generator - React Frontend

A modern React application for generating AI videos with consistent characters. Built with TypeScript, TailwindCSS, and shadcn/ui components.

## 🚀 Features

### 🎨 User Interface
- **Modern Design**: Clean, responsive interface with dark/light mode support
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Real-time Updates**: Live status tracking with polling
- **Mobile Responsive**: Works seamlessly on all device sizes

### 🔧 Technical Features
- **TypeScript**: Full type safety and developer experience
- **TailwindCSS**: Utility-first styling with custom design system
- **shadcn/ui**: Beautiful, accessible components
- **TanStack Query**: Powerful data fetching and caching
- **React Hook Form**: Performant form handling with validation

### 🎬 Video Generation Workflow
- **Character Upload**: Upload and preview character images
- **Script Editor**: Write and edit video scripts with validation
- **Quality Settings**: Choose video duration and quality presets
- **Generation History**: Track all video generations with status
- **Video Preview**: Built-in video player with download options

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── image-upload.tsx # Character image upload
│   ├── script-editor.tsx # Script writing interface
│   ├── video-preview.tsx # Video playback and download
│   └── generation-history.tsx # Generation tracking
├── pages/
│   ├── home.tsx         # Main application page
│   └── not-found.tsx    # 404 error page
├── lib/
│   ├── config.ts        # API configuration and endpoints
│   ├── queryClient.ts   # TanStack Query setup
│   └── utils.ts         # Utility functions
└── hooks/
    ├── use-toast.ts     # Toast notification hook
    └── use-mobile.tsx   # Mobile detection hook
```

### State Management
- **Server State**: TanStack Query for API data
- **Component State**: React useState for local state
- **Form State**: React Hook Form for form data
- **Global State**: Context API for theme and settings

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

#### Integrated Development (Recommended)
```bash
# Clone the repository and use integrated setup
git clone https://github.com/yourusername/ai-video-generator
cd ai-video-generator

# Install all dependencies and start integrated server
npm install
npm run dev
```

#### Standalone Frontend Development
```bash
# Clone the repository
git clone https://github.com/yourusername/ai-video-generator
cd ai-video-generator/client

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env to configure backend URL (see Environment Configuration below)

# Start development server
npm run dev
```

### Environment Configuration
```bash
# .env file

# For integrated development (Express backend), leave empty:
# VITE_API_URL=

# For local FastAPI development:
# VITE_API_URL=http://localhost:7860

# For production with deployed FastAPI backend:
# VITE_API_URL=https://your-username-ai-video-generator.hf.space
```

The application automatically detects the backend type:
- **Empty VITE_API_URL**: Uses same-origin Express backend (integrated development)
- **Set VITE_API_URL**: Uses external FastAPI backend (local FastAPI or production)

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server (port 5000)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Development Server
The app runs on `http://localhost:5000` and automatically:
- Hot reloads on file changes
- Routes API requests based on configuration
- Provides error overlays for debugging

**Backend Integration**:
- **Integrated mode**: Uses same-origin Express backend at `/api/*` endpoints
- **External mode**: Calls configured FastAPI backend with CORS handling

## 🎨 Styling

### TailwindCSS Configuration
The app uses a custom design system with:
- **Custom Colors**: Defined in `src/index.css`
- **Dark Mode**: Automatic system detection with manual toggle
- **Responsive Breakpoints**: Mobile-first approach
- **Component Variants**: Using class-variance-authority

### Design System
```css
/* Custom color palette */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode variants */
}
```

### Component Guidelines
- Use shadcn/ui components as base
- Add `data-testid` attributes for testing
- Follow consistent naming conventions
- Maintain accessibility standards

## 🔌 API Integration

### Backend Communication
The frontend communicates with either:
1. **Express Backend** (development): Same-origin requests
2. **FastAPI Backend** (production): Cross-origin requests with CORS

### API Configuration
```typescript
// Smart endpoint detection
export const CURRENT_ENDPOINTS = (!API_BASE_URL || API_BASE_URL === window.location.origin) 
  ? EXPRESS_ENDPOINTS 
  : API_ENDPOINTS;

// Automatic URL construction
const fullUrl = url.startsWith('http') || !API_BASE_URL ? url : `${API_BASE_URL}${url}`;
```

### Query Management
```typescript
// Video generations query
const { data: generations = [] } = useQuery<VideoGeneration[]>({
  queryKey: [CURRENT_ENDPOINTS.getGenerations],
  refetchInterval: 30000, // Poll every 30 seconds
});

// Video generation mutation
const generateVideoMutation = useMutation({
  mutationFn: async (data) => {
    const response = await apiRequest("POST", CURRENT_ENDPOINTS.generateVideo, data);
    return response.json();
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: [CURRENT_ENDPOINTS.getGenerations] });
  },
});
```

## 🧪 Testing

### Test Structure
```bash
# Add test files alongside components
src/
├── components/
│   ├── image-upload.tsx
│   ├── image-upload.test.tsx
│   ├── video-preview.tsx
│   └── video-preview.test.tsx
```

### Testing Guidelines
- Test user interactions and workflows
- Mock API calls with MSW
- Use React Testing Library for component tests
- Add data-testid attributes for reliable selectors

## 📱 Mobile Optimization

### Responsive Design
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Targets**: Minimum 44px for touch elements
- **Navigation**: Mobile-optimized menu and controls
- **Performance**: Optimized images and lazy loading

### Mobile Features
- Touch-friendly drag and drop
- Optimized video player controls
- Responsive grid layouts
- Accessible form inputs

## 🔧 Configuration

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./attached_assets"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
});
```

### TypeScript Configuration
- Strict mode enabled
- Path mapping for clean imports
- React JSX transform
- Full type checking

## 🚀 Deployment

### Build Process
```bash
npm run build
```
Creates optimized production build in `dist/`:
- Minified JavaScript and CSS
- Optimized images and assets
- Source maps for debugging

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Configure environment variables:
   ```
   VITE_API_URL=https://your-backend.hf.space
   ```
3. Deploy automatically on git push

### Environment-Specific Builds
- **Development**: Hot reload, debugging tools
- **Preview**: Production build with development API
- **Production**: Optimized build with production API

## 🐛 Troubleshooting

### Common Issues

**Failed to fetch errors**
```bash
# Check API configuration
console.log('API_BASE_URL:', API_BASE_URL);
console.log('CURRENT_ENDPOINTS:', CURRENT_ENDPOINTS);
```

**CORS issues**
- Ensure backend CORS is configured for your domain
- Check network tab for preflight requests
- Verify credentials are not being sent

**Build failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode
```typescript
// Enable query debugging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for debugging
    },
  },
});
```

## 🤝 Contributing

### Development Workflow
1. Create feature branch from main
2. Make changes following code style
3. Add/update tests for new features
4. Run linting and type checks
5. Submit pull request with description

### Code Style
- Use TypeScript for all new code
- Follow React best practices
- Add proper error handling
- Include loading states
- Write descriptive component props

## 📚 Learn More

### Key Technologies
- [React Documentation](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)

### Project Resources
- [Backend Documentation](../backend/README.md)
- [Main Project README](../README.md)
- [API Documentation](http://localhost:7860/docs)

---

**Built with React 18, TypeScript, and TailwindCSS**