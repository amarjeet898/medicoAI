import axios from 'axios';
import { AIModel, APIResponse, ChatMessage, UserProfile, ImageAnalysisRequest } from '../constants/Types';

// Import models data (we'll copy from the JSON file)
const availableModels: AIModel[] = [
  {"name":"deepseek","description":"DeepSeek V3","provider":"azure","tier":"seed","community":false,"aliases":"deepseek-v3","input_modalities":["text"],"output_modalities":["text"],"tools":false,"vision":false,"audio":false,"accessible":false,"userTier":"anonymous"},
  {"name":"deepseek-reasoning","description":"DeepSeek R1 0528","reasoning":true,"provider":"azure","tier":"seed","community":false,"aliases":"deepseek-r1-0528","input_modalities":["text"],"output_modalities":["text"],"tools":false,"vision":false,"audio":false,"accessible":false,"userTier":"anonymous"},
  {"name":"grok","description":"xAI Grok-3 Mini","provider":"azure","tier":"seed","community":false,"aliases":"grok-3-mini","input_modalities":["text"],"output_modalities":["text"],"tools":true,"vision":false,"audio":false,"accessible":false,"userTier":"anonymous"},
  {"name":"llamascout","description":"Llama 4 Scout 17B","provider":"cloudflare","tier":"anonymous","community":false,"aliases":"llama-4-scout-17b-16e-instruct","input_modalities":["text"],"output_modalities":["text"],"tools":false,"vision":false,"audio":false,"accessible":true,"userTier":"anonymous"},
  {"name":"mistral","description":"Mistral Small 3.1 24B","provider":"cloudflare","tier":"anonymous","community":false,"aliases":"mistral-small-3.1-24b-instruct","input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"vision":true,"audio":false,"accessible":true,"userTier":"anonymous"},
  {"name":"openai","description":"OpenAI GPT-4.1 Mini","provider":"azure","tier":"anonymous","community":false,"aliases":"gpt-4.1-mini","input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"vision":true,"audio":false,"accessible":true,"userTier":"anonymous"},
  {"name":"openai-fast","description":"OpenAI GPT-4.1 Nano","provider":"azure","tier":"anonymous","community":false,"aliases":"gpt-4.1-nano","input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"vision":true,"audio":false,"accessible":true,"userTier":"anonymous"},
  {"name":"openai-large","description":"OpenAI GPT-4.1","provider":"azure","tier":"seed","community":false,"aliases":"gpt-4.1","input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"vision":true,"audio":false,"accessible":false,"userTier":"anonymous"},
  {"name":"phi","description":"Phi-4 Mini Instruct","provider":"azure","tier":"anonymous","community":false,"aliases":"phi-4-mini-instruct","input_modalities":["text","image","audio"],"output_modalities":["text"],"tools":false,"vision":true,"audio":true,"accessible":true,"userTier":"anonymous"},
  {"name":"qwen-coder","description":"Qwen 2.5 Coder 32B","provider":"scaleway","tier":"anonymous","community":false,"aliases":"qwen2.5-coder-32b-instruct","input_modalities":["text"],"output_modalities":["text"],"tools":true,"vision":false,"audio":false,"accessible":true,"userTier":"anonymous"},
  {"name":"bidara","description":"BIDARA (Biomimetic Designer and Research Assistant by NASA)","provider":"azure","tier":"anonymous","community":true,"input_modalities":["text","image"],"output_modalities":["text"],"tools":true,"vision":true,"audio":false,"accessible":true,"userTier":"anonymous"},
  {"name":"midijourney","description":"MIDIjourney","provider":"azure","tier":"anonymous","community":true,"input_modalities":["text"],"output_modalities":["text"],"tools":true,"vision":false,"audio":false,"accessible":true,"userTier":"anonymous"},
  {"name":"rtist","description":"Rtist","provider":"azure","tier":"anonymous","community":true,"input_modalities":["text"],"output_modalities":["text"],"tools":true,"vision":false,"audio":false,"accessible":true,"userTier":"anonymous"}
];

export class MedicoAPI {
  private static baseURL = 'https://text.pollinations.ai/openai'; // Using Pollinations.ai OpenAI-compatible endpoint
  private static legacyURL = 'https://your-mcp-server-domain.com/mcp-server.php'; // Replace with actual domain for legacy support
  
  static getAvailableModels(): AIModel[] {
    return availableModels.filter(model => model.accessible);
  }

  static getModelByName(name: string): AIModel | undefined {
    return availableModels.find(model => model.name === name);
  }

  static getVisionCapableModels(): AIModel[] {
    return availableModels.filter(model => model.accessible && model.vision);
  }

  private static generateSystemPrompt(userProfile: UserProfile): string {
    return `You are Medico AI, an advanced medical assistant specializing in medical education and healthcare guidance. 

User Information:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Email: ${userProfile.email}

You provide detailed, evidence-based medical knowledge for educational purposes only. Always recommend consulting qualified healthcare professionals for patient care. Respond in a clear, educational manner appropriate for medical students and healthcare professionals.

When responding, if you mention mathematical, physics, or scientific symbols and formulas, use LaTeX markdown format. For example:
- Use \\( \\) for inline math like \\( E = mc^2 \\)
- Use \\[ \\] for block math like \\[ F = ma \\]
- Include proper medical symbols, drug equations, and units when relevant

Always wrap LaTeX expressions appropriately for rendering.

Created and maintained by Sukhdev Singh, a computer science professional passionate about integrating technology with medical education. This tool was created for medical education purposes.`;
  }

  static async sendMessage(
    prompt: string,
    chatHistory: ChatMessage[],
    userProfile: UserProfile,
    model: string = 'mistral',
    images?: string[]
  ): Promise<APIResponse> {
    try {
      const systemPrompt = this.generateSystemPrompt(userProfile);
      
      // Build OpenAI-compatible messages array
      const messages: any[] = [
        { role: 'system', content: systemPrompt }
      ];

      // Add chat history
      chatHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });

      // Create user message with multimodal content if images are provided
      let userMessage: any;
      if (images && images.length > 0) {
        const content: any[] = [
          { type: 'text', text: prompt }
        ];
        
        // Add images to content
        images.forEach(imageUrl => {
          content.push({
            type: 'image_url',
            image_url: { url: imageUrl }
          });
        });
        
        userMessage = {
          role: 'user',
          content: content
        };
      } else {
        userMessage = {
          role: 'user',
          content: prompt
        };
      }
      
      messages.push(userMessage);

      const payload = {
        model,
        messages,
        temperature: 0.2,
        max_tokens: 700,
        stream: false
      };

      const response = await axios.post(this.baseURL, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      // Transform response to match our APIResponse interface
      const openAIResponse = response.data;
      if (openAIResponse.choices && openAIResponse.choices[0]) {
        return {
          success: true,
          content: openAIResponse.choices[0].message.content,
          model,
          timestamp: new Date().toISOString(),
          usage: openAIResponse.usage || {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0
          }
        };
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('API Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          return {
            success: false,
            error: 'Request timed out. Please try again.',
          };
        }
        
        if (error.response) {
          return {
            success: false,
            error: `Server error: ${error.response.status}`,
          };
        }
        
        if (error.request) {
          return {
            success: false,
            error: 'Network error. Please check your connection.',
          };
        }
      }

      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  static async validateModel(modelName: string): Promise<boolean> {
    const model = this.getModelByName(modelName);
    return model ? model.accessible === true : false;
  }

  static getDefaultModel(): string {
    const defaultModels = ['mistral', 'openai', 'llamascout'];
    for (const modelName of defaultModels) {
      const model = this.getModelByName(modelName);
      if (model && model.accessible) {
        return modelName;
      }
    }
    return 'mistral'; // fallback
  }

  // Vision Analysis Methods
  static async analyzeImage(
    imageUrl: string,
    question: string = "Analyze this medical image and provide detailed observations.",
    userProfile: UserProfile,
    model: string = 'openai'
  ): Promise<APIResponse> {
    try {
      // Ensure we use a vision-capable model
      const selectedModel = this.getModelByName(model);
      if (!selectedModel || !selectedModel.vision) {
        const visionModels = this.getVisionCapableModels();
        if (visionModels.length === 0) {
          return {
            success: false,
            error: 'No vision-capable models available'
          };
        }
        model = visionModels[0].name;
      }

      const systemPrompt = this.generateSystemPrompt(userProfile) + 
        "\n\nYou are analyzing medical images. Provide detailed, accurate observations focusing on medical relevance. Always recommend consulting healthcare professionals for diagnosis.";

      const payload = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: question },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.2
      };

      const response = await axios.post(this.baseURL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 45000
      });

      const openAIResponse = response.data;
      if (openAIResponse.choices && openAIResponse.choices[0]) {
        return {
          success: true,
          content: openAIResponse.choices[0].message.content,
          model,
          timestamp: new Date().toISOString(),
          usage: openAIResponse.usage
        };
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Vision Analysis Error:', error);
      return this.handleAPIError(error);
    }
  }

  static async analyzeImageBase64(
    imageBase64: string,
    userProfile: UserProfile,
    question: string = "Analyze this medical image and provide detailed observations.",
    imageFormat: string = 'jpeg',
    model: string = 'openai'
  ): Promise<APIResponse> {
    try {
      const dataUrl = `data:image/${imageFormat};base64,${imageBase64}`;
      return await this.analyzeImage(dataUrl, question, userProfile, model);
    } catch (error) {
      console.error('Base64 Image Analysis Error:', error);
      return this.handleAPIError(error);
    }
  }

  // Audio Transcription Methods
  static async transcribeAudio(
    audioBase64: string,
    audioFormat: 'wav' | 'mp3' = 'mp3',
    userProfile: UserProfile
  ): Promise<APIResponse> {
    try {
      const systemPrompt = this.generateSystemPrompt(userProfile) + 
        "\n\nYou are transcribing medical audio. Provide accurate transcription with proper medical terminology.";

      const payload = {
        model: 'openai-audio',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Please transcribe this audio:' },
              {
                type: 'input_audio',
                input_audio: {
                  data: audioBase64,
                  format: audioFormat
                }
              }
            ]
          }
        ]
      };

      const response = await axios.post(this.baseURL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000 // Longer timeout for audio processing
      });

      const openAIResponse = response.data;
      if (openAIResponse.choices && openAIResponse.choices[0]) {
        return {
          success: true,
          content: openAIResponse.choices[0].message.content,
          model: 'openai-audio',
          timestamp: new Date().toISOString(),
          usage: openAIResponse.usage
        };
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Audio Transcription Error:', error);
      return this.handleAPIError(error);
    }
  }

  // Multi-modal medical analysis
  static async analyzeMultiModal(
    textPrompt: string,
    images: string[] = [],
    audioBase64?: string,
    audioFormat?: 'wav' | 'mp3',
    userProfile: UserProfile,
    model: string = 'openai'
  ): Promise<APIResponse> {
    try {
      const systemPrompt = this.generateSystemPrompt(userProfile) + 
        "\n\nYou are performing multi-modal medical analysis. Analyze all provided inputs (text, images, audio) comprehensively and provide integrated medical insights.";

      const content: any[] = [
        { type: 'text', text: textPrompt }
      ];

      // Add images
      images.forEach(imageUrl => {
        content.push({
          type: 'image_url',
          image_url: { url: imageUrl }
        });
      });

      // Add audio if provided
      if (audioBase64 && audioFormat) {
        content.push({
          type: 'input_audio',
          input_audio: {
            data: audioBase64,
            format: audioFormat
          }
        });
      }

      const payload = {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: content
          }
        ],
        max_tokens: 1000,
        temperature: 0.2
      };

      const response = await axios.post(this.baseURL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });

      const openAIResponse = response.data;
      if (openAIResponse.choices && openAIResponse.choices[0]) {
        return {
          success: true,
          content: openAIResponse.choices[0].message.content,
          model,
          timestamp: new Date().toISOString(),
          usage: openAIResponse.usage
        };
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Multi-modal Analysis Error:', error);
      return this.handleAPIError(error);
    }
  }

  // Enhanced error handling
  private static handleAPIError(error: any): APIResponse {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Request timed out. Please try again with a smaller file or simpler query.',
        };
      }
      
      if (error.response) {
        const status = error.response.status;
        if (status === 413) {
          return {
            success: false,
            error: 'File too large. Please use a smaller image or audio file.',
          };
        } else if (status === 429) {
          return {
            success: false,
            error: 'Rate limit exceeded. Please wait a moment before trying again.',
          };
        } else if (status >= 500) {
          return {
            success: false,
            error: 'Server error. Please try again later.',
          };
        } else {
          return {
            success: false,
            error: `API error: ${status}. Please check your input and try again.`,
          };
        }
      }
      
      if (error.request) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection.',
        };
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }

  // Helper method to convert file to base64
  static async fileToBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // This would be implemented differently in React Native
        // Using FileReader for web compatibility, but in RN you'd use react-native-fs
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }
}