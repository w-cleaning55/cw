import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from './useTranslation';

export interface Service {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  priceEn: string;
  duration: string;
  durationEn: string;
  category: string;
  categoryEn: string;
  bookingsCount: number;
  revenue: number;
  rating: number;
  status: string;
  statusEn: string;
  featured: boolean;
  featuredEn: string;
  mostRequested: boolean;
  icon: string;
  image: string;
  features: string[];
  featuresEn: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  success: boolean;
  data: {
    services: Service[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    stats: {
      totalServices: number;
      activeServices: number;
      totalBookings: number;
      totalRevenue: number;
      averageRating: number;
    };
    categories: Array<{
      id: string;
      name: string;
      nameEn: string;
      color: string;
      description: string;
    }>;
  };
}

export interface ServiceFilters {
  category?: string;
  status?: string;
  mostRequested?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const useServices = (filters: ServiceFilters = {}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useTranslation();
  
  // Use ref to prevent infinite loops
  const filtersRef = useRef(filters);
  const isInitialized = useRef(false);

  const fetchServices = useCallback(async (newFilters?: ServiceFilters) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = newFilters || filtersRef.current;
      const params = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/services?${params}`, {
        cache: 'force-cache',
        next: { revalidate: 300 } // Cache for 5 minutes
      });
      const data: ServicesResponse = await response.json();

      if (data.success) {
        setServices(data.data.services);
        setStats(data.data.stats);
        setCategories(data.data.categories);
        setPagination(data.data.pagination);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const addService = async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchServices();
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || 'Failed to add service');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add service');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add service' };
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (serviceData: Partial<Service> & { id: number }) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchServices();
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || 'Failed to update service');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update service');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update service' };
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await fetchServices();
        return { success: true, data: data.data };
      } else {
        throw new Error(data.error || 'Failed to delete service');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete service' };
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for localized data
  const getLocalizedName = (service: Service) => {
    return currentLanguage === 'ar' ? service.name : service.nameEn;
  };

  const getLocalizedDescription = (service: Service) => {
    return currentLanguage === 'ar' ? service.description : service.descriptionEn;
  };

  const getLocalizedPrice = (service: Service) => {
    return currentLanguage === 'ar' ? service.price : service.priceEn;
  };

  const getLocalizedDuration = (service: Service) => {
    return currentLanguage === 'ar' ? service.duration : service.durationEn;
  };

  const getLocalizedCategory = (service: Service) => {
    return currentLanguage === 'ar' ? service.category : service.categoryEn;
  };

  const getLocalizedStatus = (service: Service) => {
    return currentLanguage === 'ar' ? service.status : service.statusEn;
  };

  const getLocalizedFeatured = (service: Service) => {
    return currentLanguage === 'ar' ? (service.featured ? 'مميزة' : 'عادية') : service.featuredEn;
  };

  const getLocalizedFeatures = (service: Service) => {
    return currentLanguage === 'ar' ? service.features : service.featuresEn;
  };

  // Only fetch once on mount and when filters actually change
  useEffect(() => {
    // Prevent multiple fetches on initial render
    if (!isInitialized.current) {
      isInitialized.current = true;
      fetchServices(filters);
      filtersRef.current = filters;
      return;
    }

    // Only refetch if filters actually changed
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(filtersRef.current);
    if (filtersChanged) {
      filtersRef.current = filters;
      fetchServices(filters);
    }
  }, [filters, fetchServices]);

  return {
    services,
    stats,
    categories,
    pagination,
    loading,
    error,
    fetchServices,
    addService,
    updateService,
    deleteService,
    getLocalizedName,
    getLocalizedDescription,
    getLocalizedPrice,
    getLocalizedDuration,
    getLocalizedCategory,
    getLocalizedStatus,
    getLocalizedFeatured,
    getLocalizedFeatures,
  };
};
