
import React from "react";
import { GeneratedImage } from "@/services/imageService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";

interface HistoryPanelProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  selectedImageId: string | null;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  images,
  onSelect,
  selectedImageId,
}) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <Clock className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-sm font-medium text-muted-foreground">No history yet</h3>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Generated images will appear here
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {images.map((image) => (
          <div key={image.id}>
            <div
              className={`relative rounded-md overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedImageId === image.id
                  ? "ring-2 ring-primary"
                  : "hover:ring-1 hover:ring-muted-foreground/30"
              }`}
              onClick={() => onSelect(image)}
            >
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-auto aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-xs line-clamp-2 text-balance">
                    {image.prompt}
                  </p>
                  <p className="text-white/70 text-[10px] mt-1">
                    {new Date(image.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
            <Separator className="mt-4" />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default HistoryPanel;
