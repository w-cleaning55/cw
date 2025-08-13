import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const COMPANY_SETTINGS_FILE = path.join(DATA_DIR, 'company-settings.json');

interface CompanySettings {
  basic: {
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    logo: string;
    favicon: string;
    established: string;
    registrationNumber: string;
    taxNumber: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    website: string;
    address: string;
    addressAr: string;
    city: string;
    postalCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  social: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    snapchat: string;
    tiktok: string;
  };
  business: {
    workingHours: {
      [key: string]: {
        isOpen: boolean;
        start: string;
        end: string;
      };
    };
    serviceAreas: string[];
    languages: string[];
    currency: string;
    paymentMethods: string[];
    businessType: string;
    licenseNumber: string;
    insuranceNumber: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    logoVariations: {
      light: string;
      dark: string;
      icon: string;
    };
    brandGuidelines: string;
  };
  seo: {
    metaTitle: string;
    metaTitleAr: string;
    metaDescription: string;
    metaDescriptionAr: string;
    keywords: string[];
    ogImage: string;
    structuredData: boolean;
    sitemap: boolean;
    robotsTxt: string;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminEmail: string;
    notificationSettings: {
      newBooking: boolean;
      paymentReceived: boolean;
      serviceCompleted: boolean;
      customerFeedback: boolean;
      systemAlerts: boolean;
    };
  };
  lastUpdated: string;
}

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDefaultSettings(): CompanySettings {
  return {
    basic: {
      name: 'Cleaning World Company',
      nameAr: 'شركة عالم التنظيف',
      description: 'Professional cleaning services for homes and offices',
      descriptionAr: 'خدمات تنظيف احترافية للمنازل والمكاتب',
      logo: '/images/logo.png',
      favicon: '/favicon.ico',
      established: '2020',
      registrationNumber: '1234567890',
      taxNumber: '300000000000003'
    },
    contact: {
      email: 'info@cleaningworld.sa',
      phone: '+966501234567',
      whatsapp: '+966501234567',
      website: 'https://cleaningworld.sa',
      address: 'Riyadh, Al Malaz District, Prince Mohammed bin Abdulaziz Street',
      addressAr: 'الرياض، حي الملز، شارع الأمير محمد بن عبدالعزيز',
      city: 'Riyadh',
      postalCode: '11564',
      country: 'Saudi Arabia',
      coordinates: {
        lat: 24.7136,
        lng: 46.6753
      }
    },
    social: {
      facebook: 'https://facebook.com/cleaningworld',
      twitter: 'https://twitter.com/cleaningworld',
      instagram: 'https://instagram.com/cleaningworld',
      linkedin: 'https://linkedin.com/company/cleaningworld',
      youtube: 'https://youtube.com/@cleaningworld',
      snapchat: 'https://snapchat.com/add/cleaningworld',
      tiktok: 'https://tiktok.com/@cleaningworld'
    },
    business: {
      workingHours: {
        sunday: { isOpen: true, start: '08:00', end: '18:00' },
        monday: { isOpen: true, start: '08:00', end: '18:00' },
        tuesday: { isOpen: true, start: '08:00', end: '18:00' },
        wednesday: { isOpen: true, start: '08:00', end: '18:00' },
        thursday: { isOpen: true, start: '08:00', end: '18:00' },
        friday: { isOpen: false, start: '00:00', end: '00:00' },
        saturday: { isOpen: true, start: '09:00', end: '17:00' }
      },
      serviceAreas: [
        'الرياض',
        'جدة',
        'الدمام',
        'مكة المكرمة',
        'المدينة المنورة'
      ],
      languages: ['العربية', 'English'],
      currency: 'SAR',
      paymentMethods: [
        'نقد',
        'بطاقة ائتمان',
        'تحويل بنكي',
        'محافظ إلكترونية'
      ],
      businessType: 'خدمات تنظيف',
      licenseNumber: 'LIC123456789',
      insuranceNumber: 'INS987654321'
    },
    branding: {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      fontFamily: 'Cairo',
      logoVariations: {
        light: '/images/logo-light.png',
        dark: '/images/logo-dark.png',
        icon: '/images/logo-icon.png'
      },
      brandGuidelines: '/documents/brand-guidelines.pdf'
    },
    seo: {
      metaTitle: 'شركة عالم التنظيف - خدمات تنظيف احترافية',
      metaTitleAr: 'شركة عالم التنظيف - خدمات تنظيف احترافية',
      metaDescription: 'نقدم خدمات تنظيف احترافي�� للمنازل والمكاتب باستخدام أحدث التقنيات',
      metaDescriptionAr: 'نقدم خدمات تنظيف احترافية للمنازل والمكاتب باستخدام أحدث التقنيات',
      keywords: [
        'تنظيف',
        'تنظيف منازل',
        'تنظيف مكاتب',
        'خدمات تنظيف',
        'شركة تنظيف',
        'الرياض'
      ],
      ogImage: '/images/og-image.jpg',
      structuredData: true,
      sitemap: true,
      robotsTxt: 'User-agent: *\nAllow: /'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      adminEmail: 'admin@cleaningworld.sa',
      notificationSettings: {
        newBooking: true,
        paymentReceived: true,
        serviceCompleted: true,
        customerFeedback: true,
        systemAlerts: true
      }
    },
    lastUpdated: new Date().toISOString()
  };
}

