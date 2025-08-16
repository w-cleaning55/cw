"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";

interface TestimonialInput { name?: string; rating?: number; comment?: string; service?: string; }

export default function TestimonialsSectionCarousel({ className = "", title, subtitle, items = [] as TestimonialInput[] }: any) {
	const [idx, setIdx] = React.useState(0);
	const data = items.length ? items : [
		{ name: 'عميل', rating: 5, comment: 'خدمة رائعة', service: 'تنظيف' },
		{ name: 'عميلة', rating: 5, comment: 'نتائج ممتازة', service: 'جلي رخام' },
	];
	const next = () => setIdx((p)=> (p+1)%data.length);
	const prev = () => setIdx((p)=> (p-1+data.length)%data.length);
	const t = data[idx];
	return (
		<section className={`py-16 ${className}`}>
			<div className="max-w-4xl mx-auto px-4 text-center">
				<h2 className="text-2xl md:text-3xl font-bold mb-2" dir="rtl">{title || 'آراء العملاء'}</h2>
				{subtitle && <p className="text-gray-600 mb-6" dir="rtl">{subtitle}</p>}
				<div className="relative">
					<button onClick={prev} className="absolute right-0 top-1/2 -translate-y-1/2 p-2"><ChevronRight className="w-5 h-5" /></button>
					<button onClick={next} className="absolute left-0 top-1/2 -translate-y-1/2 p-2"><ChevronLeft className="w-5 h-5" /></button>
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-center mb-2">
								{Array.from({length: t.rating||5}).map((_,i)=> <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
							</div>
							<p className="text-gray-700 mb-2" dir="rtl">"{t.comment}"</p>
							<div className="text-sm text-gray-600" dir="rtl">{t.name} • {t.service}</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}