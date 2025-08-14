'use client';

import dynamic from 'next/dynamic';

const DynamicContentManager = dynamic(() => import('../../../components/admin/DynamicContentManager'), {
	ssr: false,
	loading: () => <div className="min-h-[50vh] animate-pulse bg-gray-100 rounded-xl" />,
});

export default function DynamicContentPage() {
	return <DynamicContentManager />;
}