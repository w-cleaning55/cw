import { useState, useEffect, useCallback } from 'react';

export interface HomePageData {
  services: any[];
  companyInfo: any;
  siteContent: any;
  dynamicContent: any;
  loading: boolean;
  error: string | null;
}

export const useHomePageData = () => {
  const [data, setData] = useState<HomePageData>({
    services: [],
    companyInfo: null,
    siteContent: null,
    dynamicContent: null,
    loading: true,
    error: null
  });

  const fetchAllData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch all data in parallel with caching
      const [servicesRes, companyRes, contentRes, dynamicRes] = await Promise.all([
        fetch('/api/admin/services', {
          cache: 'force-cache',
          next: { revalidate: 300 }
        }),
        fetch('/api/company-info', {
          cache: 'force-cache',
          next: { revalidate: 600 }
        }),
        fetch('/api/admin/site-content', {
          cache: 'force-cache',
          next: { revalidate: 600 }
        }),
        fetch('/api/dynamic-content', {
          cache: 'force-cache',
          next: { revalidate: 300 }
        })
      ]);

      // Check if all responses are ok
      if (!servicesRes.ok || !companyRes.ok || !contentRes.ok || !dynamicRes.ok) {
        throw new Error('One or more API requests failed');
      }

      const [servicesData, companyData, contentData, dynamicData] = await Promise.all([
        servicesRes.json(),
        companyRes.json(),
        contentRes.json(),
        dynamicRes.json()
      ]);

      setData({
        services: servicesData.data?.services || [],
        companyInfo: companyData.company || companyData,
        siteContent: contentData.content || contentData,
        dynamicContent: dynamicData,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching home page data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load data'
      }));
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const refetch = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    ...data,
    refetch
  };
};
