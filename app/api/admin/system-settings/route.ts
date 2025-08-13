import { NextRequest, NextResponse } from 'next/server';
import { 
  withErrorHandler, 
  createSuccessResponse, 
  parseRequestBody, 
  validateRequired,
  safeFileRead,
  safeFileWrite
} from '../../../../lib/api-utils';

// Temporarily simplified system settings without complex dependencies
const defaultSystemSettings = {
  company: {
    name: 'Cleaning World',
    nameAr: 'عالم التنظيف',
    description: 'Professional cleaning services with advanced equipment and experienced technicians',
    descriptionAr: 'خدمات التنظيف المهنية بمعدات متطورة وفنيين ذوي خبرة',
    logo: '/logo.png',
    website: 'https://m-clean.net',
    phone: '+966501234567',
    email: 'info@m-clean.net',
    address: 'Riyadh, Saudi Arabia',
    addressAr: 'الرياض، المملكة العربية السعودية'
  },
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#f3f4f6',
    accentColor: '#10b981',
    fontFamily: 'inter',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    defaultLanguage: 'ar',
    rtlSupport: true
  }
};

export const GET = withErrorHandler(async (request: NextRequest) => {
  return NextResponse.json(
    createSuccessResponse({ settings: defaultSystemSettings }, 'System settings retrieved successfully')
  );
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await parseRequestBody(request);
  
  validateRequired(body, 'settings data');
  
  const updatedSettings = {
    ...defaultSystemSettings,
    ...body,
    updatedAt: new Date().toISOString()
  };
  
  return NextResponse.json(
    createSuccessResponse(updatedSettings, 'System settings updated successfully')
  );
});
