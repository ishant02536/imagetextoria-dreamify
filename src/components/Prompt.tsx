
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Settings, Image } from "lucide-react";

interface PromptProps {
  onGenerate: (prompt: string, width: number, height: number) => void;
  isGenerating: boolean;
}

const Prompt: React.FC<PromptProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState("");
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt, width, height);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative mb-6 animate-slide-up">
        <Textarea
          ref={textareaRef}
          placeholder="Describe the image you want to create..."
          className="min-h-[120px] p-6 text-lg resize-none transition-all border-2 focus:border-primary/30 bg-white bg-opacity-60 backdrop-blur-sm"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-secondary transition-all duration-300"
              >
                <Settings className="h-5 w-5 text-primary/70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 glass border-0">
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-primary/70">Image Settings</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Width: {width}px</span>
                  </div>
                  <Slider
                    value={[width]}
                    min={256}
                    max={1024}
                    step={64}
                    onValueChange={(value) => setWidth(value[0])}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Height: {height}px</span>
                  </div>
                  <Slider
                    value={[height]}
                    min={256}
                    max={1024}
                    step={64}
                    onValueChange={(value) => setHeight(value[0])}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex justify-center animate-slide-up animation-delay-100">
        <Button 
          type="submit" 
          disabled={!prompt.trim() || isGenerating} 
          className="px-8 py-6 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent animate-spin"></div>
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <span>Generate</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};

export default Prompt;
