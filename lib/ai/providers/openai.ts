// OpenAI provider - requires 'openai' package to be installed
// Run: npm install openai

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
}

export class OpenAI {
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = config;
    console.warn(
      "OpenAI provider is not configured. Install openai package to use this provider.",
    );
  }

  async generateText(prompt: string): Promise<string> {
    throw new Error(
      "OpenAI provider requires openai package. Run: npm install openai",
    );
  }

  async chat(messages: any[]): Promise<string> {
    throw new Error("OpenAI provider not available");
  }

  async createCompletion(prompt: string, options?: any): Promise<string> {
    throw new Error("OpenAI provider not available");
  }
}

import type { AIMessage, AIResponse, AIConfig } from '../index';

export class OpenAIProvider {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    // Stub connection; real implementation requires openai SDK and network call
    return false;
  }

  async testConnection(): Promise<boolean> {
    return false;
  }

  async generateResponse(_messages: AIMessage[], _options?: any): Promise<AIResponse> {
    return {
      content: 'OpenAI provider is not configured on this deployment.',
    } as AIResponse;
  }

  async generateEmbedding?(_text: string): Promise<number[]> {
    return [];
  }

  async getModels?(): Promise<string[]> {
    return [this.config.model || 'gpt-4'];
  }
}
