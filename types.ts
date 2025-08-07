// All the inputs for the generation request
export interface CopyRequest {
  description: string;
  contentType: string;
  location: string;
  trigger: string;
  outcome: string;
  tone: string;
  charLimit: string;
  image?: {
    mimeType: string;
    data: string; // base64 encoded string
  };
}

// A single generated copy option from the AI
export interface CopyOption {
  text: string;
  tone: string;
  characterCount: number;
}

// The full response from the AI
export interface CopyResponse {
  options: CopyOption[];
}
