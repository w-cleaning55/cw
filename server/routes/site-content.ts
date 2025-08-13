import { RequestHandler } from "express";
import { dataManager } from "../utils/dataManager";

interface SiteContent {
  heroSection: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    description: string;
    descriptionAr: string;
    ctaText: string;
    ctaTextAr: string;
  };
  featuredSection: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
  };
  whyChooseUs: {
    title: string;
    titleAr: string;
    subtitle: string;
    subtitleAr: string;
    features: Array<{
      title: string;
      titleAr: string;
      description: string;
      descriptionAr: string;
      icon: string;
    }>;
  };
  contactCta: {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    buttons: {
      call: {
        text: string;
        textAr: string;
      };
      message: {
        text: string;
        textAr: string;
      };
    };
  };
  metadata: {
    version: string;
    lastModified: string;
    modifiedBy: string;
  };
}

// Get site content
export const handleGetSiteContent: RequestHandler = async (req, res) => {
  try {
    const contentData = await dataManager.readData('site-content');
    
    if (!contentData || !contentData.content) {
      // Return default site content if not found
      const defaultContent: SiteContent = {
        heroSection: {
          title: 'Professional Cleaning Services',
          titleAr: 'خدمات التنظيف المهنية',
          subtitle: 'Your trusted partner for all cleaning needs',
          subtitleAr: 'شريكك الموثوق لجميع احتياجات التنظيف',
          description: 'We provide professional cleaning services using the latest American and European equipment with over 6 years of experience in the Saudi market',
          descriptionAr: 'نقدم خدمات تنظيف مهنية باستخدام أحدث المعدات الأمريكية والأوروبية مع أكثر من 6 سنوات من الخبرة في السوق السعودي',
          ctaText: 'Get Free Quote',
          ctaTextAr: 'احصل على عرض مجاني'
        },
        featuredSection: {
          title: 'Our Featured Services',
          titleAr: 'خدماتنا المميزة',
          subtitle: 'Professional cleaning solutions for all your needs',
          subtitleAr: 'حلول تنظيف مهنية لجميع احتياجاتك'
        },
        whyChooseUs: {
          title: 'Why Choose Us?',
          titleAr: 'لماذا تختارنا؟',
          subtitle: 'We provide professional cleaning services with the highest quality standards',
          subtitleAr: 'نقدم خدمات تنظيف احترافية بأعلى معايير الجودة',
          features: [
            {
              title: 'American & European Equipment',
              titleAr: 'معدات أمريكية وأوروبية',
              description: 'We use the latest advanced equipment and technologies',
              descriptionAr: 'نستخدم أحدث المعدات والتقنيات المتطورة',
              icon: 'Award'
            },
            {
              title: 'Qualified Professional Team',
              titleAr: 'فريق محترف مؤهل',
              description: 'Highly experienced technicians trained on latest techniques',
              descriptionAr: 'فنيون ذوو خبرة عالية ومدربون على أحدث التقنيات',
              icon: 'Users'
            },
            {
              title: 'Fast & Reliable Service',
              titleAr: 'خدمة سريعة وموثوقة',
              description: 'We guarantee timely completion with highest quality',
              descriptionAr: 'نضمن إنجاز العمل في الوقت المحدد بأعلى جودة',
              icon: 'Zap'
            }
          ]
        },
        contactCta: {
          title: 'Need a Free Consultation?',
          titleAr: 'هل تحتاج استشارة مجانية؟',
          description: 'Contact us today for a free consultation and customized quote for your needs',
          descriptionAr: 'تواصل معنا اليوم للحصول على استشارة مجانية وعرض أسعار مخصص لاحتياجاتك',
          buttons: {
            call: {
              text: 'Call Us',
              textAr: 'اتصل بنا'
            },
            message: {
              text: 'Send Message',
              textAr: 'أرسل رسالة'
            }
          }
        },
        metadata: {
          version: '1.0',
          lastModified: new Date().toISOString(),
          modifiedBy: 'system'
        }
      };

      res.json(defaultContent);
      return;
    }

    res.json(contentData.content);
  } catch (error) {
    console.error('Error fetching site content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch site content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update site content
export const handleUpdateSiteContent: RequestHandler = async (req, res) => {
  try {
    const updatedContent: SiteContent = {
      ...req.body,
      metadata: {
        ...req.body.metadata,
        lastModified: new Date().toISOString(),
        modifiedBy: 'admin' // In a real app, this would be the authenticated user
      }
    };

    // Validate required fields
    const requiredSections = ['heroSection', 'featuredSection', 'whyChooseUs', 'contactCta'];
    for (const section of requiredSections) {
      if (!updatedContent[section as keyof SiteContent]) {
        return res.status(400).json({ 
          error: `Missing required section: ${section}` 
        });
      }
    }

    // Validate hero section
    const heroRequired = ['title', 'titleAr', 'subtitle', 'subtitleAr'];
    for (const field of heroRequired) {
      if (!updatedContent.heroSection[field as keyof typeof updatedContent.heroSection]) {
        return res.status(400).json({ 
          error: `Missing required hero section field: ${field}` 
        });
      }
    }

    // Validate why choose us features
    if (!Array.isArray(updatedContent.whyChooseUs.features) || updatedContent.whyChooseUs.features.length === 0) {
      return res.status(400).json({ 
        error: 'Why choose us section must have at least one feature' 
      });
    }

    // Save site content
    const contentData = {
      content: updatedContent,
      metadata: {
        version: updatedContent.metadata.version || '1.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'admin'
      }
    };

    await dataManager.writeData('site-content', contentData);

    res.json({ 
      success: true, 
      message: 'Site content updated successfully',
      content: updatedContent 
    });
  } catch (error) {
    console.error('Error updating site content:', error);
    res.status(500).json({ 
      error: 'Failed to update site content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get specific section content
export const handleGetSectionContent: RequestHandler = async (req, res) => {
  try {
    const { section } = req.params;
    const contentData = await dataManager.readData('site-content');
    
    if (!contentData || !contentData.content) {
      return res.status(404).json({ error: 'Site content not found' });
    }

    const sectionContent = contentData.content[section as keyof typeof contentData.content];
    
    if (!sectionContent) {
      return res.status(404).json({ error: `Section '${section}' not found` });
    }

    res.json(sectionContent);
  } catch (error) {
    console.error('Error fetching section content:', error);
    res.status(500).json({ 
      error: 'Failed to fetch section content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update specific section content
export const handleUpdateSectionContent: RequestHandler = async (req, res) => {
  try {
    const { section } = req.params;
    const sectionData = req.body;
    
    const contentData = await dataManager.readData('site-content');
    
    if (!contentData || !contentData.content) {
      return res.status(404).json({ error: 'Site content not found' });
    }

    // Update the specific section
    const updatedContent = {
      ...contentData.content,
      [section]: sectionData,
      metadata: {
        ...contentData.content.metadata,
        lastModified: new Date().toISOString(),
        modifiedBy: 'admin'
      }
    };

    const newContentData = {
      content: updatedContent,
      metadata: {
        ...contentData.metadata,
        lastModified: new Date().toISOString()
      }
    };

    await dataManager.writeData('site-content', newContentData);

    res.json({ 
      success: true, 
      message: `Section '${section}' updated successfully`,
      section: sectionData 
    });
  } catch (error) {
    console.error('Error updating section content:', error);
    res.status(500).json({ 
      error: 'Failed to update section content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
