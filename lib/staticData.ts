import fs from 'fs';
import path from 'path';

export interface HomePageData {
  services: any[];
  companyInfo: any;
  siteContent: any;
  dynamicContent: any;
}

export interface PageSection {
  type: string;
  [key: string]: any;
}

export interface PageData {
  title: string;
  description?: string;
  sections: PageSection[];
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

/**
 * Fetch all homepage data for SSG/ISR
 */
export async function getHomePageData(): Promise<HomePageData> {
  try {
    // Fetch all data in parallel
    const [services, companyInfo, siteContent, dynamicContent] = await Promise.all([
      fetchServices(),
      fetchCompanyInfo(),
      fetchSiteContent(),
      fetchDynamicContent()
    ]);

    return {
      services,
      companyInfo,
      siteContent,
      dynamicContent
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      services: [],
      companyInfo: getDefaultCompanyInfo(),
      siteContent: getDefaultSiteContent(),
      dynamicContent: getDefaultDynamicContent()
    };
  }
}

/**
 * Fetch services data from JSON file
 */
export async function fetchServices(): Promise<any[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'services.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data.services || [];
    }
    
    // Return empty array if file doesn't exist (no API fallback in SSG)
    return [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * Fetch company info from JSON file
 */
export async function fetchCompanyInfo(): Promise<any> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'company-settings.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data.company || data;
    }
    
    return getDefaultCompanyInfo();
  } catch (error) {
    console.error('Error fetching company info:', error);
    return getDefaultCompanyInfo();
  }
}

/**
 * Fetch site content from JSON file
 */
export async function fetchSiteContent(): Promise<any> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'site-content.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data.content || data;
    }
    
    return getDefaultSiteContent();
  } catch (error) {
    console.error('Error fetching site content:', error);
    return getDefaultSiteContent();
  }
}

/**
 * Fetch dynamic content from JSON file
 */
export async function fetchDynamicContent(): Promise<any> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'dynamic-content.json');
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data;
    }
    
    return getDefaultDynamicContent();
  } catch (error) {
    console.error('Error fetching dynamic content:', error);
    return getDefaultDynamicContent();
  }
}

/**
 * Get page data from JSON file
 */
export async function getPageData(pageName: string): Promise<PageData> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'pages', `${pageName}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data;
    }
    
    return getDefaultPageData(pageName);
  } catch (error) {
    console.error(`Error fetching page data for ${pageName}:`, error);
    return getDefaultPageData(pageName);
  }
}

/**
 * Save data to JSON file
 */
export async function saveDataToFile(filePath: string, data: any): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'data', filePath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving data to file:', error);
    return false;
  }
}

// Default data fallbacks
function getDefaultCompanyInfo() {
  return {
    name: { ar: "عالم التنظيف", en: "Cleaning World" },
    tagline: { ar: "نظافة مثالية لحياة أفضل", en: "Perfect cleanliness for a better life" },
    phone: "+966-50-123-4567",
    email: "info@cleaningworld.com",
    address: { ar: "جدة، المملكة العربية السعودية", en: "Jeddah, Saudi Arabia" }
  };
}

function getDefaultSiteContent() {
  return {
    heroSection: {
      title: { ar: "خدمات تنظيف احترافية", en: "Professional Cleaning Services" },
      subtitle: { ar: "نظافة مثالية لحياة أفضل", en: "Perfect cleanliness for a better life" },
      description: { ar: "نقدم خدمات تنظيف شاملة ومحترفة", en: "We provide comprehensive and professional cleaning services" }
    },
    featuredSection: {
      titleAr: "خدماتنا المميزة",
      title: "Our Featured Services",
      subtitleAr: "حلول تنظيف مهنية لجميع احتياجاتك",
      subtitle: "Professional cleaning solutions for all your needs"
    }
  };
}

function getDefaultDynamicContent() {
  return {
    homepage: {
      order: ["hero", "services", "features", "about", "testimonials", "contact"],
      hero: { component: "modern", visible: true },
      services: { component: "premium", visible: true },
      features: { visible: true },
      about: { visible: true },
      testimonials: { visible: true },
      contact: { visible: true }
    }
  };
}

function getDefaultPageData(pageName: string): PageData {
  const defaults: Record<string, PageData> = {
    home: {
      title: "Cleaning World - Professional Cleaning Services",
      description: "Professional cleaning services for homes and offices",
      sections: [
        {
          type: "hero",
          headline: "Professional Cleaning Services",
          subtitle: "Perfect cleanliness for a better life",
          button: "Book Now"
        },
        {
          type: "services",
          title: "Our Services",
          items: ["Home Cleaning", "Office Cleaning", "Carpet Cleaning"]
        }
      ]
    },
    about: {
      title: "About Us - Cleaning World",
      description: "Learn more about our professional cleaning services",
      sections: [
        {
          type: "hero",
          headline: "About Cleaning World",
          subtitle: "Your trusted cleaning partner"
        },
        {
          type: "content",
          text: "We are a professional cleaning company dedicated to providing the best service."
        }
      ]
    },
    services: {
      title: "Our Services - Cleaning World",
      description: "Explore our comprehensive cleaning services",
      sections: [
        {
          type: "hero",
          headline: "Our Services",
          subtitle: "Comprehensive cleaning solutions"
        },
        {
          type: "services-grid",
          items: [
            { name: "Home Cleaning", description: "Complete home cleaning service" },
            { name: "Office Cleaning", description: "Professional office cleaning" },
            { name: "Carpet Cleaning", description: "Deep carpet cleaning service" }
          ]
        }
      ]
    }
  };

  return defaults[pageName] || {
    title: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} - Cleaning World`,
    description: `Page description for ${pageName}`,
    sections: [
      {
        type: "hero",
        headline: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`,
        subtitle: "Page content"
      }
    ]
  };
}
