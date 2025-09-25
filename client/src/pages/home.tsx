import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import WorkflowSteps from "@/components/workflow-steps";
import ImageUpload from "@/components/image-upload";
import ScriptEditor from "@/components/script-editor";
import VideoPreview from "@/components/video-preview";
import GenerationHistory from "@/components/generation-history";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CURRENT_ENDPOINTS } from "@/lib/config";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [script, setScript] = useState("");
  const [duration, setDuration] = useState("5");
  const [quality, setQuality] = useState("768");
  const [currentGeneration, setCurrentGeneration] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateVideoMutation = useMutation({
    mutationFn: async (data: { characterImageUrl: string; script: string; duration: number; quality: string }) => {
      const response = await apiRequest("POST", CURRENT_ENDPOINTS.generateVideo, data);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentGeneration(data.id);
      queryClient.invalidateQueries({ queryKey: [CURRENT_ENDPOINTS.getGenerations] });
      toast({
        title: "Video generation started",
        description: "Your AI video is being generated. This may take 1-3 minutes.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateVideo = () => {
    if (!uploadedImage) {
      toast({
        title: "Character image required",
        description: "Please upload a character image first.",
        variant: "destructive",
      });
      return;
    }

    if (!script.trim()) {
      toast({
        title: "Script required",
        description: "Please write a script for your video.",
        variant: "destructive",
      });
      return;
    }

    generateVideoMutation.mutate({
      characterImageUrl: uploadedImage,
      script: script.trim(),
      duration: parseInt(duration),
      quality,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <WorkflowSteps />
        
        {/* Main Generator Interface */}
        <section className="py-12 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Column: Input Controls */}
              <div className="space-y-8">
                {/* Character Upload */}
                <Card className="glass-morphism rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <i className="fas fa-user-circle text-primary mr-3"></i>
                    Character Image
                  </h3>
                  
                  <ImageUpload
                    onImageUpload={setUploadedImage}
                    uploadedImage={uploadedImage}
                    data-testid="character-upload"
                  />
                </Card>

                {/* Script Input */}
                <Card className="glass-morphism rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <i className="fas fa-script text-accent mr-3"></i>
                    Video Script
                  </h3>
                  
                  <ScriptEditor
                    script={script}
                    onScriptChange={setScript}
                    data-testid="script-editor"
                  />
                </Card>

                {/* Generation Controls */}
                <Card className="glass-morphism rounded-2xl p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center">
                    <i className="fas fa-sliders-h text-primary mr-3"></i>
                    Video Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-3">Duration</label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger data-testid="select-duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 seconds</SelectItem>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="7">7 seconds</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-3">Quality</label>
                      <Select value={quality} onValueChange={setQuality}>
                        <SelectTrigger data-testid="select-quality">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="512">512x512 (Fast)</SelectItem>
                          <SelectItem value="768">768x768 (Balanced)</SelectItem>
                          <SelectItem value="1024">1024x1024 (High Quality)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    className="gradient-button w-full text-white font-semibold py-4 px-8 rounded-xl mt-8 flex items-center justify-center space-x-3 text-lg"
                    onClick={handleGenerateVideo}
                    disabled={generateVideoMutation.isPending}
                    data-testid="button-generate"
                  >
                    <i className="fas fa-magic"></i>
                    <span>{generateVideoMutation.isPending ? "Generating..." : "Generate AI Video"}</span>
                    <i className="fas fa-arrow-right"></i>
                  </Button>
                </Card>
              </div>

              {/* Right Column: Video Preview & Results */}
              <div className="space-y-8">
                <VideoPreview 
                  generationId={currentGeneration}
                  data-testid="video-preview"
                />
                <GenerationHistory data-testid="generation-history" />
              </div>
            </div>
          </div>
        </section>
        
        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}
