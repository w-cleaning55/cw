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
