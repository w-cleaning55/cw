import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { 
  withErrorHandler, 
  createSuccessResponse, 
  parseRequestBody, 
  validateRequired,
  safeFileRead,
  safeFileWrite
} from '../../../../lib/api-utils';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'system-settings.json');

const defaultSystemSettings = {
  company: {
    name: 'عالم النظافة',
    nameAr: 'عالم النظافة',
    nameEn: 'Cleaning World',
    description: 'خدمات تنظيف احترافية بمعدات متطورة وفنيين ذوي خبرة',
    descriptionAr: 'خدمات التنظيف المهنية بمعدات متطورة وفنيين ذوي خبرة',
    logo: '/images/logo.png',
    website: 'https://cw.com.sa',
    phone: '+966500000000',
    email: 'info@cleaningworld.sa',
    address: 'Jeddah, Saudi Arabia',
    addressAr: 'جدة، المملكة العربية السعودية'
  },
  theme: {
    primaryColor: '#1e3a8a',
    secondaryColor: '#0f172a',
    accentColor: '#0ea5e9',
    fontFamily: 'inter',
    logoUrl: '/images/logo.png',
    faviconUrl: '/favicon.ico',
    defaultLanguage: 'ar',
    rtlSupport: true
  },
  ai: {
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-pro',
    temperature: 0.7,
    maxTokens: 1000,
    enabled: true,
    responseLanguage: 'ar'
  }
};

export const GET = withErrorHandler(async (request: NextRequest) => {
  const fileData = await safeFileRead(SETTINGS_FILE, { systemSettings: defaultSystemSettings });
  const settings = fileData.systemSettings || defaultSystemSettings;
  return NextResponse.json(
    createSuccessResponse({ settings }, 'System settings retrieved successfully')
  );
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await parseRequestBody(request);
  validateRequired(body, 'settings data');

  const fileData = await safeFileRead(SETTINGS_FILE, { systemSettings: defaultSystemSettings });
  const merged = {
    systemSettings: {
      ...defaultSystemSettings,
      ...fileData.systemSettings,
      ...body,
      updatedAt: new Date().toISOString(),
    },
  };

  await safeFileWrite(SETTINGS_FILE, merged);

  return NextResponse.json(
    createSuccessResponse(merged.systemSettings, 'System settings updated successfully')
  );
});
