// OpenAI provider - requires 'openai' package to be installed
// Run: npm install openai

import type { AIProvider, AIConfig, AIResponse, AIMessage } from '../index';

export interface OpenAIConfig extends AIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
}

export class OpenAI implements AIProvider {
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = config;
    console.warn(
      "OpenAI provider is not configured. Install openai package to use this provider.",
    );
  }

  async connect(): Promise<boolean> {
    return false; // Not implemented without openai package
  }

  async testConnection(): Promise<boolean> {
    return false; // Not implemented without openai package
  }

  async generateResponse(messages: AIMessage[], options?: any): Promise<AIResponse> {
    throw new Error(
      "OpenAI provider requires openai package. Run: npm install openai",
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
