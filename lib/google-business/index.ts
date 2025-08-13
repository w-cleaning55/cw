export interface GoogleBusinessProfile {
  // Basic Information
  businessName: string;
  businessNameAr: string;
  description: string;
  descriptionAr: string;
  website: string;
  phone: string;
  email: string;
  
  // Location
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Business Hours
  hours: {
    [key: string]: {
      open: string;
      close: string;
      isClosed: boolean;
    };
  };
  
  // Categories and Services
  primaryCategory: string;
  secondaryCategories: string[];
  services: string[];
  serviceAreas: string[];
  
  // Media
  logo: string;
  coverPhoto: string;
  photos: string[];
  videos: string[];
  
  // Social and Reviews
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  
  // SEO and Schema
  keywords: string[];
  keywordsAr: string[];
  
  // Additional Features
  features: {
    hasDelivery: boolean;
    hasPickup: boolean;
    hasOnlineBooking: boolean;
    hasPaymentOptions: string[];
    languages: string[];
    certifications: string[];
    insurance: boolean;
    licensed: boolean;
  };
  
  // Configuration
  isActive: boolean;
  lastSynced?: string;
  autoSync: boolean;
  syncInterval: number; // hours
}

export interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  logo: string;
  image: string[];
  
  // Contact Info
  telephone: string;
  email: string;
  
  // Address
  address: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  
  // Geo Location
  geo: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  
  // Business Hours
  openingHoursSpecification: Array<{
    '@type': string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  
  // Services
  hasOfferCatalog?: {
    '@type': string;
    name: string;
    itemListElement: Array<{
      '@type': string;
      name: string;
      description?: string;
      offers?: {
        '@type': string;
        price?: string;
        priceCurrency?: string;
      };
    }>;
  };
  
  // Area Served
  areaServed?: Array<{
    '@type': string;
    name: string;
  }>;
  
  // Reviews and Ratings
  aggregateRating?: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
  
  // Additional Properties
  priceRange?: string;
  paymentAccepted?: string[];
  currenciesAccepted?: string[];
  languages?: string[];
  
  // Social Media
  sameAs?: string[];
  
  // Business Features
  amenityFeature?: Array<{
    '@type': string;
    name: string;
    value: boolean;
  }>;
}

class GoogleBusinessManager {
  private profile: GoogleBusinessProfile | null = null;
  
  setProfile(profile: GoogleBusinessProfile): void {
    this.profile = profile;
  }
  
  getProfile(): GoogleBusinessProfile | null {
    return this.profile;
  }
  
  generateLocalBusinessSchema(): LocalBusinessSchema {
    if (!this.profile) {
      throw new Error('Google Business Profile not set');
    }
    
    const schema: LocalBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: this.profile.businessName,
      alternateName: this.profile.businessNameAr,
      description: this.profile.description,
      url: this.profile.website,
      logo: this.profile.logo,
      image: [this.profile.coverPhoto, ...this.profile.photos].filter(Boolean),
      
      telephone: this.profile.phone,
      email: this.profile.email,
      
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.profile.address.street,
        addressLocality: this.profile.address.city,
        addressRegion: this.profile.address.state,
        postalCode: this.profile.address.postalCode,
        addressCountry: this.profile.address.country
      },
      
      geo: this.profile.address.coordinates ? {
        '@type': 'GeoCoordinates',
        latitude: this.profile.address.coordinates.latitude,
        longitude: this.profile.address.coordinates.longitude
      } : {
        '@type': 'GeoCoordinates',
        latitude: 24.7136, // Riyadh default
        longitude: 46.6753
      },
      
      openingHoursSpecification: this.generateOpeningHours(),
      
      sameAs: Object.values(this.profile.socialMedia).filter(Boolean),
      
