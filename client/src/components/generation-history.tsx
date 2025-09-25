import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { VideoGeneration } from "@shared/schema";
import { CURRENT_ENDPOINTS, toAbsoluteUrl } from "@/lib/config";

export default function GenerationHistory() {
  const { data: generations = [] } = useQuery<VideoGeneration[]>({
    queryKey: [CURRENT_ENDPOINTS.getGenerations],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const playVideo = (videoUrl: string) => {
    window.open(toAbsoluteUrl(videoUrl), '_blank');
  };

  const downloadVideo = (generation: VideoGeneration) => {
    if (generation.videoUrl) {
      const link = document.createElement('a');
      link.href = toAbsoluteUrl(generation.videoUrl);
      link.download = `ai-video-${generation.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card className="glass-morphism rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <i className="fas fa-history text-primary mr-3"></i>
        Recent Generations
      </h3>
      
      <div className="space-y-4">
        {generations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground" data-testid="empty-history">
            <i className="fas fa-clock text-2xl mb-2"></i>
            <div className="text-sm">Your generated videos will appear here</div>
          </div>
        ) : (
          generations.map((generation) => (
            <div
              key={generation.id}
              className="flex items-center space-x-4 p-4 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
              data-testid={`history-item-${generation.id}`}
            >
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {generation.characterImageUrl ? (
                  <img
                    src={toAbsoluteUrl(generation.characterImageUrl)}
                    alt="Character thumbnail"
                    className="w-full h-full object-cover"
                    data-testid="img-character-thumbnail"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <i className="fas fa-user text-muted-foreground"></i>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate" data-testid="text-script-preview">
                  {generation.script.length > 50 
                    ? `${generation.script.substring(0, 50)}...` 
                    : generation.script
                  }
                </div>
                <div className="text-sm text-muted-foreground" data-testid="text-generation-info">
                  {formatTimeAgo(generation.createdAt)} • {generation.duration} seconds
                  {generation.status === "processing" && " • Processing..."}
                  {generation.status === "failed" && " • Failed"}
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {generation.status === "completed" && generation.videoUrl && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playVideo(generation.videoUrl!)}
                      className="text-muted-foreground hover:text-foreground"
                      data-testid="button-play-video"
                    >
                      <i className="fas fa-play"></i>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadVideo(generation)}
                      className="text-muted-foreground hover:text-foreground"
                      data-testid="button-download-video"
                    >
                      <i className="fas fa-download"></i>
                    </Button>
                  </>
                )}
                {generation.status === "processing" && (
                  <div className="animate-spin">
                    <i className="fas fa-spinner text-primary"></i>
                  </div>
                )}
                {generation.status === "failed" && (
                  <i className="fas fa-exclamation-triangle text-destructive"></i>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
