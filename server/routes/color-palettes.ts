import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { dataManager } from '../utils/dataManager';

const router = Router();

// Schema validation for color palette
const ColorPaletteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
  category: z.enum(['business', 'creative', 'nature', 'tech', 'custom']),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
    surface: z.string(),
    text: z.string(),
    textSecondary: z.string(),
    border: z.string(),
    success: z.string(),
    warning: z.string(),
    error: z.string(),
    info: z.string(),
  }),
  cssVariables: z.record(z.string()),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Get all color palettes
router.get('/', async (req: Request, res: Response) => {
  try {
    const palettes = await dataManager.readData('color-palettes') || getDefaultPalettes();
    res.json(palettes);
  } catch (error) {
    console.error('Error fetching color palettes:', error);
    res.status(500).json({ error: 'فشل في تحميل الباليتات' });
  }
});

// Get active palette
router.get('/active', async (req: Request, res: Response) => {
  try {
    const palettes = await dataManager.readData('color-palettes') || getDefaultPalettes();
    const activePalette = palettes.find((p: any) => p.isActive) || palettes[0];
    res.json(activePalette);
  } catch (error) {
    console.error('Error fetching active palette:', error);
    res.status(500).json({ error: 'فشل في تحميل الباليت النشط' });
  }
});

// Get palette by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const palettes = await dataManager.readData('color-palettes') || getDefaultPalettes();
    const palette = palettes.find((p: any) => p.id === id);
    
    if (!palette) {
      return res.status(404).json({ error: 'الباليت غير موجود' });
    }
    
    res.json(palette);
  } catch (error) {
    console.error('Error fetching palette:', error);
    res.status(500).json({ error: 'فشل في تحميل الباليت' });
  }
});

// Create new palette
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = ColorPaletteSchema.parse(req.body);
    
    const palettes = await dataManager.readData('color-palettes') || getDefaultPalettes();

    const newPalette = {
      id: `palette-${Date.now()}`,
      ...validatedData,
      isActive: validatedData.isActive || false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If this palette is set as active, deactivate others
    if (newPalette.isActive) {
      palettes.forEach((p: any) => p.isActive = false);
    }

    palettes.push(newPalette);
    await dataManager.writeData('color-palettes', palettes);
    
    res.status(201).json(newPalette);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'بيانات غير صحيحة', details: error.errors });
    }
    console.error('Error creating palette:', error);
    res.status(500).json({ error: 'فشل في إنشاء الباليت' });
  }
});

// Update palette
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const palettes = await dataManager.readData('color-palettes') || getDefaultPalettes();
    const paletteIndex = palettes.findIndex((p: any) => p.id === id);

    if (paletteIndex === -1) {
      return res.status(404).json({ error: 'الباليت غير موجود' });
    }

    const updateData = req.body;

    // If this palette is set as active, deactivate others
    if (updateData.isActive) {
      palettes.forEach((p: any) => p.isActive = false);
    }

    const updatedPalette = {
      ...palettes[paletteIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    palettes[paletteIndex] = updatedPalette;
    await dataManager.writeData('color-palettes', palettes);
    
    res.json(updatedPalette);
  } catch (error) {
    console.error('Error updating palette:', error);
    res.status(500).json({ error: 'فشل في تحديث الباليت' });
  }
});

// Delete palette
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const palettes = await dataManager.readData('color-palettes') || getDefaultPalettes();

    const palette = palettes.find((p: any) => p.id === id);
    if (!palette) {
      return res.status(404).json({ error: 'الباليت غير موجود' });
    }

    // Prevent deletion of default palettes
    if (palette.isDefault) {
      return res.status(400).json({ error: 'لا يمكن حذف الباليتات الافتراضية' });
    }

    const filteredPalettes = palettes.filter((p: any) => p.id !== id);

    // If deleted palette was active, activate the first default one
    if (palette.isActive) {
      const defaultPalette = filteredPalettes.find((p: any) => p.isDefault);
      if (defaultPalette) {
        defaultPalette.isActive = true;
      }
    }

    await dataManager.writeData('color-palettes', filteredPalettes);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting palette:', error);
    res.status(500).json({ error: 'فشل في حذف الباليت' });
  }
});

// Activate palette
router.post('/:id/activate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const palettes = await dataManager.readData('color-palettes') || getDefaultPalettes();

    const palette = palettes.find((p: any) => p.id === id);
    if (!palette) {
      return res.status(404).json({ error: 'الباليت غير موجود' });
    }

    // Deactivate all palettes and activate the selected one
    palettes.forEach((p: any) => {
      p.isActive = p.id === id;
      if (p.id === id) {
        p.updatedAt = new Date().toISOString();
      }
    });

    await dataManager.writeData('color-palettes', palettes);
    res.json({ message: 'تم تفعيل الباليت بنجاح' });
  } catch (error) {
    console.error('Error activating palette:', error);
    res.status(500).json({ error: 'فشل في تفعيل الباليت' });
  }
});

