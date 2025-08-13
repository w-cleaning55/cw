'use client';

import dynamic from 'next/dynamic';

const ContentManagement = dynamic(() => import('../../../components/admin/ContentManagement'), {
  ssr: false,
  loading: () => <div className="min-h-[50vh] animate-pulse bg-gray-100 rounded-xl" />,
});

export default function ContentPage() {
  return <ContentManagement />;
}
