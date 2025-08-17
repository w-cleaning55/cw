// Gemini AI provider - requires '@google/generative-ai' package to be installed
// Run: npm install @google/generative-ai

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
