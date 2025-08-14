'use client';

import React from 'react';
import SoftUIDashboard from '../../../components/dashboard/SoftUIDashboard';

interface ContactRequest {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	message: string;
	status: string;
	createdAt: string;
}

export default function ContactRequestsPage() {
	const [rows, setRows] = React.useState<ContactRequest[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);

	React.useEffect(() => {
		let active = true;
		const load = async () => {
			try {
				setLoading(true);
				setError(null);
				const res = await fetch('/api/admin/contact-requests', { cache: 'no-store' });
				if (!res.ok) throw new Error('فشل تحميل الطلبات');
				const data = await res.json();
				if (!active) return;
				setRows(Array.isArray(data?.data) ? data.data : []);
			} catch (e: any) {
				setError(e?.message || 'خطأ غير متوقع');
				setRows([]);
			} finally {
				setLoading(false);
			}
		};
		load();
		return () => {
			active = false;
		};
	}, []);

	return (
		<SoftUIDashboard>
			<div className="space-y-6">
				<h1 className="text-3xl font-bold" dir="rtl">طلبات التواصل</h1>
				{loading ? (
					<div className="h-40 bg-gray-100 animate-pulse rounded-xl" />
				) : error ? (
					<div className="p-4 bg-red-50 text-red-700 rounded-xl" dir="rtl">{error}</div>
				) : rows.length === 0 ? (
					<div className="p-4 bg-gray-50 text-gray-600 rounded-xl" dir="rtl">لا توجد طلبات</div>
				) : (
					<div className="overflow-x-auto">
						<table className="min-w-full text-right">
							<thead>
								<tr className="text-gray-500">
									<th className="p-2">الاسم</th>
									<th className="p-2">الايميل</th>
									<th className="p-2">الجوال</th>
									<th className="p-2">الرسالة</th>
									<th className="p-2">التاريخ</th>
								</tr>
							</thead>
							<tbody>
								{rows.map((r) => (
									<tr key={r.id} className="border-t">
										<td className="p-2">{r.name}</td>
										<td className="p-2">{r.email || '-'}</td>
										<td className="p-2">{r.phone || '-'}</td>
										<td className="p-2 max-w-xl truncate" title={r.message}>{r.message}</td>
										<td className="p-2">{new Date(r.createdAt).toLocaleString('ar-SA')}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</SoftUIDashboard>
	);
}