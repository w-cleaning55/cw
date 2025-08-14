"use client";

import React from "react";
import { useTheme, useDarkMode } from "@/hooks/useTheme";
import { Moon, Sun, Droplets, Leaf } from "lucide-react";

interface QuickThemeSwitcherProps {
	className?: string;
}

export default function QuickThemeSwitcher({ className = "" }: QuickThemeSwitcherProps) {
	const { setCurrentTheme } = useTheme();
	const { setDarkMode } = useDarkMode();

	return (
		<div className={`flex items-center gap-2 ${className}`} aria-label="Theme controls">
			<button
				onClick={() => { setCurrentTheme("steelGray"); setDarkMode(true); }}
				className="p-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
				title="داكن"
				aria-label="تفعيل الثيم الداكن"
			>
				<Moon className="w-4 h-4" />
			</button>
			<button
				onClick={() => { setCurrentTheme("steelGray"); setDarkMode(false); }}
				className="p-2 rounded-md bg-white text-gray-900 border hover:bg-gray-50 transition-colors"
				title="فاتح"
				aria-label="تفعيل الثيم الفاتح"
			>
				<Sun className="w-4 h-4" />
			</button>
			<button
				onClick={() => { setCurrentTheme("oceanBlue"); setDarkMode(false); }}
				className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
				title="مزرق"
				aria-label="تفعيل الثيم المزرق"
			>
				<Droplets className="w-4 h-4" />
			</button>
			<button
				onClick={() => { setCurrentTheme("forestGreen"); setDarkMode(false); }}
				className="p-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
				title="مخضر"
				aria-label="تفعيل الثيم المخضر"
			>
				<Leaf className="w-4 h-4" />
			</button>
		</div>
	);
}