import { useState, useEffect } from 'react';

type Language = 'en' | 'ar';

interface NumberFormatter {
  formatNumber: (num: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatPercent: (percent: number) => string;
  formatCompact: (num: number) => string;
}

export function useNumberFormatter(language: Language = 'en'): NumberFormatter {
  const [locale, setLocale] = useState<string>('en-US');

  useEffect(() => {
    setLocale(language === 'ar' ? 'ar-SA' : 'en-US');
  }, [language]);

  const formatNumber = (num: number): string => {
    try {
      return new Intl.NumberFormat(locale).format(num);
    } catch {
      return num.toString();
    }
  };

  const formatCurrency = (amount: number, currency: string = 'SAR'): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  };

  const formatPercent = (percent: number): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }).format(percent / 100);
    } catch {
      return `${percent}%`;
    }
  };

  const formatCompact = (num: number): string => {
    try {
      if (num >= 1000000) {
        return new Intl.NumberFormat(locale, {
          notation: 'compact',
          compactDisplay: 'short',
        }).format(num);
      }
      return formatNumber(num);
    } catch {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
    }
  };

  return {
    formatNumber,
    formatCurrency,
    formatPercent,
    formatCompact,
  };
}

export default useNumberFormatter;
