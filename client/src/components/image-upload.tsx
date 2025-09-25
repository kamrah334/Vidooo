import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CURRENT_ENDPOINTS, API_BASE_URL, toAbsoluteUrl } from "@/lib/config";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  uploadedImage: string | null;
}

export default function ImageUpload({ onImageUpload, uploadedImage }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('character', file);
      
      // Use same URL construction logic as apiRequest
      const uploadUrl = !API_BASE_URL ? CURRENT_ENDPOINTS.uploadCharacter : `${API_BASE_URL}${CURRENT_ENDPOINTS.uploadCharacter}`;
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      // Keep the original relative URL from backend for API calls
      onImageUpload(data.imageUrl);
      toast({
        title: "Image uploaded successfully",
        description: "Your character image is ready for video generation.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeImage = () => {
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (uploadedImage) {
    return (
      <div className="p-4 bg-secondary/50 rounded-lg border border-border">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-muted rounded-lg border border-border overflow-hidden">
            <img 
              src={toAbsoluteUrl(uploadedImage)} 
              alt="Uploaded character" 
              className="w-full h-full object-cover"
              data-testid="img-uploaded-character"
            />
          </div>
          <div className="flex-1">
            <div className="font-medium" data-testid="text-filename">Character Image</div>
            <div className="text-sm text-muted-foreground" data-testid="text-file-info">Ready for video generation</div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={removeImage}
            data-testid="button-remove-image"
          >
            <i className="fas fa-trash-alt"></i>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`upload-area rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging ? 'upload-area-hover' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        data-testid="area-upload"
      >
        <div className="mb-4">
          <i className="fas fa-cloud-upload-alt text-4xl text-primary mb-4"></i>
          <div className="text-lg font-medium mb-2">
            {uploadMutation.isPending ? "Uploading..." : "Drop your character image here"}
          </div>
          <div className="text-muted-foreground text-sm">
            or <span className="text-primary underline">browse files</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Supports JPG, PNG, WebP • Max 10MB • Best results with 1:1 aspect ratio
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-file"
      />
    </div>
  );
}
