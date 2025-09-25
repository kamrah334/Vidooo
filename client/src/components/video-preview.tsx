import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { VideoGeneration } from "@shared/schema";
import { CURRENT_ENDPOINTS, toAbsoluteUrl } from "@/lib/config";

interface VideoPreviewProps {
  generationId: string | null;
}

export default function VideoPreview({ generationId }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { data: generation, refetch } = useQuery<VideoGeneration>({
    queryKey: [CURRENT_ENDPOINTS.getGeneration(generationId || "")],
    enabled: !!generationId,
    refetchInterval: (query) => {
      // Poll every 5 seconds if status is pending or processing
      return query.state.data?.status === "pending" || query.state.data?.status === "processing" ? 5000 : false;
    },
  });

  // Auto-refetch when generation ID changes
  useEffect(() => {
    if (generationId) {
      refetch();
    }
  }, [generationId, refetch]);

  const downloadVideo = () => {
    if (generation?.videoUrl) {
      const link = document.createElement('a');
      link.href = toAbsoluteUrl(generation.videoUrl);
      link.download = `ai-video-${generation.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const regenerateVideo = () => {
    // This would trigger a new generation with the same parameters
    // For now, we'll just show a message
    alert("Regeneration feature coming soon!");
  };

  // Loading state
  if (generation?.status === "processing" || generation?.status === "pending") {
    return (
      <Card className="glass-morphism rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <i className="fas fa-play-circle text-accent mr-3"></i>
          Generated Video
        </h3>
        
        <div className="text-center py-8" data-testid="loading-generation">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
          <div className="text-lg font-medium mb-2">Generating your AI video...</div>
          <div className="text-muted-foreground text-sm">This may take 1-3 minutes</div>
          
          {/* Progress Bar */}
          <div className="max-w-xs mx-auto mt-6">
            <div className="bg-secondary rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 w-1/2"></div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {generation?.status === "pending" ? "Queuing..." : "Processing character embedding..."}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Generated video state
  if (generation?.status === "completed" && generation.videoUrl) {
    return (
      <Card className="glass-morphism rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <i className="fas fa-play-circle text-accent mr-3"></i>
          Generated Video
        </h3>
        
        <div className="relative aspect-square bg-black rounded-xl overflow-hidden" data-testid="video-player">
          <video
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={toAbsoluteUrl(generation.videoUrl)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground" data-testid="text-video-info">
            Generated • {generation.quality}x{generation.quality} • {generation.duration} seconds
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={regenerateVideo}
              className="flex items-center space-x-2"
              data-testid="button-regenerate"
            >
              <i className="fas fa-redo"></i>
              <span>Regenerate</span>
            </Button>
            <Button
              onClick={downloadVideo}
              className="gradient-button text-white flex items-center space-x-2"
              data-testid="button-download"
            >
              <i className="fas fa-download"></i>
              <span>Download</span>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (generation?.status === "failed") {
    return (
      <Card className="glass-morphism rounded-2xl p-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <i className="fas fa-play-circle text-accent mr-3"></i>
          Generated Video
        </h3>
        
        <div className="text-center py-8" data-testid="error-generation">
          <i className="fas fa-exclamation-triangle text-4xl text-destructive mb-4"></i>
          <div className="text-lg font-medium mb-2 text-destructive">Generation Failed</div>
          <div className="text-muted-foreground text-sm">There was an error generating your video. Please try again.</div>
          
          <Button
            onClick={regenerateVideo}
            className="mt-4 gradient-button text-white"
            data-testid="button-retry"
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  // Default state (no generation)
  return (
    <Card className="glass-morphism rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <i className="fas fa-play-circle text-accent mr-3"></i>
        Generated Video
      </h3>
      
      <div className="relative aspect-square bg-secondary/30 rounded-xl border-2 border-dashed border-border flex items-center justify-center" data-testid="empty-video">
        <div className="text-center">
          <i className="fas fa-video text-4xl text-muted-foreground mb-4"></i>
          <div className="text-lg font-medium text-muted-foreground mb-2">Your AI video will appear here</div>
          <div className="text-sm text-muted-foreground">Upload a character and write a script to get started</div>
        </div>
      </div>
    </Card>
  );
}
