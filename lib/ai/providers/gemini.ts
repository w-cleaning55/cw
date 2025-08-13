import { AIProvider, AIConfig, AIResponse, AIMessage } from '../index';

export class GeminiProvider implements AIProvider {
  private config: AIConfig;
  private client: any = null;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');

        this.client = new GoogleGenerativeAI(this.config.apiKey);

        return true;
      } catch (importError) {
        console.warn('Google Generative AI package not installed. Install with: npm install @google/generative-ai');
        return false;
      }
    } catch (error) {
      console.error('Gemini connection failed:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.client) return false;
      
      const model = this.client.getGenerativeModel({ 
        model: this.config.model || 'gemini-pro' 
      });
      
      const result = await model.generateContent('Test connection');
      const response = await result.response;
      
      return response && response.text();
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }

  async generateResponse(messages: AIMessage[], options?: any): Promise<AIResponse> {
    try {
      if (!this.client) {
        throw new Error('Gemini client not initialized');
      }

      const model = this.client.getGenerativeModel({ 
        model: options?.model || this.config.model || 'gemini-pro',
        generationConfig: {
          temperature: options?.temperature ?? this.config.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? this.config.maxTokens ?? 2000,
          topP: options?.topP ?? 0.8,
          topK: options?.topK ?? 40,
        }
      });

      // Convert messages to Gemini format
      let prompt = '';
      let systemInstruction = '';
      
      for (const message of messages) {
        if (message.role === 'system') {
          systemInstruction = message.content;
        } else if (message.role === 'user') {
          prompt += `User: ${message.content}\n`;
        } else if (message.role === 'assistant') {
          prompt += `Assistant: ${message.content}\n`;
        }
      }

      // Add system instruction to the beginning if present
      if (systemInstruction) {
        prompt = `${systemInstruction}\n\n${prompt}`;
      }

      prompt += 'Assistant: ';

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        usage: {
          prompt_tokens: this.estimateTokens(prompt),
          completion_tokens: this.estimateTokens(text),
          total_tokens: this.estimateTokens(prompt + text)
        },
        model: this.config.model || 'gemini-pro',
        finish_reason: 'stop'
      };
    } catch (error) {
      console.error('Gemini response generation failed:', error);
      throw new Error(`Gemini error: ${error.message}`);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!this.client) {
        throw new Error('Gemini client not initialized');
      }

      const model = this.client.getGenerativeModel({ 
        model: 'embedding-001' 
      });

      const result = await model.embedContent(text);
      
      return result.embedding.values;
    } catch (error) {
      console.error('Gemini embedding generation failed:', error);
      throw new Error(`Gemini embedding error: ${error.message}`);
    }
  }

  async getModels(): Promise<string[]> {
    try {
      // Gemini available models (as of current knowledge)
      return [
        'gemini-pro',
        'gemini-pro-vision',
        'gemini-ultra',
        'embedding-001'
      ];
    } catch (error) {
      console.error('Gemini models fetch failed:', error);
      return ['gemini-pro'];
    }
  }

  // Utility method to estimate tokens (rough approximation)
  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English, 2-3 for Arabic
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const otherChars = text.length - arabicChars;
    
    return Math.ceil((arabicChars / 2.5) + (otherChars / 4));
  }

  // Additional Gemini-specific methods
  async generateContentWithImages(prompt: string, images: string[], options?: any): Promise<AIResponse> {
    try {
      if (!this.client) {
        throw new Error('Gemini client not initialized');
      }

      const model = this.client.getGenerativeModel({ 
        model: 'gemini-pro-vision',
        generationConfig: {
          temperature: options?.temperature ?? this.config.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? this.config.maxTokens ?? 2000,
        }
      });

      // Convert images to the required format
      const imageParts = await Promise.all(
        images.map(async (imageUrl) => {
          if (imageUrl.startsWith('data:')) {
            // Base64 image
            const [mimeType, data] = imageUrl.split(',');
            return {
              inlineData: {
                data: data,
                mimeType: mimeType.split(':')[1].split(';')[0]
              }
            };
          } else {
            // URL - need to fetch and convert
            const response = await fetch(imageUrl);
            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString('base64');
            
            return {
              inlineData: {
                data: base64,
                mimeType: response.headers.get('content-type') || 'image/jpeg'
              }
            };
          }
        })
      );

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        usage: {
          prompt_tokens: this.estimateTokens(prompt),
          completion_tokens: this.estimateTokens(text),
          total_tokens: this.estimateTokens(prompt + text)
        },
        model: 'gemini-pro-vision',
        finish_reason: 'stop'
      };
    } catch (error) {
      console.error('Gemini vision generation failed:', error);
      throw new Error(`Gemini vision error: ${error.message}`);
    }
  }

  async startChat(history: AIMessage[] = []): Promise<any> {
    try {
      if (!this.client) {
        throw new Error('Gemini client not initialized');
      }

      const model = this.client.getGenerativeModel({ 
        model: this.config.model || 'gemini-pro',
        generationConfig: {
          temperature: this.config.temperature ?? 0.7,
          maxOutputTokens: this.config.maxTokens ?? 2000,
        }
      });

      // Convert message history to Gemini format
      const chatHistory = history
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));

      const chat = model.startChat({
        history: chatHistory,
      });

      return chat;
    } catch (error) {
      console.error('Gemini chat start failed:', error);
      throw new Error(`Gemini chat error: ${error.message}`);
    }
  }

  async continueChat(chat: any, message: string): Promise<string> {
    try {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chat continuation failed:', error);
      throw new Error(`Gemini chat error: ${error.message}`);
    }
  }

  async generateSafetySettings(): any {
    return [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ];
  }
}
