
import React, { useState, useEffect } from "react";
import Prompt from "./Prompt";
import ImageDisplay from "./ImageDisplay";
import HistoryPanel from "./HistoryPanel";
import { imageService, GeneratedImage } from "@/services/imageService";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Settings, Key } from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const ImageGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  
  // Check if API key is already set
  useEffect(() => {
    const currentKey = imageService.getApiKey();
    if (currentKey) {
      setApiKey(currentKey);
    }
  }, []);
  
  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      imageService.setApiKey(apiKey.trim());
      toast.success("API key set successfully!");
    }
  };
  
  const handleGenerate = async (prompt: string, width: number, height: number) => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Add a notice about API usage
      if (!imageService.getApiKey()) {
        toast.info("Using placeholder images. Set your Runware API key for AI generation.", {
          duration: 3000,
        });
      } else {
        toast.info("Generating image with Runware AI...", {
          duration: 3000,
        });
      }
      
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
      <div className="flex justify-end px-4 py-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Key className="h-4 w-4" />
              <span>API Key</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <form onSubmit={handleApiKeySubmit} className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Set Runware API Key</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Get your API key from <a href="https://runware.ai" target="_blank" rel="noopener noreferrer" className="text-primary underline">runware.ai</a> to enable AI image generation.
                </p>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Runware API key"
                  className="w-full"
                />
              </div>
              <Button type="submit" size="sm" className="w-full">Save API Key</Button>
            </form>
          </PopoverContent>
        </Popover>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-120px)]">
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
