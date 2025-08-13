export interface ColorPalette {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'business' | 'creative' | 'nature' | 'tech' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  cssVariables: Record<string, string>;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaletteTheme {
  id: string;
  name: string;
  nameAr: string;
  mode: 'light' | 'dark' | 'blue' | 'green';
  palette: ColorPalette;
  customizations?: {
    borderRadius?: string;
    fontFamily?: string;
    shadows?: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
}

class ColorPaletteService {
  private baseUrl = '/api';

  // Get all available color palettes
  async getPalettes(): Promise<ColorPalette[]> {
    try {
      const response = await fetch(`${this.baseUrl}/color-palettes`);
      if (!response.ok) {
        console.warn('Failed to fetch palettes from server, using defaults');
        return this.getDefaultPalettes();
      }
      const data = await response.json();
      return Array.isArray(data) ? data : this.getDefaultPalettes();
    } catch (error) {
      console.warn('Network error loading palettes, using defaults:', error);
      return this.getDefaultPalettes();
    }
  }

  // Get active palette
  async getActivePalette(): Promise<ColorPalette> {
    try {
      const response = await fetch(`${this.baseUrl}/color-palettes/active`);
      if (!response.ok) {
        console.warn('Failed to fetch active palette from server, using default');
        return this.getDefaultPalettes()[0];
      }
      const data = await response.json();
      return data || this.getDefaultPalettes()[0];
    } catch (error) {
      console.warn('Network error loading active palette, using default:', error);
      return this.getDefaultPalettes()[0];
    }
  }

  // Save new palette
  async savePalette(palette: Omit<ColorPalette, 'id' | 'createdAt' | 'updatedAt'>): Promise<ColorPalette> {
    try {
      const response = await fetch(`${this.baseUrl}/color-palettes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(palette),
      });
      
      if (!response.ok) {
        throw new Error('فشل في حفظ الباليت');
      }
      
      return await response.json();
    } catch (error) {
      console.error('خطأ في حفظ الباليت:', error);
      throw error;
    }
  }

  // Update existing palette
  async updatePalette(id: string, palette: Partial<ColorPalette>): Promise<ColorPalette> {
    try {
      const response = await fetch(`${this.baseUrl}/color-palettes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(palette),
      });
      
      if (!response.ok) {
        throw new Error('فشل في تحديث الباليت');
      }
      
      return await response.json();
    } catch (error) {
      console.error('خطأ في تحديث الباليت:', error);
      throw error;
    }
  }

  // Delete palette
  async deletePalette(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/color-palettes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('فشل في حذف الباليت');
      }
    } catch (error) {
      console.error('خطأ في حذف الباليت:', error);
      throw error;
    }
  }

  // Set active palette
  async setActivePalette(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/color-palettes/${id}/activate`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('فشل في تفعيل الباليت');
      }
    } catch (error) {
      console.error('خطأ في تفعيل الباليت:', error);
      throw error;
    }
  }

  // Generate palette from image
  async generateFromImage(imageFile: File): Promise<ColorPalette> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch(`${this.baseUrl}/color-palettes/generate-from-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('فشل في توليد الباليت من الصورة');
      }
      
      return await response.json();
    } catch (error) {
      console.error('خطأ في توليد الباليت من الصورة:', error);
      throw error;
    }
  }

  // Generate AI-powered palette
  async generateWithAI(prompt: string, category: string): Promise<ColorPalette> {
    try {
      const response = await fetch(`${this.baseUrl}/color-palettes/generate-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, category }),
      });
      
      if (!response.ok) {
        throw new Error('فشل في توليد الباليت بالذكاء الاصطناعي');
      }
      
      return await response.json();
    } catch (error) {
      console.error('خطأ في توليد الباليت بالذكاء الاصطناعي:', error);
      throw error;
    }
  }

  // Apply palette to document
  applyPalette(palette: ColorPalette): void {
    const root = document.documentElement;
    
    // Apply all CSS variables
    Object.entries(palette.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Apply main colors
    root.style.setProperty('--primary', this.hslToString(palette.colors.primary));
    root.style.setProperty('--secondary', this.hslToString(palette.colors.secondary));
    root.style.setProperty('--accent', this.hslToString(palette.colors.accent));
    root.style.setProperty('--background', this.hslToString(palette.colors.background));
    root.style.setProperty('--surface', this.hslToString(palette.colors.surface));
    root.style.setProperty('--foreground', this.hslToString(palette.colors.text));
    root.style.setProperty('--muted-foreground', this.hslToString(palette.colors.textSecondary));
    root.style.setProperty('--border', this.hslToString(palette.colors.border));
    root.style.setProperty('--success', this.hslToString(palette.colors.success));
    root.style.setProperty('--warning', this.hslToString(palette.colors.warning));
    root.style.setProperty('--destructive', this.hslToString(palette.colors.error));
    root.style.setProperty('--info', this.hslToString(palette.colors.info));

    // Store in localStorage for persistence
    localStorage.setItem('active-palette', JSON.stringify(palette));
  }

  // Convert hex to HSL string format for CSS variables
  private hslToString(color: string): string {
    if (color.includes('%')) {
      // Already in HSL format
      return color.replace(/hsl\(|\)/g, '');
    }
    
    // Convert hex to HSL
    const hsl = this.hexToHsl(color);
    return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
  }

  // Convert hex to HSL
  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  // Get default palettes
  private getDefaultPalettes(): ColorPalette[] {
    return [
      {
        id: 'clean-light',
        name: 'Clean Light',
        nameAr: 'نظيف فاتح',
        description: 'Clean and professional light theme for cleaning services',
        descriptionAr: 'ثيم فاتح نظيف ومهني لخدمات التنظيف',
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
      {
        id: 'clean-dark',
        name: 'Clean Dark',
        nameAr: 'نظيف داكن',
        description: 'Modern dark theme with professional cleaning aesthetics',
        descriptionAr: 'ثيم داكن عصري بجماليات تنظيف مهنية',
        category: 'business',
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#06b6d4',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          textSecondary: '#94a3b8',
          border: '#334155',
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#06b6d4',
        },
        cssVariables: {
          '--radius': '0.5rem',
          '--brand-50': '220 14% 10%',
          '--brand-500': '217 91% 60%',
          '--brand-600': '217 91% 52%',
        },
        isActive: false,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];
  }
}

export const colorPaletteService = new ColorPaletteService();
