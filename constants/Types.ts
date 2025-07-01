export interface UserProfile {
  name: string;
  age: number;
  email: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  images?: string[];
  typing?: boolean;
  model?: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  colorTheme: 'default' | 'ocean' | 'forest' | 'sunset';
  fontFamily: 'poppins' | 'inter' | 'lato' | 'system';
  aiModel: string;
  language: string;
  markdownEnabled: boolean;
  mathEnabled: boolean;
}

export interface AIModel {
  name: string;
  description: string;
  provider: string;
  tier?: string;
  community?: boolean;
  aliases?: string;
  input_modalities: string[];
  output_modalities: string[];
  tools?: boolean;
  vision?: boolean;
  audio?: boolean;
  accessible?: boolean;
  userTier?: string;
  reasoning?: boolean;
  search?: boolean;
  uncensored?: boolean;
}

export interface APIResponse {
  success: boolean;
  content?: string;
  error?: string;
  model?: string;
  timestamp?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatHistory {
  messages: ChatMessage[];
  lastUpdated: Date;
}

export interface ImageAnalysisRequest {
  imageUrl?: string;
  imageBase64?: string;
  question?: string;
}

export interface AudioTranscriptionRequest {
  audioBase64: string;
  format: 'wav' | 'mp3';
}

export interface VisionMessage {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface MultimodalContent {
  type: 'text' | 'image_url' | 'input_audio';
  text?: string;
  image_url?: {
    url: string;
  };
  input_audio?: {
    data: string;
    format: string;
  };
}

export type RootStackParamList = {
  Onboarding: undefined;
  Setup: undefined;
  Chat: undefined;
  Settings: undefined;
};