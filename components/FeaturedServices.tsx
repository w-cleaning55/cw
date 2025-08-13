import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTranslation } from '../hooks/useTranslation';
import {
  ArrowRight,
  Star,
  Clock,
  DollarSign,
  Code,
  Smartphone,
  Brain,
  Cloud,
  TrendingUp,
  Palette,
  Check
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  price: string;
  duration: string;
  featured: boolean;
  active: boolean;
  features: string[];
  image?: string;
}

interface ServicesData {
  services: Service[];
  metadata: {
    total: number;
    active: number;
    featured: number;
    lastUpdated: string;
  };
}

const iconMap = {
  Code,
  Smartphone,
  Brain,
  Cloud,
  TrendingUp,
  Palette
};

export default function MyComponent(props: any) {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFeaturedServices();
  }, []);

  const loadFeaturedServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/services');
      if (!response.ok) {
        throw new Error('Failed to load services');
      }
      
      const data: ServicesData = await response.json();
      // Filter only featured and active services
      const featuredServices = data.services.filter(service => 
        service.featured && service.active
      );
      
      setServices(featuredServices);
    } catch (err) {
      console.error('Failed to load featured services:', err);
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (iconName: string, className = "w-6 h-6") => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Code;
    return <IconComponent className={className} />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Development': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      'AI/ML': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
      'Infrastructure': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      'Marketing': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
      'Design': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800';
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Cloud className="w-12 h-12 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Unable to Load Services</h3>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
            <Button onClick={loadFeaturedServices} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Star className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Featured Services
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Featured services will appear here once they are configured in the admin panel.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-current" />
            Featured Services
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">
            Our Premium Solutions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our most popular and highly-rated services designed to accelerate your business growth
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Card 
              key={service.id} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white dark:bg-gray-800"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
                      {renderIcon(service.icon)}
                    </div>
                    <div>
                      <Badge 
                        variant="outline" 
                        className={`border ${getCategoryColor(service.category)}`}
                      >
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Featured</span>
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Pricing and Duration */}
                <div className="flex items-center justify-between mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {service.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {service.duration}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Key Features:
                  </h4>
                  <div className="space-y-2">
                    {service.features.slice(0, 4).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {service.features.length > 4 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                        +{service.features.length - 4} more features
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our team can create tailor-made solutions that perfectly fit your unique business requirements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                View All Services
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
