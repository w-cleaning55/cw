"use client";

import React from "react";
import { Shield, Clock, Award } from "lucide-react";

interface FeatureItemInput { icon?: string; title?: string; description?: string; }

interface FeaturesSectionCompactProps {
	className?: string;
	title?: string;
	subtitle?: string;
	items?: FeatureItemInput[];
}

const iconMap: Record<string, JSX.Element> = {
	shield: <Shield className="w-5 h-5" />,
	clock: <Clock className="w-5 h-5" />,
	award: <Award className="w-5 h-5" />,
};

export default function FeaturesSectionCompact({ className = "", title, subtitle, items = [] }: FeaturesSectionCompactProps) {
	const defaults = [
		{ icon: 'shield', title: 'ضمان 100%', description: '' },
		{ icon: 'clock', title: 'خدمة سريعة', description: '' },
		{ icon: 'award', title: 'جودة عالية', description: '' },
	];
	const data = items.length ? items : defaults;
	return (
		<section className={`py-14 ${className}`}>
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold" dir="rtl">{title || 'لماذا تختارنا؟'}</h2>
					{subtitle && <p className="text-gray-600 mt-1" dir="rtl">{subtitle}</p>}
				</div>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					{data.map((f, i) => (
						<div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-white">
							<div className="text-blue-600">{iconMap[f.icon || 'shield']}</div>
							<div>
								<div className="font-semibold" dir="rtl">{f.title}</div>
								{f.description ? <div className="text-xs text-gray-600" dir="rtl">{f.description}</div> : null}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}