"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { createLoadingSkeleton } from '@/lib/component-utils';
import type { PageSection } from '@/lib/staticData';

// Dynamic imports for all components
const Hero = dynamic(() => import('@/components/sections/HeroSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const ModernHero = dynamic(() => import('@/components/sections/ModernHeroSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const SimpleHero = dynamic(() => import('@/components/SimpleHero'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const Services = dynamic(() => import('@/components/sections/ServicesSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const PremiumServices = dynamic(() => import('@/components/sections/PremiumServicesSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const Features = dynamic(() => import('@/components/sections/FeaturesSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const About = dynamic(() => import('@/components/sections/AboutSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const Testimonials = dynamic(() => import('@/components/sections/TestimonialsSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const Contact = dynamic(() => import('@/components/sections/ContactSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const Stats = dynamic(() => import('@/components/sections/StatsSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const AdvancedStats = dynamic(() => import('@/components/sections/AdvancedStatsSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const Content = dynamic(() => import('@/components/ContentSection'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});

const ServicesGrid = dynamic(() => import('@/components/ServicesGrid'), { 
  ssr: true, 
  loading: () => createLoadingSkeleton("section") 
});



// Component map (memoized outside component to avoid hook issues)
const componentMap: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  'modern-hero': ModernHero,
  'simple-hero': SimpleHero,
  services: Services,
  'premium-services': PremiumServices,
  features: Features,
  about: About,
  testimonials: Testimonials,
  contact: Contact,
  stats: Stats,
  'advanced-stats': AdvancedStats,
  content: Content,
  'services-grid': ServicesGrid,
};

interface PageRendererProps {
  sections: PageSection[];
  globalData?: {
    services?: any[];
    companyInfo?: any;
    siteContent?: any;
  };
  className?: string;
}

const PageRenderer: React.FC<PageRendererProps> = React.memo(({ 
  sections, 
  globalData = {},
  className = "" 
}) => {
  if (!sections || !Array.isArray(sections)) {
    console.warn('PageRenderer: No sections provided or invalid format');
    return (
      <div className={`min-h-screen flex items-center justify-center ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">لا يوجد محتوى</h2>
          <p className="text-gray-600">لم يتم العثور على أقسام للعرض</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {sections.map((section, index) => {
        const Component = componentMap[section.type];
        
        if (!Component) {
          console.warn(`PageRenderer: Unknown section type "${section.type}"`);
          return (
            <div key={`${section.type}-${index}`} className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg m-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                نوع قسم غير معروف: {section.type}
              </h3>
              <p className="text-yellow-700">
                يرجى التحقق من تكوين الصفحة
              </p>
            </div>
          );
        }

        // Merge global data with section data
        const sectionProps = {
          ...section,
          ...globalData,
        };

        return <Component key={`${section.type}-${index}`} {...sectionProps} />;
      })}
    </div>
  );
});

PageRenderer.displayName = 'PageRenderer';

export default PageRenderer;
