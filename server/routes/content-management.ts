import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { dataManager } from '../utils/dataManager';

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'content');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `content-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم'));
    }
  }
});

// Content management schemas
const HeroSettingsSchema = z.object({
  title: z.string(),
  titleAr: z.string(),
  subtitle: z.string(),
  subtitleAr: z.string(),
  description: z.string(),
  descriptionAr: z.string(),
  backgroundImage: z.string().optional(),
  videoBackground: z.string().optional(),
  overlayOpacity: z.number().min(0).max(1),
  animationSpeed: z.number().min(0.1).max(5),
  ctaPrimary: z.string(),
  ctaPrimaryAr: z.string(),
  ctaSecondary: z.string(),
  ctaSecondaryAr: z.string(),
  showStats: z.boolean(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string(),
    labelAr: z.string(),
    icon: z.string()
  }))
});

const ServiceSettingsSchema = z.object({
  title: z.string(),
  titleAr: z.string(),
  description: z.string(),
  descriptionAr: z.string(),
  showPricing: z.boolean(),
  showRating: z.boolean(),
  showBookingButton: z.boolean(),
  imageUploadEnabled: z.boolean(),
  iconUploadEnabled: z.boolean(),
  services: z.array(z.object({
    id: z.string(),
    name: z.string(),
    nameAr: z.string(),
    description: z.string(),
    descriptionAr: z.string(),
    price: z.number().optional(),
    currency: z.string().optional(),
    image: z.string().optional(),
    icon: z.string().optional(),
    isActive: z.boolean(),
    rating: z.number().optional(),
    reviewCount: z.number().optional(),
    features: z.array(z.string()).optional(),
    featuresAr: z.array(z.string()).optional()
  }))
});

const ReviewSettingsSchema = z.object({
  title: z.string(),
  titleAr: z.string(),
  showPhotos: z.boolean(),
  showRating: z.boolean(),
  showDate: z.boolean(),
  autoplay: z.boolean(),
  slidesPerView: z.number().min(1).max(5),
  animationDuration: z.number().min(1000).max(10000),
  reviews: z.array(z.object({
    id: z.string(),
    name: z.string(),
    nameAr: z.string(),
    text: z.string(),
    textAr: z.string(),
    rating: z.number().min(1).max(5),
    date: z.string(),
    photo: z.string().optional(),
    serviceUsed: z.string().optional(),
    verified: z.boolean()
  }))
});

const AboutSettingsSchema = z.object({
  title: z.string(),
  titleAr: z.string(),
  description: z.string(),
  descriptionAr: z.string(),
  mainImage: z.string().optional(),
  galleryImages: z.array(z.string()),
  showExperience: z.boolean(),
  experienceYears: z.number(),
  showTeamSize: z.boolean(),
  teamSize: z.number(),
  showCertifications: z.boolean(),
  certifications: z.array(z.object({
    name: z.string(),
    nameAr: z.string(),
    image: z.string(),
    issuer: z.string(),
    date: z.string()
  })),
  values: z.array(z.object({
    title: z.string(),
    titleAr: z.string(),
    description: z.string(),
    descriptionAr: z.string(),
    icon: z.string()
  }))
});

const CTASettingsSchema = z.object({
  title: z.string(),
  titleAr: z.string(),
  description: z.string(),
  descriptionAr: z.string(),
  backgroundType: z.enum(['gradient', 'image', 'video']),
  backgroundImage: z.string().optional(),
  backgroundVideo: z.string().optional(),
  overlayColor: z.string(),
  overlayOpacity: z.number().min(0).max(1),
  showPhone: z.boolean(),
  phoneNumber: z.string().optional(),
  showWhatsApp: z.boolean(),
  whatsappNumber: z.string().optional(),
  showEmail: z.boolean(),
  email: z.string().email().optional(),
  showDiscount: z.boolean(),
  discountPercentage: z.number().min(0).max(100).optional(),
  discountText: z.string().optional(),
  discountTextAr: z.string().optional()
});

const FooterSettingsSchema = z.object({
  companyDescription: z.string(),
  companyDescriptionAr: z.string(),
  showSocialLinks: z.boolean(),
  showNewsletter: z.boolean(),
  showQuickLinks: z.boolean(),
  showContact: z.boolean(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url(),
    icon: z.string()
  })),
  quickLinks: z.array(z.object({
    title: z.string(),
    titleAr: z.string(),
    url: z.string()
  })),
  contactInfo: z.object({
    address: z.string(),
    addressAr: z.string(),
    phone: z.string(),
    email: z.string().email(),
    workingHours: z.string(),
    workingHoursAr: z.string()
  }),
  newsletterTitle: z.string(),
  newsletterTitleAr: z.string(),
  newsletterDescription: z.string(),
  newsletterDescriptionAr: z.string()
});

const ComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameAr: z.string(),
  isEnabled: z.boolean(),
  order: z.number(),
  settings: z.record(z.any()),
  content: z.record(z.any())
});

const ContentManagementSchema = z.object({
  components: z.array(ComponentSchema),
  heroSettings: HeroSettingsSchema.optional(),
  serviceSettings: ServiceSettingsSchema.optional(),
  reviewSettings: ReviewSettingsSchema.optional(),
  aboutSettings: AboutSettingsSchema.optional(),
  ctaSettings: CTASettingsSchema.optional(),
  footerSettings: FooterSettingsSchema.optional()
});

// Get content management settings
router.get('/', async (req, res) => {
  try {
    const contentSettings = await dataManager.readData('content-settings');
    
    // Default settings if none exist
    const defaultSettings = {
      components: [
        {
          id: 'hero',
          name: 'Hero Section',
          nameAr: 'القسم الرئيسي',
          isEnabled: true,
          order: 1,
          settings: {},
          content: {}
        },
        {
          id: 'about',
          name: 'About Section',
          nameAr: 'قسم من نحن',
          isEnabled: true,
          order: 2,
          settings: {},
          content: {}
        },
        {
          id: 'services',
          name: 'Services Section',
          nameAr: 'قسم الخدمات',
          isEnabled: true,
          order: 3,
          settings: {},
          content: {}
        },
        {
          id: 'reviews',
          name: 'Reviews Section',
          nameAr: 'قسم الآراء',
          isEnabled: true,
          order: 4,
          settings: {},
          content: {}
        },
        {
          id: 'cta',
          name: 'Call to Action',
          nameAr: 'دعوة للعمل',
          isEnabled: true,
          order: 5,
          settings: {},
          content: {}
        },
        {
          id: 'footer',
          name: 'Footer',
          nameAr: 'التذييل',
          isEnabled: true,
          order: 6,
          settings: {},
          content: {}
        }
      ],
      heroSettings: {
        title: 'الحل الأمثل لخدمات التنظيف',
        titleAr: 'الحل الأمثل لخدمات التنظيف',
        subtitle: 'نظافة احترافية تفوق التوقعات',
        subtitleAr: 'نظافة احترافية تفوق التوقعات',
        description: 'نقدم خدمات تنظيف متكاملة باستخدام أحدث التقنيات والمعدات المتطورة مع فريق مدرب على أعلى مستوى',
        descriptionAr: 'نقدم خدمات تنظيف متكاملة باستخدام أحدث التقنيات والمعدات المتطورة مع فريق مدرب على أعلى مستوى',
        backgroundImage: '',
        videoBackground: '',
        overlayOpacity: 0.7,
        animationSpeed: 1,
        ctaPrimary: 'احجز الآن',
        ctaPrimaryAr: 'احجز الآن',
        ctaSecondary: 'اعرف المزيد',
        ctaSecondaryAr: 'اعرف المزيد',
        showStats: true,
        stats: [
          { value: '2000+', label: 'عميل راضٍ', labelAr: 'عميل راضٍ', icon: 'users' },
          { value: '500+', label: 'مشروع مكتمل', labelAr: 'مشروع مكتمل', icon: 'award' },
          { value: '10+', label: 'سنوات خبرة', labelAr: 'سنوات خبرة', icon: 'star' },
          { value: '24/7', label: 'دعم متواصل', labelAr: 'دعم متواصل', icon: 'clock' }
        ]
      },
      serviceSettings: {
        title: 'خدماتنا المتخصصة',
        titleAr: 'خدماتنا المتخصصة',
        description: 'نقدم مجموعة شاملة من خدمات التنظيف المتخصصة',
        descriptionAr: 'نقدم مجموعة شاملة من خدمات التنظيف المتخصصة',
        showPricing: true,
        showRating: true,
        showBookingButton: true,
        imageUploadEnabled: true,
        iconUploadEnabled: true,
        services: []
      },
      reviewSettings: {
        title: 'آراء عملائنا',
        titleAr: 'آراء عملائنا',
        showPhotos: true,
        showRating: true,
        showDate: true,
        autoplay: true,
        slidesPerView: 3,
        animationDuration: 5000,
        reviews: []
      },
      aboutSettings: {
        title: 'من نحن',
        titleAr: 'من نحن',
        description: 'شركة رائدة في مجال خدمات التنظيف',
        descriptionAr: 'شركة رائدة في مجال خدمات التنظيف',
        mainImage: '',
        galleryImages: [],
        showExperience: true,
        experienceYears: 10,
        showTeamSize: true,
        teamSize: 50,
        showCertifications: true,
        certifications: [],
        values: []
      },
      ctaSettings: {
        title: 'احصل على خدمة تنظيف احترافية اليوم',
        titleAr: 'احصل على خدمة تنظيف احترافية اليوم',
        description: 'اتصل بنا الآن للحصول على استشارة مجانية وعرض سعر مخصص',
        descriptionAr: 'اتصل بنا الآن للحصول على استشارة مجانية وعرض سعر مخصص',
        backgroundType: 'gradient' as const,
        backgroundImage: '',
        backgroundVideo: '',
        overlayColor: '#000000',
        overlayOpacity: 0.5,
        showPhone: true,
        phoneNumber: '+966501234567',
        showWhatsApp: true,
        whatsappNumber: '+966501234567',
        showEmail: true,
        email: 'info@cleaningworld.sa',
        showDiscount: true,
        discountPercentage: 20,
        discountText: 'خصم خاص للعملاء الجدد',
        discountTextAr: 'خصم خاص للعملاء الجدد'
      },
      footerSettings: {
        companyDescription: 'شركة تنظيف عالمي - الحل الأمثل لجميع احتياجات التنظيف',
        companyDescriptionAr: 'شركة تنظيف عالمي - الحل الأمثل لجميع احتياجات التنظيف',
        showSocialLinks: true,
        showNewsletter: true,
        showQuickLinks: true,
        showContact: true,
        socialLinks: [
          { platform: 'facebook', url: 'https://facebook.com', icon: 'facebook' },
          { platform: 'twitter', url: 'https://twitter.com', icon: 'twitter' },
          { platform: 'instagram', url: 'https://instagram.com', icon: 'instagram' },
          { platform: 'linkedin', url: 'https://linkedin.com', icon: 'linkedin' }
        ],
        quickLinks: [
          { title: 'الخدمات', titleAr: 'الخدمات', url: '/services' },
          { title: 'من نحن', titleAr: 'من نحن', url: '/about' },
          { title: 'اتصل بنا', titleAr: 'اتصل بنا', url: '/contact' },
          { title: 'الأسئلة الشائعة', titleAr: 'الأسئلة الشائعة', url: '/faq' }
        ],
        contactInfo: {
          address: 'الرياض، المملكة العربية السعودية',
          addressAr: 'الرياض، المملكة العربية السعودية',
          phone: '+966501234567',
          email: 'info@cleaningworld.sa',
          workingHours: 'الأحد - الخميس: 8:00 ص - 6:00 م',
          workingHoursAr: 'الأحد - الخميس: 8:00 ص - 6:00 م'
        },
        newsletterTitle: 'اشترك في نشرتنا الإخبارية',
        newsletterTitleAr: 'اشترك في نشرتنا الإخبارية',
        newsletterDescription: 'احصل على آخر العروض والأخبار',
        newsletterDescriptionAr: 'احصل على آخر العروض والأخبار'
      }
    };

    const settings = contentSettings || defaultSettings;
    res.json(settings);
  } catch (error) {
    console.error('خطأ في جلب إعدادات المحتوى:', error);
    res.status(500).json({ error: 'فشل في جلب إعدادات المحتوى' });
  }
});

// Save content management settings
router.post('/', async (req, res) => {
  try {
    const validatedData = ContentManagementSchema.parse(req.body);
    
    const settings = {
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    await dataManager.writeData('content-settings', settings);
    
    res.json({
      success: true,
      message: 'تم حفظ إعدادات المحتوى بنجاح',
      data: settings
    });
  } catch (error) {
    console.error('خطأ في حفظ إعدادات المحتوى:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'بيانات غير صحيحة',
        details: error.errors
      });
    }
    
    res.status(500).json({ error: 'فشل في حفظ إعدادات المحتوى' });
  }
});

// Upload image for content
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم اختيار ملف' });
    }

    const imageUrl = `/uploads/content/${req.file.filename}`;
    
    // Optional: Store image metadata
    const imageMetadata = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: imageUrl,
      uploadedAt: new Date().toISOString(),
      type: req.body.type || 'general',
      index: req.body.index ? parseInt(req.body.index) : undefined
    };

    // Store metadata in images database
    const existingImages = await dataManager.readData('content-images') || [];
    existingImages.push(imageMetadata);
    await dataManager.writeData('content-images', existingImages);

    res.json({
      success: true,
      imageUrl,
      metadata: imageMetadata
    });
  } catch (error) {
    console.error('خطأ في رفع الصورة:', error);
    res.status(500).json({ error: 'فشل في رفع الصورة' });
  }
});

// Get uploaded images
router.get('/images', async (req, res) => {
  try {
    const images = await dataManager.readData('content-images') || [];
    const { type, limit, offset } = req.query;

    let filteredImages = images;
    
    if (type) {
      filteredImages = images.filter((img: any) => img.type === type);
    }

    if (limit) {
      const limitNum = parseInt(limit as string);
      const offsetNum = parseInt(offset as string) || 0;
      filteredImages = filteredImages.slice(offsetNum, offsetNum + limitNum);
    }

    res.json({
      images: filteredImages,
      total: images.length,
      filtered: filteredImages.length
    });
  } catch (error) {
    console.error('خطأ في جلب الصور:', error);
    res.status(500).json({ error: 'فشل في جلب الصور' });
  }
});

// Delete image
router.delete('/images/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    
    // Remove from database
    const images = await dataManager.readData('content-images') || [];
    const updatedImages = images.filter((img: any) => img.filename !== filename);
    await dataManager.writeData('content-images', updatedImages);

    // Remove physical file
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'content', filename);
    try {
      await fs.unlink(filePath);
    } catch (fileError) {
      console.warn('تعذر حذف الملف:', fileError);
    }

    res.json({
      success: true,
      message: 'تم حذف الصورة بنجاح'
    });
  } catch (error) {
    console.error('خطأ في حذف الصورة:', error);
    res.status(500).json({ error: 'فشل في حذف الصورة' });
  }
});

// Get component by ID
router.get('/components/:componentId', async (req, res) => {
  try {
    const { componentId } = req.params;
    const settings = await dataManager.readData('content-settings');
    
    if (!settings || !settings.components) {
      return res.status(404).json({ error: 'المكون غير موجود' });
    }

    const component = settings.components.find((c: any) => c.id === componentId);
    
    if (!component) {
      return res.status(404).json({ error: 'المكون غير موجود' });
    }

    // Include component-specific settings
    const componentSettings = settings[`${componentId}Settings`];
    
    res.json({
      component,
      settings: componentSettings
    });
  } catch (error) {
    console.error('خطأ في جلب المكون:', error);
    res.status(500).json({ error: 'فشل في جلب المكون' });
  }
});

// Update component settings
router.put('/components/:componentId', async (req, res) => {
  try {
    const { componentId } = req.params;
    const updateData = req.body;
    
    const settings = await dataManager.readData('content-settings') || {};
    
    // Update component in components array
    if (settings.components) {
      const componentIndex = settings.components.findIndex((c: any) => c.id === componentId);
      if (componentIndex >= 0) {
        settings.components[componentIndex] = {
          ...settings.components[componentIndex],
          ...updateData.component
        };
      }
    }

    // Update component-specific settings
    if (updateData.settings) {
      settings[`${componentId}Settings`] = updateData.settings;
    }

    settings.updatedAt = new Date().toISOString();
    
    await dataManager.writeData('content-settings', settings);
    
    res.json({
      success: true,
      message: 'تم تحديث المكون بنجاح',
      component: settings.components?.find((c: any) => c.id === componentId),
      settings: settings[`${componentId}Settings`]
    });
  } catch (error) {
    console.error('خطأ في تحديث المكون:', error);
    res.status(500).json({ error: 'فشل في تحديث المكون' });
  }
});

export default router;
