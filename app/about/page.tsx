import { Suspense } from 'react';
import { Metadata } from 'next';
import { getPageData } from '@/lib/staticData';
import PageRenderer from '@/components/PageRenderer';

// Static Generation with ISR
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData('about');
  
  return {
    title: pageData.metadata?.title || pageData.title,
    description: pageData.metadata?.description || pageData.description,
    keywords: pageData.metadata?.keywords,
  };
}

export default async function AboutPage() {
  // Fetch page data at build time and revalidate
  const pageData = await getPageData('about');

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <PageRenderer 
          sections={pageData.sections}
          globalData={{
            services: [],
            companyInfo: null,
            siteContent: null
          }}
        />
      </Suspense>
    </main>
  );
}
