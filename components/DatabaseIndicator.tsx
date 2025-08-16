"use client";

import React from "react";
import { databaseManager } from "@/lib/database/DatabaseManager";
import { Database, Wifi, WifiOff, Activity } from "lucide-react";

interface DatabaseIndicatorProps {
	className?: string;
}

export default function DatabaseIndicator({ className = "" }: DatabaseIndicatorProps) {
	const [status, setStatus] = React.useState<{
		name: string;
		type: string;
		isActive: boolean;
		isConnected: boolean;
	} | null>(null);

	React.useEffect(() => {
		try {
			const active = databaseManager.getActiveConnection();
			if (active) {
				setStatus({ name: active.name, type: active.type, isActive: active.isActive, isConnected: active.isConnected });
			} else {
				setStatus(null);
			}
		} catch {
			setStatus(null);
		}
	}, []);

	const color = !status ? "bg-gray-300 text-gray-700" : status.isConnected ? "bg-emerald-100 text-emerald-700 ring-emerald-200" : "bg-amber-100 text-amber-700 ring-amber-200";
	const Icon = !status ? Database : status.isConnected ? Wifi : WifiOff;
	const label = !status ? "بدون قاعدة بيانات" : status.isConnected ? `قاعدة البيانات: ${status.name}` : `غير متصل: ${status.name}`;

	return (
		<div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ring-1 ${color} ${className}`} title={label} aria-live="polite">
			<Icon className="w-3.5 h-3.5" />
			<span className="text-xs font-medium" dir="rtl">{label}</span>
			<Activity className="w-3 h-3 opacity-60" />
		</div>
	);
}