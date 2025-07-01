import axios from 'axios';
import { AIModel, APIResponse, ChatMessage, UserProfile } from '../constants/Types';

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
  private static baseURL = 'https://your-mcp-server-domain.com/mcp-server.php'; // Replace with actual domain
  
  static getAvailableModels(): AIModel[] {
    return availableModels.filter(model => model.accessible);
  }

  static getModelByName(name: string): AIModel | undefined {
    return availableModels.find(model => model.name === name);
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
      
      // Build conversation memory from chat history
      const memory = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const payload = {
        prompt,
        system_prompt: systemPrompt,
        model,
        temperature: 0.2,
        max_tokens: 700,
        language: 'en',
        memory,
        images: images || []
      };

      const response = await axios.post(this.baseURL, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      return response.data;
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
}