      languages: this.profile.features.languages
    };
    
    // Add services catalog
    if (this.profile.services.length > 0) {
      schema.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        name: 'Cleaning Services',
        itemListElement: this.profile.services.map(service => ({
          '@type': 'Offer',
          name: service
        }))
      };
    }
    
    // Add area served
    if (this.profile.serviceAreas.length > 0) {
      schema.areaServed = this.profile.serviceAreas.map(area => ({
        '@type': 'City',
        name: area
      }));
    }
    
    // Add amenity features
    schema.amenityFeature = [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Delivery',
        value: this.profile.features.hasDelivery
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Pickup',
        value: this.profile.features.hasPickup
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Online Booking',
        value: this.profile.features.hasOnlineBooking
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Licensed',
        value: this.profile.features.licensed
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Insured',
        value: this.profile.features.insurance
      }
    ];
    
    return schema;
  }
  
  private generateOpeningHours(): any[] {
    if (!this.profile) return [];
    
    const dayMapping: { [key: string]: string } = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    
    const groupedHours: { [key: string]: string[] } = {};
    
    // Group days with same hours
    Object.entries(this.profile.hours).forEach(([day, hours]) => {
      if (!hours.isClosed) {
        const timeSlot = `${hours.open}-${hours.close}`;
        if (!groupedHours[timeSlot]) {
          groupedHours[timeSlot] = [];
        }
        groupedHours[timeSlot].push(dayMapping[day]);
      }
    });
    
    return Object.entries(groupedHours).map(([timeSlot, days]) => {
      const [opens, closes] = timeSlot.split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days,
        opens,
        closes
      };
    });
  }
  
  generateGoogleMyBusinessData(): any {
    if (!this.profile) {
      throw new Error('Google Business Profile not set');
    }
    
    return {
      name: this.profile.businessName,
      description: this.profile.description,
      phone: this.profile.phone,
      website: this.profile.website,
      categories: [this.profile.primaryCategory, ...this.profile.secondaryCategories],
      location: {
        address: this.profile.address,
        coordinates: this.profile.address.coordinates
      },
      hours: this.profile.hours,
      photos: [this.profile.logo, this.profile.coverPhoto, ...this.profile.photos],
      services: this.profile.services,
      serviceAreas: this.profile.serviceAreas,
      attributes: {
        hasDelivery: this.profile.features.hasDelivery,
        hasPickup: this.profile.features.hasPickup,
        hasOnlineBooking: this.profile.features.hasOnlineBooking,
        paymentOptions: this.profile.features.hasPaymentOptions,
        languages: this.profile.features.languages,
        licensed: this.profile.features.licensed,
        insured: this.profile.features.insurance
      }
    };
  }
  
  async syncWithGoogleMyBusiness(): Promise<boolean> {
    // This would integrate with Google My Business API
    // For now, we'll simulate the sync
    try {
      if (!this.profile) return false;
      
      const data = this.generateGoogleMyBusinessData();
      
      // TODO: Implement actual Google My Business API integration
      console.log('Syncing with Google My Business:', data);
      
      // Update last synced timestamp
      this.profile.lastSynced = new Date().toISOString();
      
      return true;
    } catch (error) {
      console.error('Google My Business sync failed:', error);
      return false;
    }
  }
  
  validateProfile(): { isValid: boolean; errors: string[] } {
    if (!this.profile) {
      return { isValid: false, errors: ['Profile not set'] };
    }
    
    const errors: string[] = [];
    
    if (!this.profile.businessName) errors.push('Business name is required');
    if (!this.profile.phone) errors.push('Phone number is required');
    if (!this.profile.email) errors.push('Email is required');
    if (!this.profile.address.street) errors.push('Street address is required');
    if (!this.profile.address.city) errors.push('City is required');
    if (!this.profile.primaryCategory) errors.push('Primary category is required');
    if (!this.profile.description) errors.push('Description is required');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Global Google Business Manager instance
export const googleBusinessManager = new GoogleBusinessManager();

// Default Google Business Profile template
export const defaultGoogleBusinessProfile: GoogleBusinessProfile = {
  businessName: 'Cleaning World',
  businessNameAr: 'عالم التنظيف',
  description: 'Professional cleaning services with advanced equipment and experienced technicians',
  descriptionAr: 'خدمات التنظيف المهنية بمعدات متطورة وفنيين ذوي خبرة',
  website: 'https://m-clean.net',
  phone: '+966501234567',
  email: 'info@m-clean.net',
  
  address: {
    street: 'King Fahd Road',
    city: 'Riyadh',
    state: 'Riyadh Province',
    postalCode: '12345',
    country: 'SA',
    coordinates: {
      latitude: 24.7136,
      longitude: 46.6753
    }
  },
  
  hours: {
    monday: { open: '08:00', close: '22:00', isClosed: false },
    tuesday: { open: '08:00', close: '22:00', isClosed: false },
    wednesday: { open: '08:00', close: '22:00', isClosed: false },
    thursday: { open: '08:00', close: '22:00', isClosed: false },
    friday: { open: '14:00', close: '22:00', isClosed: false },
    saturday: { open: '08:00', close: '22:00', isClosed: false },
    sunday: { open: '08:00', close: '22:00', isClosed: false }
  },
  
  primaryCategory: 'Cleaning Service',
  secondaryCategories: ['House Cleaning Service', 'Commercial Cleaning Service', 'Carpet Cleaning Service'],
  services: ['House Cleaning', 'Office Cleaning', 'Carpet Cleaning', 'Window Cleaning'],
  serviceAreas: ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'],
  
  logo: '/logo.png',
  coverPhoto: '/cover.jpg',
  photos: [],
  videos: [],
  
  socialMedia: {
    facebook: 'https://facebook.com/cleaningworld',
    twitter: 'https://twitter.com/cleaningworld',
    instagram: 'https://instagram.com/cleaningworld'
  },
  
  keywords: ['cleaning', 'house cleaning', 'office cleaning', 'professional cleaning'],
  keywordsAr: ['تنظيف', 'تنظيف منازل', 'تنظيف مكاتب', 'تنظيف احترافي'],
  
  features: {
    hasDelivery: false,
    hasPickup: true,
    hasOnlineBooking: true,
    hasPaymentOptions: ['Cash', 'Credit Card', 'Bank Transfer'],
    languages: ['Arabic', 'English'],
    certifications: ['ISO 9001', 'OSHA Certified'],
    insurance: true,
    licensed: true
  },
  
  isActive: true,
  autoSync: false,
  syncInterval: 24
};
