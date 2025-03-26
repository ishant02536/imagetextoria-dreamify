
import React, { useState } from "react";
import Prompt from "./Prompt";
import ImageDisplay from "./ImageDisplay";
import HistoryPanel from "./HistoryPanel";
import { imageService, GeneratedImage } from "@/services/imageService";
import { toast } from "sonner";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const ImageGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerate = async (prompt: string, width: number, height: number) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Add a notice to users about how the demo works
      toast.info("Demo Mode: Using categorized placeholder images based on prompt keywords", {
        duration: 3000,
      });
      
      const generatedImage = await imageService.generateImage({
        prompt,
        width,
        height
      });
      
      setCurrentImage(generatedImage);
      setGeneratedImages((prev) => [generatedImage, ...prev]);
      
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Error generating image:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSelectImage = (image: GeneratedImage) => {
    setCurrentImage(image);
  };
  
  return (
    <div className="flex-1 overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-80px)]">
        <ResizablePanel defaultSize={75} minSize={40}>
          <div className="flex flex-col h-full p-4 sm:p-8 overflow-y-auto">
            <Prompt onGenerate={handleGenerate} isGenerating={isGenerating} />
            <ImageDisplay 
              image={currentImage} 
              isLoading={isGenerating} 
              error={error}
            />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="h-full flex flex-col bg-secondary/30 backdrop-blur-xs border-l">
            <div className="p-4 border-b bg-secondary/50 backdrop-blur-sm">
              <h2 className="text-sm font-medium">Generation History</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <HistoryPanel 
                images={generatedImages} 
                onSelect={handleSelectImage} 
                selectedImageId={currentImage?.id || null} 
              />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ImageGenerator;
