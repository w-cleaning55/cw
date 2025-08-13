'use client';

import dynamic from 'next/dynamic';

const ReportGenerator = dynamic(() => import('../../../components/admin/ReportGenerator'), {
  ssr: false,
  loading: () => <div className="min-h-[50vh] animate-pulse bg-gray-100 rounded-xl" />,
});

export default function ReportsPage() {
  return <ReportGenerator />;
}
