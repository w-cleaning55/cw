'use client';

import dynamic from 'next/dynamic';

const DatabaseManagement = dynamic(() => import('../../../components/admin/DatabaseManagement'), {
  ssr: false,
  loading: () => <div className="min-h-[50vh] animate-pulse bg-gray-100 rounded-xl" />,
});

export default function DatabasePage() {
  return <DatabaseManagement />;
}
