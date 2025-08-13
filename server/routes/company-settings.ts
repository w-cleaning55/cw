import { RequestHandler } from "express";
import { dataManager } from "../utils/dataManager";

interface CompanyInfo {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  tagline: string;
  taglineAr: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  addressAr: string;
  logo: string;
  favicon: string;
  foundedYear: number;
  employeesCount: number;
  projectsCompleted: number;
  satisfactionRate: number;
  businessHours: {
    weekdays: string;
    weekdaysAr: string;
    weekends: string;
    weekendsAr: string;
  };
  socialMedia: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    whatsapp: string;
  };
  services: {
    mainCategory: string;
    mainCategoryAr: string;
    specialties: string[];
    specialtiesAr: string[];
  };
  certifications: string[];
  certificationsAr: string[];
  updatedAt: string;
}

// Get company settings
export const handleGetCompanySettings: RequestHandler = async (req, res) => {
  try {
    const companyData = await dataManager.readData('company-settings');
    
    if (!companyData || !companyData.company) {
      // Return default company information if not found
      const defaultCompany: CompanyInfo = {
        id: 'company-1',
        name: 'Cleaning World',
        nameAr: 'عالم النظافة',
        description: 'Professional cleaning company using the latest American and European equipment with over 6 years of experience in the Saudi market',
        descriptionAr: 'شركة تنظيف احترافية تستخدم أحدث المعدات الأمريكية والأوروبية مع أكثر من 6 سنوات من الخبرة في السوق السعودي',
        tagline: 'Your trusted partner for professional cleaning services',
        taglineAr: 'شريكك الموثوق لخدمات التنظيف المهنية',
        website: 'https://m-clean.net',
        phone: '+966 50 123 4567',
        email: 'info@m-clean.net',
        address: 'Riyadh, Saudi Arabia',
        addressAr: 'الرياض، المملكة العربية السعودية',
        logo: '/logo.png',
        favicon: '/favicon.ico',
        foundedYear: 2018,
        employeesCount: 50,
        projectsCompleted: 2500,
        satisfactionRate: 98,
        businessHours: {
          weekdays: 'Saturday - Thursday: 8:00 AM - 8:00 PM',
          weekdaysAr: 'السبت - الخميس: 8:00 ص - 8:00 م',
          weekends: 'Friday: 2:00 PM - 8:00 PM',
          weekendsAr: 'الجمعة: 2:00 م - 8:00 م'
        },
        socialMedia: {
          twitter: '@cleaningworld_sa',
          facebook: 'CleaningWorldSA',
          instagram: '@cleaningworld.sa',
          linkedin: 'cleaning-world-sa',
          whatsapp: '+966501234567'
        },
        services: {
          mainCategory: 'Cleaning & Maintenance Services',
          mainCategoryAr: 'خدمات التنظيف والصيانة',
          specialties: [
            'Carpet & Upholstery Cleaning',
            'Floor Care & Marble Polishing',
            'Water Tank Cleaning',
            'Commercial Facility Cleaning',
            'Deep Sterilization Services',
            'Pest Control Services'
          ],
          specialtiesAr: [
            'تنظيف السجاد والمفروشات',
            'العناية بالأرضيات وجلي الرخام',
            'تنظيف خزانات المياه',
            'تنظيف المنشآت التجارية',
            'خدمات التعقيم العميق',
            'خدمات مكافحة الآفات'
          ]
        },
        certifications: [
          'ISO 9001:2015 Quality Management System',
          'HACCP Food Safety Standards Certification',
          'Green Cleaning & Environmental Certification',
          'Saudi Ministry of Health Approved',
          'Municipal License for Cleaning Services'
        ],
        certificationsAr: [
          'شهادة نظام إدارة الجودة ISO 9001:2015',
          'شهادة معايير سلامة الغذاء HACCP',
          'شهادة التنظيف البيئي والصديق للبيئة',
          'معتمد من وزارة الصحة السعودية',
          'ترخيص بلدي لخدمات التنظيف'
        ],
        updatedAt: new Date().toISOString()
      };

      res.json(defaultCompany);
      return;
    }

    res.json(companyData.company);
  } catch (error) {
    console.error('Error fetching company settings:', error);
    res.status(500).json({ 
      error: 'Failed to fetch company settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update company settings
export const handleUpdateCompanySettings: RequestHandler = async (req, res) => {
  try {
    const updatedCompany: CompanyInfo = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    // Validate required fields
    const requiredFields = ['id', 'name', 'nameAr', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!updatedCompany[field as keyof CompanyInfo]) {
        return res.status(400).json({ 
          error: `Missing required field: ${field}` 
        });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updatedCompany.email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Validate phone format (basic validation)
    if (!updatedCompany.phone.match(/^\+?[\d\s\-\(\)]+$/)) {
      return res.status(400).json({ 
        error: 'Invalid phone number format' 
      });
    }

    // Validate satisfaction rate (0-100)
    if (updatedCompany.satisfactionRate < 0 || updatedCompany.satisfactionRate > 100) {
      return res.status(400).json({ 
        error: 'Satisfaction rate must be between 0 and 100' 
      });
    }

    // Save company settings
    const companyData = {
      company: updatedCompany,
      metadata: {
        version: '1.0',
        lastModified: new Date().toISOString(),
        modifiedBy: 'admin' // In a real app, this would be the authenticated user
      }
    };

    await dataManager.writeData('company-settings', companyData);

    res.json({ 
      success: true, 
      message: 'Company settings updated successfully',
      company: updatedCompany 
    });
  } catch (error) {
    console.error('Error updating company settings:', error);
    res.status(500).json({ 
      error: 'Failed to update company settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get company public info (for frontend display)
export const handleGetCompanyPublicInfo: RequestHandler = async (req, res) => {
  try {
    const companyData = await dataManager.readData('company-settings');
    
    if (!companyData || !companyData.company) {
      // Return minimal default info
      const defaultInfo = {
        name: 'Cleaning World',
        nameAr: 'عالم النظافة',
        description: 'Professional cleaning company using the latest American and European equipment',
        descriptionAr: 'شركة تنظيف احترافية تستخدم أحدث المعدات الأمريكية والأوروبية',
        phone: '+966 50 123 4567',
        email: 'info@m-clean.net',
        website: 'https://m-clean.net'
      };

      res.json(defaultInfo);
      return;
    }

    // Return only public information
    const company = companyData.company;
    const publicInfo = {
      name: company.name,
      nameAr: company.nameAr,
      description: company.description,
      descriptionAr: company.descriptionAr,
      tagline: company.tagline,
      taglineAr: company.taglineAr,
      phone: company.phone,
      email: company.email,
      website: company.website,
      address: company.address,
      addressAr: company.addressAr,
      foundedYear: company.foundedYear,
      projectsCompleted: company.projectsCompleted,
      satisfactionRate: company.satisfactionRate,
      businessHours: company.businessHours,
      socialMedia: company.socialMedia,
      services: company.services,
      certifications: company.certifications,
      certificationsAr: company.certificationsAr
    };

    res.json(publicInfo);
  } catch (error) {
    console.error('Error fetching company public info:', error);
    res.status(500).json({ 
      error: 'Failed to fetch company information',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
