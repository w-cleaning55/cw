import * as React from "react";
import { Suspense, lazy, ComponentType } from 'react';

interface LazyLoaderProps {
  component: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
}

const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  component, 
  fallback = <div className="animate-pulse bg-gray-200 h-32 rounded-lg" />,
  props = {}
}) => {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default LazyLoader;

// Predefined lazy components for common use cases
export const LazyAdminDashboard = lazy(() => import('./admin/AdminDashboard'));
export const LazyUserManagement = lazy(() => import('./admin/UserManagement'));
export const LazyServicesManagement = lazy(() => import('./admin/ServicesManagement'));
export const LazyCustomerManagement = lazy(() => import('./admin/CustomerManagement'));
export const LazyContentManagement = lazy(() => import('./admin/ContentManagement'));
export const LazyDatabaseManagement = lazy(() => import('./admin/DatabaseManagement'));
export const LazyAdvancedAnalyticsCharts = lazy(() => import('./admin/AdvancedAnalyticsCharts'));
export const LazyBusinessOwnerDashboard = lazy(() => import('./admin/BusinessOwnerDashboard'));
export const LazyReportGenerator = lazy(() => import('./admin/ReportGenerator'));
export const LazyRealTimeAnalytics = lazy(() => import('./admin/RealTimeAnalytics'));
export const LazyAIContentAssistant = lazy(() => import('./admin/AIContentAssistant'));
export const LazyAdvancedImageUploader = lazy(() => import('./admin/AdvancedImageUploader'));
export const LazyImageUploader = lazy(() => import('./admin/ImageUploader'));
export const LazyDynamicContentManager = lazy(() => import('./admin/DynamicContentManager'));
export const LazyBusinessNotifications = lazy(() => import('./admin/BusinessNotifications'));
export const LazyNotificationSettings = lazy(() => import('./admin/NotificationSettings'));
export const LazySEOSettings = lazy(() => import('./admin/SEOSettings'));
export const LazySystemSettings = lazy(() => import('./admin/SystemSettings'));
export const LazyCompanySettings = lazy(() => import('./admin/CompanySettings'));
export const LazyColorPaletteManagement = lazy(() => import('./admin/ColorPaletteManagement'));
export const LazyBookingManagement = lazy(() => import('./admin/BookingManagement'));
export const LazyAISettings = lazy(() => import('./admin/AISettings'));
export const LazyDatabaseSettings = lazy(() => import('./admin/DatabaseSettings'));
export const LazyServiceImageManager = lazy(() => import('./admin/ServiceImageManager'));
export const LazyAdminLayout = lazy(() => import('./admin/AdminLayout'));

// Lazy loading for main page components
export const LazyAboutUsSection = lazy(() => import('./AboutUsSection'));
export const LazyAddressSelector = lazy(() => import('./AddressSelector'));
export const LazyAnimationController = lazy(() => import('./AnimationController'));
export const LazyCleaningServices = lazy(() => import('./CleaningServices'));
export const LazyContactCTASection = lazy(() => import('./ContactCTASection'));
export const LazyContactForm = lazy(() => import('./ContactForm'));
export const LazyCustomerReviews = lazy(() => import('./CustomerReviews'));
export const LazyDarkModeBackground = lazy(() => import('./DarkModeBackground'));
export const LazyDynamicFeaturesSection = lazy(() => import('./DynamicFeaturesSection'));
export const LazyDynamicServicesOverview = lazy(() => import('./DynamicServicesOverview'));
export const LazyDynamicSimpleHero = lazy(() => import('./DynamicSimpleHero'));
export const LazyDynamicTestimonialsSection = lazy(() => import('./DynamicTestimonialsSection'));
export const LazyEnhancedColorSystem = lazy(() => import('./EnhancedColorSystem'));
export const LazyEnhancedThemeProvider = lazy(() => import('./EnhancedThemeProvider'));
export const LazyFeaturedServices = lazy(() => import('./FeaturedServices'));
export const LazyFeaturesSection = lazy(() => import('./FeaturesSection'));
export const LazyFloatingActions = lazy(() => import('./FloatingActions'));
export const LazyHeader = lazy(() => import('./Header'));
export const LazyLoginForm = lazy(() => import('./LoginForm'));
export const LazyMessagingSystem = lazy(() => import('./MessagingSystem'));
export const LazyModernFooter = lazy(() => import('./ModernFooter'));
export const LazyModernHero = lazy(() => import('./ModernHero'));
export const LazyNotificationSystem = lazy(() => import('./NotificationSystem'));
export const LazyProfessionalDesignSystem = lazy(() => import('./ProfessionalDesignSystem'));
export const LazyProtectedRoute = lazy(() => import('./ProtectedRoute'));
export const LazyServicesOverview = lazy(() => import('./ServicesOverview'));
export const LazySimpleHero = lazy(() => import('./SimpleHero'));
export const LazySuperiorCTA = lazy(() => import('./SuperiorCTA'));
export const LazyTestimonialsSection = lazy(() => import('./TestimonialsSection'));
export const LazyThemeSelector = lazy(() => import('./ThemeSelector'));
export const LazyThemeProvider = lazy(() => import('./ThemeProvider'));
export const LazyAIAssistant = lazy(() => import('./AIAssistant'));
export const LazyClientProviders = lazy(() => import('./ClientProviders'));
