import { SERVICES, FEATURES, TESTIMONIALS } from "./constants";

// Base types
export interface BaseComponent {
  className?: string;
  children?: React.ReactNode;
}

// Company related types
export interface CompanyInfo {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  foundedYear: number;
  location: {
    city: string;
    country: string;
    address: string;
  };
  contact: {
    phones: string[];
    emails: string[];
  };
}

export interface CompanyStat {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

// Service related types
export type ServiceCategory = "residential" | "commercial" | "specialized";

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: ServiceCategory;
}

export type ServiceList = typeof SERVICES;

// Feature related types
export type IconType = "shield" | "clock" | "award" | "users" | "star";

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconType: IconType;
}

export type FeatureList = typeof FEATURES;

// Testimonial related types
export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  service: string;
  serviceId: string;
}

export type TestimonialList = typeof TESTIMONIALS;

// Navigation types
export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface SocialMediaLink {
  icon: string;
  href: string;
  label: string;
}

// Layout types
export interface SectionProps extends BaseComponent {
  id?: string;
  title?: string;
  subtitle?: string;
}

export interface CardProps extends BaseComponent {
  variant?: "default" | "elevated" | "bordered";
  padding?: "sm" | "md" | "lg";
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

// Animation types
export type AnimationType = "fadeIn" | "slideUp" | "pulse" | "bounce";

export interface AnimationConfig {
  type: AnimationType;
  delay?: number;
  duration?: number;
}

// Responsive types
export type BreakpointSize = "sm" | "md" | "lg" | "xl" | "2xl";

export interface ResponsiveConfig {
  [key in BreakpointSize]?: number | string;
}

// Error handling types
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error }>;
}

// Performance types
export interface LazyLoadConfig {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContactSubmission {
  id: string;
  data: ContactFormData;
  timestamp: Date;
  status: "pending" | "processed" | "failed";
}

// SEO types
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  openGraph?: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
  twitter?: {
    card: "summary" | "summary_large_image";
    site: string;
    creator: string;
  };
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    arabic: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
