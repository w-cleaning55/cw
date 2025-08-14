"use client";

import React from "react";

export default function AnalyticsMount() {
	const [components, setComponents] = React.useState<{ Analytics?: React.ComponentType<any>; SpeedInsights?: React.ComponentType<any> } | null>(null);
	const [gaId, setGaId] = React.useState<string | null>(null);
	React.useEffect(() => {
		let active = true;
		(async () => {
			try {
				// Load GA id from system settings
				const res = await fetch('/api/admin/system-settings', { cache: 'no-store' });
				const data = await res.json();
				const ga = data?.data?.settings?.analytics?.gaId || null;
				if (!active) return;
				setGaId(ga || null);
			} catch {}
			try {
				const [{ Analytics }, { SpeedInsights }] = await Promise.all([
					import('@vercel/analytics/react').catch(() => ({ Analytics: () => null } as any)),
					import('@vercel/speed-insights/next').catch(() => ({ SpeedInsights: () => null } as any)),
				]);
				if (!active) return;
				setComponents({ Analytics, SpeedInsights });
			} catch {
				setComponents({});
			}
		})();
		return () => { active = false; };
	}, []);
	return (
		<>
			{gaId && (
				<>
					<script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`,
						}}
					/>
				</>
			)}
			{components?.Analytics ? <components.Analytics /> : null}
			{components?.SpeedInsights ? <components.SpeedInsights /> : null}
		</>
	);
}