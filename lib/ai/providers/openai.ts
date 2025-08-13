import { AIProvider, AIConfig, AIResponse, AIMessage } from '../index';

export class OpenAIProvider implements AIProvider {
  private config: AIConfig;
  private client: any = null;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      try {
        const { default: OpenAI } = await import('openai');

        this.client = new OpenAI({
          apiKey: this.config.apiKey,
        });

        return true;
      } catch (importError) {
        console.warn('OpenAI package not installed. Install with: npm install openai');
        return false;
      }
    } catch (error) {
      console.error('OpenAI connection failed:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.client) return false;
      
      // Test with a simple completion
      const response = await this.client.chat.completions.create({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 5,
        temperature: 0
      });
      
      return response && response.choices && response.choices.length > 0;
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }

  async generateResponse(messages: AIMessage[], options?: any): Promise<AIResponse> {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const requestConfig = {
        model: options?.model || this.config.model || 'gpt-3.5-turbo',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: options?.temperature ?? this.config.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? this.config.maxTokens ?? 2000,
        presence_penalty: options?.presencePenalty ?? 0,
        frequency_penalty: options?.frequencyPenalty ?? 0,
        ...options
      };

      const response = await this.client.chat.completions.create(requestConfig);

      if (!response.choices || response.choices.length === 0) {
        throw new Error('No response generated');
      }

      return {
        content: response.choices[0].message.content || '',
        usage: response.usage ? {
          prompt_tokens: response.usage.prompt_tokens,
          completion_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens
        } : undefined,
        model: response.model,
        finish_reason: response.choices[0].finish_reason
      };
    } catch (error) {
      console.error('OpenAI response generation failed:', error);
      throw new Error(`OpenAI error: ${error.message}`);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.client.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
        encoding_format: 'float'
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('No embedding generated');
      }

      return response.data[0].embedding;
    } catch (error) {
      console.error('OpenAI embedding generation failed:', error);
      throw new Error(`OpenAI embedding error: ${error.message}`);
    }
  }

  async getModels(): Promise<string[]> {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.client.models.list();
      
      // Filter for chat models
      const chatModels = response.data
        .filter((model: any) => 
          model.id.includes('gpt') || 
          model.id.includes('chat')
        )
        .map((model: any) => model.id)
        .sort();

      return chatModels;
    } catch (error) {
      console.error('OpenAI models fetch failed:', error);
      // Return default models if API call fails
      return [
        'gpt-4',
        'gpt-4-turbo-preview',
        'gpt-3.5-turbo',
        'gpt-3.5-turbo-16k'
      ];
    }
  }

  // Additional OpenAI-specific methods
  async generateCompletion(prompt: string, options?: any): Promise<string> {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.client.completions.create({
        model: options?.model || 'text-davinci-003',
        prompt: prompt,
        max_tokens: options?.maxTokens ?? this.config.maxTokens ?? 1000,
        temperature: options?.temperature ?? this.config.temperature ?? 0.7,
        ...options
      });

      return response.choices[0].text || '';
    } catch (error) {
      console.error('OpenAI completion failed:', error);
      throw new Error(`OpenAI completion error: ${error.message}`);
    }
  }

  async moderateContent(text: string): Promise<any> {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.client.moderations.create({
        input: text,
      });

      return response.results[0];
    } catch (error) {
      console.error('OpenAI moderation failed:', error);
      throw new Error(`OpenAI moderation error: ${error.message}`);
    }
  }

  async generateImage(prompt: string, options?: any): Promise<string[]> {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.client.images.generate({
        prompt: prompt,
        n: options?.count || 1,
        size: options?.size || '1024x1024',
        quality: options?.quality || 'standard',
        ...options
      });

      return response.data.map((image: any) => image.url);
    } catch (error) {
      console.error('OpenAI image generation failed:', error);
      throw new Error(`OpenAI image generation error: ${error.message}`);
    }
  }

  async transcribeAudio(audioFile: File): Promise<string> {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        language: 'ar' // Arabic support
      });

      return response.text;
    } catch (error) {
      console.error('OpenAI transcription failed:', error);
      throw new Error(`OpenAI transcription error: ${error.message}`);
    }
  }

  async generateSpeech(text: string, options?: any): Promise<ArrayBuffer> {
    try {
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      const response = await this.client.audio.speech.create({
        model: 'tts-1',
        voice: options?.voice || 'alloy',
        input: text,
        ...options
      });

      return await response.arrayBuffer();
    } catch (error) {
      console.error('OpenAI speech generation failed:', error);
      throw new Error(`OpenAI speech generation error: ${error.message}`);
    }
  }
}
