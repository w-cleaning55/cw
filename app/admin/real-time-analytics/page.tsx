'use client';

import dynamic from 'next/dynamic';

const RealTimeAnalytics = dynamic(() => import('../../../components/admin/RealTimeAnalytics'), {
	ssr: false,
	loading: () => <div className="min-h-[50vh] animate-pulse bg-gray-100 rounded-xl" />,
});

export default function RealTimeAnalyticsPage() {
	return <RealTimeAnalytics />;
}