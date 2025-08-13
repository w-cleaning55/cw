import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';

export type AIProvider = 'openai' | 'gemini';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  isActive: boolean;
  lastTested?: string;
  connectionStatus?: 'connected' | 'disconnected' | 'error';
}

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
  finish_reason?: string;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AIProvider {
  connect(): Promise<boolean>;
  testConnection(): Promise<boolean>;
  generateResponse(messages: AIMessage[], options?: any): Promise<AIResponse>;
  generateEmbedding?(text: string): Promise<number[]>;
  getModels?(): Promise<string[]>;
}

class AIManager {
  private currentProvider: AIProvider | null = null;
  private config: AIConfig | null = null;
  private systemPrompts: Map<string, string> = new Map();

  async initialize(config: AIConfig): Promise<boolean> {
    try {
      this.config = config;
      
      switch (config.provider) {
        case 'openai':
          this.currentProvider = new OpenAIProvider(config);
          break;
        case 'gemini':
          this.currentProvider = new GeminiProvider(config);
          break;
        default:
          throw new Error(`Unsupported AI provider: ${config.provider}`);
      }

      const connected = await this.currentProvider.connect();
      
      if (connected) {
        config.connectionStatus = 'connected';
        config.lastTested = new Date().toISOString();
      } else {
        config.connectionStatus = 'error';
      }

      return connected;
    } catch (error) {
      console.error('AI initialization failed:', error);
      if (this.config) {
        this.config.connectionStatus = 'error';
      }
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.currentProvider) return false;
    
    try {
      const result = await this.currentProvider.testConnection();
      if (this.config) {
        this.config.connectionStatus = result ? 'connected' : 'error';
        this.config.lastTested = new Date().toISOString();
      }
      return result;
    } catch (error) {
      console.error('AI connection test failed:', error);
      if (this.config) {
        this.config.connectionStatus = 'error';
      }
      return false;
    }
  }

  async switchProvider(newConfig: AIConfig): Promise<boolean> {
    return await this.initialize(newConfig);
  }

  setSystemPrompt(context: string, prompt: string): void {
    this.systemPrompts.set(context, prompt);
  }

  getSystemPrompt(context: string): string | undefined {
    return this.systemPrompts.get(context);
  }

  async generateResponse(
    messages: AIMessage[], 
    context?: string,
    options?: any
  ): Promise<AIResponse> {
    if (!this.currentProvider) {
      throw new Error('AI provider not initialized');
    }

    // Add system prompt if context is provided
    if (context && this.systemPrompts.has(context)) {
      const systemPrompt = this.systemPrompts.get(context)!;
      messages = [
        { role: 'system', content: systemPrompt },
        ...messages.filter(m => m.role !== 'system')
      ];
    }

    return await this.currentProvider.generateResponse(messages, options);
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.currentProvider || !this.currentProvider.generateEmbedding) {
      return null;
    }

    return await this.currentProvider.generateEmbedding(text);
  }

  async getAvailableModels(): Promise<string[]> {
    if (!this.currentProvider || !this.currentProvider.getModels) {
      return [];
    }

    return await this.currentProvider.getModels();
  }

  getCurrentConfig(): AIConfig | null {
    return this.config;
  }

  isConnected(): boolean {
    return this.config?.connectionStatus === 'connected';
  }
}

// Global AI manager instance
export const aiManager = new AIManager();

// Default configurations for each AI provider
export const defaultAIConfigs: Record<AIProvider, Partial<AIConfig>> = {
  openai: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    isActive: false
  },
  gemini: {
    provider: 'gemini',
    model: 'gemini-pro',
    temperature: 0.7,
    maxTokens: 2000,
    isActive: false
  }
};

// System prompts for different contexts
export const systemPrompts = {
  customerService: `أنت مساعد ذكي متخصص في خدمة العملاء لشركة تنظيف. دورك هو:

1. الرد على استفسارات العملاء بطريقة ودودة ومهنية
2. تقديم معلومات دقيقة حول الخدمات والأسعار
3. مساعدة العملاء في حجز الخدمات
4. حل المشاكل والشكاوى بفعالية
5. التحدث بالعربية بشكل أساسي مع دعم الإنجليزية

تأكد من أن إجاباتك مفيدة ودقيقة ومناسبة للثقافة السعودية.`,

  sales: `أنت خبير مبيعات متخصص في خدمات التنظيف. هدفك هو:

1. فهم احتياجات العملاء وتقديم الحلول المناسبة
2. شرح فوائد الخدمات بطريقة مقنعة
3. تقديم العروض والخصومات المناسبة
4. إقناع العملاء بقيمة الخدمات المقدمة
5. إتمام عمليات البيع بنجاح

استخدم أسلوب مبيعات احترافي ومناسب للسوق السعودي.`,

  technical: `أنت خبير تقني في مجال التنظيف. دورك هو:

1. تقديم معلومات تقنية دقيقة حول طرق التنظيف
2. شرح أنواع المعدات والمواد المستخدمة
3. تقديم نصائح للصيانة والعناية
4. حل المشاكل التقنية المتعلقة بالتنظيف
5. تعليم العملاء أفضل الممارسات

تأكد من أن المعلومات دقيقة وعملية وسهلة الفهم.`
};

export { OpenAIProvider, GeminiProvider };
