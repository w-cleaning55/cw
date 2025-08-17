import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely extracts text from multilingual object
 * @param textObj - Object with 'ar' and 'en' keys
 * @param language - Language to extract ('ar' or 'en')
 * @param fallback - Fallback text if extraction fails
 * @returns Safe string text
 */
export function getMultilingualText(
  textObj: any,
  language: 'ar' | 'en' = 'ar',
  fallback: string = ''
): string {
  if (!textObj || typeof textObj !== 'object') {
    return fallback;
  }
  
  if (typeof textObj === 'string') {
    return textObj;
  }
  
  const text = textObj[language] || textObj['en'] || textObj['ar'] || fallback;
  return typeof text === 'string' ? text : fallback;
}

/**
 * Safely extracts text based on current language context
 * @param textObj - Object with 'ar' and 'en' keys
 * @param isArabic - Boolean indicating if current language is Arabic
 * @param fallback - Fallback text if extraction fails
 * @returns Safe string text
 */
export function getLocalizedText(
  textObj: any,
  isArabic: boolean = true,
  fallback: string = ''
): string {
  return getMultilingualText(textObj, isArabic ? 'ar' : 'en', fallback);
}
