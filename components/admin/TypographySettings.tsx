"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/hooks/useTheme";

export default function TypographySettings() {
	const { theme, setCustomization } = useTheme() as any;
	const [font, setFont] = React.useState('Tajawal');
	const [base, setBase] = React.useState(16);
	const [scale, setScale] = React.useState(1.2);

	React.useEffect(()=>{
		// load from CSS variables if needed
	},[]);

	const apply = () => {
		document.documentElement.style.setProperty('--font-base', `${base}px`);
		document.documentElement.style.setProperty('--font-scale', `${scale}`);
		document.body.style.fontFamily = font;
		setCustomization?.({});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle dir="rtl">إعدادات الخطوط والأحجام</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4" dir="rtl">
				<div>
					<Label>الخط</Label>
					<Select onValueChange={setFont}>
						<SelectTrigger><SelectValue placeholder="اختر الخط" /></SelectTrigger>
						<SelectContent>
							<SelectItem value="Tajawal">Tajawal</SelectItem>
							<SelectItem value="Inter">Inter</SelectItem>
							<SelectItem value="Cairo">Cairo</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<Label>الحجم الأساسي (px)</Label>
					<Input type="number" value={base} onChange={(e)=> setBase(Number(e.target.value||16))} />
				</div>
				<div>
					<Label>مقياس السلم (1.1 - 1.5)</Label>
					<Input type="number" step="0.05" value={scale} onChange={(e)=> setScale(Number(e.target.value||1.2))} />
				</div>
				<div className="md:col-span-3">
					<button onClick={apply} className="px-4 py-2 rounded bg-blue-600 text-white">تطبيق</button>
				</div>
				<div className="md:col-span-3">
					<div className="text-sm text-gray-600">معاينة:</div>
					<h1 className="text-3xl font-bold">عنوان كبير</h1>
					<p className="mt-2">نص فقرة اعتيادي لقياس الخط والتباعد.</p>
				</div>
			</CardContent>
		</Card>
	);
}