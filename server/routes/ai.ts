import { RequestHandler } from "express";
import { z } from "zod";

const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string()
  })),
  provider: z.enum(['openai', 'gemini']),
  apiKey: z.string(),
  model: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional()
});

export const handleAIChat: RequestHandler = async (req, res) => {
  try {
    const chatRequest = ChatRequestSchema.parse(req.body);
    
    // Mock AI response for development
    // In production, this would make actual API calls to OpenAI/Gemini
    const mockResponse = {
      content: `This is a mock AI response. In production, this would be a real response from ${chatRequest.provider} using model ${chatRequest.model}.`,
      provider: chatRequest.provider,
      model: chatRequest.model,
      usage: {
        promptTokens: 50,
        completionTokens: 25,
        totalTokens: 75
      }
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    res.json(mockResponse);
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(400).json({ error: 'Invalid AI request' });
  }
};

export const handleAITest: RequestHandler = async (req, res) => {
  try {
    const { provider, apiKey } = req.body;
    
    // Mock test response
    // In production, this would test the actual API connection
    const isValid = apiKey && apiKey.length > 10; // Basic validation
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.json({ 
      success: isValid,
      provider,
      message: isValid ? 'Connection successful' : 'Invalid API key'
    });
  } catch (error) {
    console.error('AI test error:', error);
    res.status(500).json({ error: 'Test failed' });
  }
};
