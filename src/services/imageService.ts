import { GenerateImageParams, GeneratedImage as RunwareGeneratedImage, RunwareService } from "./runwareService";
import { toast } from "sonner";

// Default API key
const DEFAULT_API_KEY = "t7KdDMcUch3MROTBHdDj9gEIl0YqCBJG";
let apiKey: string = DEFAULT_API_KEY;
let runwareService: RunwareService | null = new RunwareService(DEFAULT_API_KEY);

// Better categorized placeholder images for fallback
const placeholderImages = {
  nature: [
    "https://images.unsplash.com/photo-1682687982167-d7fb3d33e9b0",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b"
  ],
  animals: [
    "https://images.unsplash.com/photo-1682695797873-aa4cb6edd666",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a" 
  ],
  people: [
    "https://images.unsplash.com/photo-1682687218147-9806132dc697",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  ],
  cities: [
    "https://images.unsplash.com/photo-1681319350180-6c7844a09c86",
    "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b"
  ],
  abstract: [
    "https://images.unsplash.com/photo-1683009427666-340595e57e43",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab"
  ],
  technology: [
    "https://images.unsplash.com/photo-1682685797743-3a7b6b8d8149",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
  ]
};

// Simulates API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This function tries to match a prompt to the most relevant category
const matchPromptToCategory = (prompt: string): string => {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('nature') || promptLower.includes('landscape') || 
      promptLower.includes('mountain') || promptLower.includes('forest') || 
      promptLower.includes('ocean') || promptLower.includes('tree')) {
    return 'nature';
  }
  
  if (promptLower.includes('animal') || promptLower.includes('dog') || 
      promptLower.includes('cat') || promptLower.includes('lion') || 
      promptLower.includes('bird') || promptLower.includes('wildlife')) {
    return 'animals';
  }
  
  if (promptLower.includes('person') || promptLower.includes('people') || 
      promptLower.includes('woman') || promptLower.includes('man') || 
      promptLower.includes('child') || promptLower.includes('portrait')) {
    return 'people';
  }
  
  if (promptLower.includes('city') || promptLower.includes('urban') || 
      promptLower.includes('building') || promptLower.includes('street') || 
      promptLower.includes('skyline')) {
    return 'cities';
  }
  
  if (promptLower.includes('tech') || promptLower.includes('computer') || 
      promptLower.includes('digital') || promptLower.includes('future') || 
      promptLower.includes('robot')) {
    return 'technology';
  }
  
  // Default to abstract for other prompts
  return 'abstract';
};

export interface ImageGenerationParams {
  prompt: string;
  width?: number;
  height?: number;
  style?: string;
  seed?: number;
}

// Export the GeneratedImage interface so it can be used by other components
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  width: number;
  height: number;
  seed?: number;
}

// This service would normally make actual API calls to a text-to-image service
export class ImageService {
  setApiKey(key: string) {
    apiKey = key;
    runwareService = new RunwareService(key);
    return this;
  }

  getApiKey() {
    return apiKey;
  }

  async generateImage(params: ImageGenerationParams): Promise<GeneratedImage> {
    try {
      // Always use Runware service with the default API key
      if (runwareService) {
        const result = await runwareService.generateImage({
          positivePrompt: params.prompt,
          width: params.width,
          height: params.height,
          seed: params.seed || null,
        });
        
        return {
          id: result.imageUUID || crypto.randomUUID(),
          url: result.imageURL,
          prompt: params.prompt,
          timestamp: Date.now(),
          width: params.width || 512,
          height: params.height || 512,
          seed: result.seed
        };
      }
      
      // Otherwise, fall back to the placeholder implementation
      console.log("No API key provided, using placeholder images");
      toast.warning("Using placeholder images. Connection to Visora AI service failed.", {
        duration: 5000,
      });
      
      // Simulate network delay and processing time
      await delay(2000 + Math.random() * 2000);
      
      // Match the prompt to a category
      const category = matchPromptToCategory(params.prompt);
      
      // Get images from the matched category
      const categoryImages = placeholderImages[category as keyof typeof placeholderImages];
      
      // Select a random image from the category
      const imageIndex = Math.floor(Math.random() * categoryImages.length);
      const imageUrl = `${categoryImages[imageIndex]}?prompt=${encodeURIComponent(params.prompt)}&category=${category}`;
      
      // Create a mock response
      return {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: params.prompt,
        timestamp: Date.now(),
        width: params.width || 512,
        height: params.height || 512
      };
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }

  // Suggest better prompts
  suggestPromptImprovements(prompt: string): string[] {
    const baseSuggestions = [
      "Try adding more descriptive adjectives",
      "Specify a style (e.g., realistic, cartoon, watercolor)",
      "Mention lighting conditions (e.g., sunset, studio lighting)",
      "Include composition details (e.g., close-up, panorama)",
    ];
    
    const promptSpecificSuggestions: string[] = [];
    const promptLower = prompt.toLowerCase();
    
    // Check if prompt is very short
    if (prompt.split(' ').length < 3) {
      promptSpecificSuggestions.push("Add more details to your prompt");
    }
    
    // Add specific category suggestions
    if (matchPromptToCategory(prompt) === 'nature') {
      promptSpecificSuggestions.push("Try 'Serene mountain landscape with pine trees and a lake at sunset'");
    } else if (matchPromptToCategory(prompt) === 'animals') {
      promptSpecificSuggestions.push("Try 'Close-up portrait of a majestic lion with detailed mane in natural habitat'");
    } else if (matchPromptToCategory(prompt) === 'people') {
      promptSpecificSuggestions.push("Try 'Portrait of a person with soft lighting, detailed features, and emotional expression'");
    }
    
    return [...promptSpecificSuggestions, ...baseSuggestions];
  }
}

// Create a singleton instance
export const imageService = new ImageService();
