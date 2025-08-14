"use client";

import React from "react";

interface AboutSectionMinimalProps {
	className?: string;
	title?: string;
	subtitle?: string;
	description?: string;
}

export default function AboutSectionMinimal({ className = "", title, subtitle, description }: AboutSectionMinimalProps) {
	return (
		<section className={`py-16 ${className}`}>
			<div className="max-w-4xl mx-auto px-4 text-center">
				<h2 className="text-2xl md:text-3xl font-bold mb-2" dir="rtl">{title || 'من نحن؟'}</h2>
				{subtitle && <p className="text-gray-700 mb-2" dir="rtl">{subtitle}</p>}
				<p className="text-gray-600" dir="rtl">{description || 'شركة تنظيف محترفة في جدة تقدم خدمات عالية الجودة'}</p>
			</div>
		</section>
	);
}