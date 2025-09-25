// API Configuration - can be either FastAPI backend or Express backend
export const API_BASE_URL = import.meta.env.VITE_API_URL?.trim() || '';

// API endpoints for FastAPI backend
export const API_ENDPOINTS = {
  health: '/health',
  uploadCharacter: '/upload-character',
  generateVideo: '/generate-video',
  getGeneration: (id: string) => `/generation/${id}`,
  getGenerations: '/generations',
} as const;

// Express backend endpoints (with /api prefix)
export const EXPRESS_ENDPOINTS = {
  health: '/api/health',
  uploadCharacter: '/api/upload-character',
  generateVideo: '/api/generate-video',
  getGeneration: (id: string) => `/api/generation/${id}`,
  getGenerations: '/api/generations',
} as const;

// Auto-detect backend type:
// - Empty API_BASE_URL = same-origin Express development
// - Set API_BASE_URL = external FastAPI backend
export const CURRENT_ENDPOINTS = (!API_BASE_URL || API_BASE_URL === window.location.origin) 
  ? EXPRESS_ENDPOINTS 
  : API_ENDPOINTS;

// Helper function to convert relative URLs to absolute URLs for media assets
export function toAbsoluteUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // Already absolute
  }
  if (url.startsWith('/')) {
    return `${API_BASE_URL}${url}`; // Convert relative to absolute
  }
  return url;
}