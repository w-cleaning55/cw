import { NextResponse } from 'next/server';
import { dataManager } from '../../../server/utils/dataManager';

const defaultPalettes = [
  {
    id: 'clean-light',
    name: 'Clean Light',
    nameAr: 'نظيف فاتح',
    description: 'Clean and professional light theme for cleaning services',
    descriptionAr: 'ثيم فاتح نظيف ومهني لخدمات التنظي��',
    category: 'business',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#16a34a',
      warning: '#ea580c',
      error: '#dc2626',
      info: '#0ea5e9',
    },
    cssVariables: {
      '--radius': '0.5rem',
      '--brand-50': '240 100% 98%',
      '--brand-500': '217 91% 60%',
      '--brand-600': '217 91% 52%',
    },
    isActive: true,
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const palettes = await dataManager.readData('color-palettes') || defaultPalettes;
    return NextResponse.json(palettes);
  } catch (error) {
    return NextResponse.json(defaultPalettes);
  }
}