export async function GET() {
  try {
    ensureDataDirectory();
    
    let settings: CompanySettings;
    
    if (fs.existsSync(COMPANY_SETTINGS_FILE)) {
      const fileContent = fs.readFileSync(COMPANY_SETTINGS_FILE, 'utf-8');
      settings = JSON.parse(fileContent);
    } else {
      settings = getDefaultSettings();
      fs.writeFileSync(COMPANY_SETTINGS_FILE, JSON.stringify(settings, null, 2));
    }
    
    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error reading company settings:', error);
    return NextResponse.json(
      { error: 'Failed to load company settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const updatedSettings = await request.json();
    
    // Merge with existing settings to preserve structure
    let currentSettings: CompanySettings = getDefaultSettings();
    
    if (fs.existsSync(COMPANY_SETTINGS_FILE)) {
      const fileContent = fs.readFileSync(COMPANY_SETTINGS_FILE, 'utf-8');
      currentSettings = JSON.parse(fileContent);
    }
    
    const mergedSettings: CompanySettings = {
      ...currentSettings,
      ...updatedSettings,
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(COMPANY_SETTINGS_FILE, JSON.stringify(mergedSettings, null, 2));
    
    return NextResponse.json({
      success: true,
      settings: mergedSettings,
      message: 'Company settings saved successfully'
    });
  } catch (error) {
    console.error('Error saving company settings:', error);
    return NextResponse.json(
      { error: 'Failed to save company settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { section, data } = await request.json();
    
    if (!section || !data) {
      return NextResponse.json(
        { error: 'Section and data are required' },
        { status: 400 }
      );
    }
    
    let settings: CompanySettings = getDefaultSettings();
    
    if (fs.existsSync(COMPANY_SETTINGS_FILE)) {
      const fileContent = fs.readFileSync(COMPANY_SETTINGS_FILE, 'utf-8');
      settings = JSON.parse(fileContent);
    }
    
    // Update specific section
    if (settings.hasOwnProperty(section)) {
      (settings as any)[section] = {
        ...(settings as any)[section],
        ...data
      };
      settings.lastUpdated = new Date().toISOString();
      
      fs.writeFileSync(COMPANY_SETTINGS_FILE, JSON.stringify(settings, null, 2));
      
      return NextResponse.json({
        success: true,
        settings,
        message: `${section} section updated successfully`
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating company settings section:', error);
    return NextResponse.json(
      { error: 'Failed to update company settings section' },
      { status: 500 }
    );
  }
}
