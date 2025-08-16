"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { CalendarDays, Plus, Save, X } from "lucide-react";

interface CalendarEvent {
	id: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:mm
	title: string;
	customer?: string;
	phone?: string;
	service?: string;
	status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

interface BookingCalendarProps {
	className?: string;
}

function formatDate(d: Date) {
	return d.toISOString().split("T")[0];
}

function startOfMonth(d: Date) {
	return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
	return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export default function BookingCalendar({ className = "" }: BookingCalendarProps) {
	const [current, setCurrent] = React.useState(new Date());
	const [events, setEvents] = React.useState<CalendarEvent[]>([]);
	const [modalOpen, setModalOpen] = React.useState(false);
	const [draft, setDraft] = React.useState<Partial<CalendarEvent>>({});

	const days: Date[] = React.useMemo(() => {
		const start = startOfMonth(current);
		const end = endOfMonth(current);
		const arr: Date[] = [];
		const prefix = start.getDay();
		for (let i = 0; i < prefix; i++) arr.push(new Date(start.getFullYear(), start.getMonth(), start.getDate() - (prefix - i)));
		for (let day = 1; day <= end.getDate(); day++) arr.push(new Date(current.getFullYear(), current.getMonth(), day));
		const suffix = 42 - arr.length;
		for (let i = 1; i <= suffix; i++) arr.push(new Date(end.getFullYear(), end.getMonth(), end.getDate() + i));
		return arr;
	}, [current]);

	React.useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/admin/bookings", { cache: "no-store" });
				const data = await res.json();
				if (Array.isArray(data)) {
					const mapped: CalendarEvent[] = data.map((b: any) => ({ id: b.id, date: b.date, time: b.time || "09:00", title: b.service, customer: b.customerName, phone: b.customerPhone, service: b.service, status: b.status }));
					setEvents(mapped);
				}
			} catch {}
		})();
	}, []);

	const openCreate = (date: string) => {
		setDraft({ date, time: "10:00", status: 'pending' });
		setModalOpen(true);
	};

	const saveBooking = async () => {
		try {
			const payload = {
				customerName: draft.customer || "عميل",
				customerEmail: "",
				customerPhone: draft.phone || "",
				service: draft.service || draft.title || "موعد",
				serviceType: "residential",
				date: draft.date!,
				time: draft.time || "10:00",
				address: "",
				notes: "",
				status: draft.status || 'pending',
				price: 0,
				paymentStatus: 'pending'
			};
			const res = await fetch('/api/admin/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
			const data = await res.json();
			if (data?.booking) {
				setEvents((prev) => [...prev, { id: data.booking.id, date: data.booking.date, time: data.booking.time, title: data.booking.service, customer: data.booking.customerName, phone: data.booking.customerPhone, service: data.booking.service, status: data.booking.status }]);
			}
		} finally {
			setModalOpen(false);
		}
	};

	const moveEvent = async (id: string, newDate: string) => {
		const ev = events.find(e => e.id === id);
		if (!ev) return;
		setEvents(prev => prev.map(e => e.id === id ? { ...e, date: newDate } : e));
		await fetch('/api/admin/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, date: newDate }) });
	};

	const onDropDay = async (e: React.DragEvent<HTMLDivElement>, date: string) => {
		e.preventDefault();
		const id = e.dataTransfer.getData('text/plain');
		if (id) await moveEvent(id, date);
	};

	return (
		<Card className={className}>
			<div className="flex items-center justify-between p-4 border-b" dir="rtl">
				<h3 className="font-bold text-gray-900 flex items-center gap-2"><CalendarDays className="w-5 h-5" /> تقويم الحجوزات</h3>
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth()-1, 1))}>{"<"}</Button>
					<div className="px-3">{current.getFullYear()} / {current.getMonth()+1}</div>
					<Button variant="outline" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth()+1, 1))}>{">"}</Button>
				</div>
			</div>
			<CardContent className="p-4">
				<div className="grid grid-cols-7 gap-2 select-none">
					{days.map((d, idx) => {
						const dateStr = formatDate(d);
						const inMonth = d.getMonth() === current.getMonth();
						const dayEvents = events.filter(e => e.date === dateStr);
						return (
							<div key={idx} onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDropDay(e, dateStr)} className={`min-h-[110px] rounded-lg border p-2 ${inMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}`}>
								<div className="flex items-center justify-between mb-2">
									<button onClick={()=> openCreate(dateStr)} className="text-xs text-blue-600 hover:underline">{d.getDate()}</button>
									<Button size="xs" variant="ghost" onClick={()=> openCreate(dateStr)}><Plus className="w-3 h-3" /></Button>
								</div>
								<div className="space-y-1">
									{dayEvents.map(ev => (
										<div key={ev.id} draggable onDragStart={(e)=> e.dataTransfer.setData('text/plain', ev.id)} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 cursor-move">
											<div className="font-semibold" dir="rtl">{ev.time} - {ev.title}</div>
											<div className="opacity-75" dir="rtl">{ev.customer}</div>
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>

			{modalOpen && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<Card className="w-full max-w-lg">
						<div className="flex items-center justify-between p-4 border-b" dir="rtl">
							<h4 className="font-semibold">موعد جديد</h4>
							<div className="flex items-center gap-2">
								<Button variant="ghost" onClick={()=> setModalOpen(false)}><X className="w-4 h-4" /></Button>
							</div>
						</div>
						<CardContent className="space-y-3 p-4" dir="rtl">
							<div className="grid grid-cols-2 gap-3">
								<div>
									<Label>التاريخ</Label>
									<Input value={draft.date || ''} onChange={(e)=> setDraft(prev=> ({...prev, date: e.target.value}))} type="date" />
								</div>
								<div>
									<Label>الوقت</Label>
									<Input value={draft.time || ''} onChange={(e)=> setDraft(prev=> ({...prev, time: e.target.value}))} type="time" />
								</div>
								<div className="col-span-2">
									<Label>الخدمة</Label>
									<Input value={draft.title || ''} onChange={(e)=> setDraft(prev=> ({...prev, title: e.target.value, service: e.target.value}))} placeholder="مثال: تنظيف منزل" />
								</div>
								<div>
									<Label>العميل</Label>
									<Input value={draft.customer || ''} onChange={(e)=> setDraft(prev=> ({...prev, customer: e.target.value}))} placeholder="اسم العميل" />
								</div>
								<div>
									<Label>الهاتف</Label>
									<Input value={draft.phone || ''} onChange={(e)=> setDraft(prev=> ({...prev, phone: e.target.value}))} placeholder="05xxxxxxxx" />
								</div>
								<div>
									<Label>الحالة</Label>
									<Select onValueChange={(v)=> setDraft(prev=> ({...prev, status: v as any}))}>
										<SelectTrigger><SelectValue placeholder="اختر" /></SelectTrigger>
										<SelectContent>
											<SelectItem value="pending">قيد الانتظار</SelectItem>
											<SelectItem value="confirmed">مؤكد</SelectItem>
											<SelectItem value="completed">مكتمل</SelectItem>
											<SelectItem value="cancelled">ملغي</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="flex items-center justify-end gap-2">
								<Button variant="outline" onClick={()=> setModalOpen(false)}><X className="w-4 h-4 mr-1" /> إغلاق</Button>
								<Button onClick={saveBooking}><Save className="w-4 h-4 mr-1" /> حفظ</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</Card>
	);
}