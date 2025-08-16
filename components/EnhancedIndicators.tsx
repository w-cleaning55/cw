"use client";

import React from "react";
import { Wifi, WifiOff, Gauge, Timer, Sparkles } from "lucide-react";

interface EnhancedIndicatorsProps {
	className?: string;
}

export default function EnhancedIndicators({ className = "" }: EnhancedIndicatorsProps) {
	const [isOnline, setIsOnline] = React.useState(true);
	const [latencyMs, setLatencyMs] = React.useState<number | null>(null);
	const [fps, setFps] = React.useState<number>(60);

	React.useEffect(() => {
		setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
		const onlineHandler = () => setIsOnline(true);
		const offlineHandler = () => setIsOnline(false);
		window.addEventListener("online", onlineHandler);
		window.addEventListener("offline", offlineHandler);
		return () => {
			window.removeEventListener("online", onlineHandler);
			window.removeEventListener("offline", offlineHandler);
		};
	}, []);

	React.useEffect(() => {
		let raf: number;
		let last = performance.now();
		let frames = 0;
		const loop = (now: number) => {
			frames++;
			if (now - last >= 1000) {
				setFps(frames);
				frames = 0;
				last = now;
			}
			raf = requestAnimationFrame(loop);
		};
		rafa = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, []);

	const ping = React.useCallback(async () => {
		try {
			const start = performance.now();
			await fetch("/api/ping", { cache: "no-store" });
			setLatencyMs(Math.round(performance.now() - start));
		} catch {
			setLatencyMs(null);
		}
	}, []);

	React.useEffect(() => {
		ping();
		const id = setInterval(ping, 15000);
		return () => clearInterval(id);
	}, [ping]);

	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<div className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md ${isOnline ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
				{isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
				<span dir="rtl">{isOnline ? "متصل" : "غير متصل"}</span>
			</div>
			<div className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-blue-100 text-blue-700">
				<Timer className="w-3.5 h-3.5" />
				<span dir="rtl">{latencyMs !== null ? `${latencyMs}ms` : "--"}</span>
			</div>
			<div className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-violet-100 text-violet-700">
				<Gauge className="w-3.5 h-3.5" />
				<span dir="rtl">{fps} FPS</span>
			</div>
			<Sparkles className="w-4 h-4 text-yellow-500" />
		</div>
	);
}