import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { 
  withErrorHandler, 
  createSuccessResponse, 
  parseRequestBody
} from '../../../../lib/api-utils';
import { aiManager, defaultAIConfigs } from '../../../../lib/ai';
import { smartChatbot } from '../../../../lib/ai/smart-chatbot';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'system-settings.json');

async function readSystemSettings(): Promise<any> {
  try {
    const fs = await import('fs/promises');
    const raw = await fs.readFile(SETTINGS_FILE, 'utf8');
    const json = JSON.parse(raw);
    return json?.systemSettings || {};
  } catch {
    return {} as any;
  }
}

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await parseRequestBody(request);
  const { message, context = 'sales', provider } = body || {};

  if (!message || typeof message !== 'string') {
    return NextResponse.json(createSuccessResponse(null, 'Message is required'), { status: 400 });
  }

  // Load AI settings
  const settings = await readSystemSettings();
  const ai = settings?.ai || {};

  // Try to initialize AI provider if enabled and apiKey exists
  if (ai?.enabled && ai?.apiKey) {
    const cfg = {
      provider: (provider || ai.provider || 'gemini') as 'openai' | 'gemini',
      apiKey: ai.apiKey,
      model: ai.model || defaultAIConfigs[(provider || ai.provider || 'gemini') as 'openai' | 'gemini'].model,
      temperature: ai.temperature ?? 0.7,
      maxTokens: ai.maxTokens ?? 1000,
      isActive: true,
    } as any;

    await aiManager.initialize(cfg).catch(() => false);
  }

  // Use smartChatbot (will fallback automatically if AI not connected)
  const sessionId = await smartChatbot.createSession(
    context === 'support' ? 'customerService' : context === 'content' ? 'technical' : context === 'booking' ? 'booking' : 'sales'
  );
  const responseText = await smartChatbot.sendMessage(sessionId, message, true);

  return NextResponse.json({ success: true, response: responseText });
});

export const GET = withErrorHandler(async () => {
  const analytics = await smartChatbot.getAnalytics();
  return NextResponse.json(createSuccessResponse(analytics, 'ok'));
});
