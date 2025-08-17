// Gemini AI provider - requires '@google/generative-ai' package to be installed
// Run: npm install @google/generative-ai

import type { AIProvider, AIConfig, AIResponse, AIMessage } from '../index';

export interface GeminiConfig extends AIConfig {
  apiKey: string;
  model?: string;
}

export class GeminiAI implements AIProvider {
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
    console.warn(
      "Gemini AI provider is not configured. Install @google/generative-ai package to use this provider.",
    );
  }

  async connect(): Promise<boolean> {
    return false; // Not implemented without @google/generative-ai package
  }

  async testConnection(): Promise<boolean> {
    return false; // Not implemented without @google/generative-ai package
  }

  async generateResponse(messages: AIMessage[], options?: any): Promise<AIResponse> {
    throw new Error(
      "Gemini AI provider requires @google/generative-ai package. Run: npm install @google/generative-ai",
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
