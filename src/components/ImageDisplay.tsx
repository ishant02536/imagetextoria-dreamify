
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { GeneratedImage } from "@/services/imageService";

interface ImageDisplayProps {
  image: GeneratedImage | null;
  isLoading: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, isLoading }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  useEffect(() => {
    setIsImageLoaded(false);
  }, [image]);

  const handleDownload = () => {
    if (!image) return;
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `generated-image-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!image && !isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 p-12 mt-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 text-muted-foreground mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-muted-foreground">No image generated yet</h3>
          <p className="mt-1 text-sm text-muted-foreground/70">Enter a prompt above to create an image</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-12 animate-slide-up">
      <div className="relative rounded-lg overflow-hidden bg-secondary/50 backdrop-blur-sm">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-secondary animate-spin"></div>
              </div>
            </div>
            <div className="absolute text-sm font-medium text-center text-primary/80 mt-40">
              <p>Generating your image</p>
              <p className="text-xs text-muted-foreground mt-1">This may take a few seconds...</p>
            </div>
          </div>
        )}

        {image && (
          <div className={`${isImageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
            <img
              src={image.url}
              alt={image.prompt}
              className="w-full h-auto image-entrance"
              onLoad={() => setIsImageLoaded(true)}
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-sm line-clamp-2 max-w-[90%] text-balance mb-1">
                {image.prompt}
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/70">
                  {new Date(image.timestamp).toLocaleString()}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
