"use client";

import * as React from 'react';

export interface SystemSettings {
	company?: {
		name?: string;
		nameAr?: string;
		nameEn?: string;
		email?: string;
		phone?: string;
		logo?: string;
		website?: string;
	};
	theme?: {
		logoUrl?: string;
		faviconUrl?: string;
		primaryColor?: string;
	};
	ai?: any;
}

interface UseSystemSettings {
	settings: SystemSettings | null;
	loading: boolean;
	error: string | null;
	reload: () => void;
}

export function useSystemSettings(): UseSystemSettings {
	const [settings, setSettings] = React.useState<SystemSettings | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState<string | null>(null);
	const reloadRef = React.useRef(0);

	const load = React.useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch('/api/admin/system-settings', { cache: 'no-store' });
			if (!res.ok) throw new Error('فشل تحميل الإعدادات');
			const data = await res.json();
			const s = (data?.data?.settings || data?.settings) as SystemSettings;
			setSettings(s || null);
		} catch (e: any) {
			setError(e?.message || 'خطأ غير متوقع');
			setSettings(null);
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		load();
	}, [load, reloadRef.current]);

	const reload = React.useCallback(() => {
		reloadRef.current++;
		load();
	}, [load]);

	return { settings, loading, error, reload };
}