// Gemini AI provider - requires '@google/generative-ai' package to be installed
// Run: npm install @google/generative-ai

import type { AIMessage, AIResponse, AIConfig } from '../index';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export class GeminiAI {
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    console.warn(
      "Gemini AI provider is not configured. Install @google/generative-ai package to use this provider.",
    );
  }

  async generateText(prompt: string): Promise<string> {
    throw new Error(
      "Gemini AI provider requires @google/generative-ai package. Run: npm install @google/generative-ai",
    );
  }

  async chat(messages: any[]): Promise<string> {
    throw new Error("Gemini AI provider not available");
  }
}

export class GeminiProvider {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    // Stub connection; real implementation requires gemini SDK and network call
    return false;
  }

  async testConnection(): Promise<boolean> {
    return false;
  }

  async generateResponse(_messages: AIMessage[], _options?: any): Promise<AIResponse> {
    return {
      content: 'Gemini provider is not configured on this deployment.',
    } as AIResponse;
  }

  async generateEmbedding?(_text: string): Promise<number[]> {
    return [];
  }

  async getModels?(): Promise<string[]> {
    return [this.config.model || 'gemini-pro'];
  }
}