// Generate palette using AI
router.post('/generate-ai', async (req: Request, res: Response) => {
  try {
    const { prompt, category } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'الوصف مطلوب' });
    }
    
    // Here we would integrate with AI service to generate colors
    // For now, we'll return a mock generated palette
    const generatedPalette = await generateAIPalette(prompt, category);
    
    res.json(generatedPalette);
  } catch (error) {
    console.error('Error generating AI palette:', error);
    res.status(500).json({ error: 'فشل في توليد الباليت بالذكاء الاصطناعي' });
  }
});

// Generate palette from image
router.post('/generate-from-image', async (req: Request, res: Response) => {
  try {
    // This would typically process an uploaded image
    // For now, return a mock palette
    const imagePalette = {
      id: `generated-${Date.now()}`,
      name: 'Generated from Image',
      nameAr: 'مولد من صورة',
      description: 'Color palette extracted from uploaded image',
      descriptionAr: 'باليت ألوان مستخرج من الصورة المرفوعة',
      category: 'custom' as const,
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#06b6d4',
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
      isActive: false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    res.json(imagePalette);
  } catch (error) {
    console.error('Error generating palette from image:', error);
    res.status(500).json({ error: 'فشل في توليد الباليت من الصورة' });
  }
});

// Helper function to generate AI palette
async function generateAIPalette(prompt: string, category: string) {
  // This would integrate with your AI service
  // For now, return a mock palette based on the prompt
  const baseColors = {
    business: { primary: '#2563eb', accent: '#0ea5e9' },
    creative: { primary: '#7c3aed', accent: '#a855f7' },
    nature: { primary: '#16a34a', accent: '#22c55e' },
    tech: { primary: '#0891b2', accent: '#06b6d4' },
    custom: { primary: '#6366f1', accent: '#8b5cf6' }
  };
  
  const colors = baseColors[category as keyof typeof baseColors] || baseColors.custom;
  
  return {
    id: `ai-generated-${Date.now()}`,
    name: `AI Generated: ${prompt.slice(0, 20)}...`,
    nameAr: `مولد بالذكاء الاصطناعي: ${prompt.slice(0, 20)}...`,
    description: `AI-generated palette based on: ${prompt}`,
    descriptionAr: `باليت مولد بالذكاء الاصطناعي بناءً على: ${prompt}`,
    category: category as any,
    colors: {
      primary: colors.primary,
      secondary: '#64748b',
      accent: colors.accent,
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
      '--brand-500': colors.primary.replace('#', ''),
      '--brand-600': colors.primary.replace('#', ''),
    },
    isActive: false,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Default palettes
function getDefaultPalettes() {
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
    },
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      nameAr: 'أزرق المحيط',
      description: 'Fresh ocean-inspired blue palette for cleaning excellence',
      descriptionAr: 'باليت أزرق مستوحى من المحيط للتميز في التنظيف',
      category: 'nature',
      colors: {
        primary: '#0ea5e9',
        secondary: '#0284c7',
        accent: '#38bdf8',
        background: '#f0f9ff',
        surface: '#e0f2fe',
        text: '#0c4a6e',
        textSecondary: '#0369a1',
        border: '#bae6fd',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
        info: '#0ea5e9',
      },
      cssVariables: {
        '--radius': '0.5rem',
        '--brand-50': '217 100% 97%',
        '--brand-500': '199 89% 48%',
        '--brand-600': '199 89% 40%',
      },
      isActive: false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'fresh-green',
      name: 'Fresh Green',
      nameAr: 'أخضر طازج',
      description: 'Natural green palette representing cleanliness and freshness',
      descriptionAr: 'باليت أخضر طبيعي يمثل النظافة والانتعاش',
      category: 'nature',
      colors: {
        primary: '#16a34a',
        secondary: '#15803d',
        accent: '#22c55e',
        background: '#f0fdf4',
        surface: '#dcfce7',
        text: '#14532d',
        textSecondary: '#166534',
        border: '#bbf7d0',
        success: '#16a34a',
        warning: '#ca8a04',
        error: '#dc2626',
        info: '#0ea5e9',
      },
      cssVariables: {
        '--radius': '0.5rem',
        '--brand-50': '142 100% 97%',
        '--brand-500': '142 76% 36%',
        '--brand-600': '142 76% 28%',
      },
      isActive: false,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
}

export default router;
