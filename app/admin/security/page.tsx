"use client";

import React from "react";
import SoftUIDashboard from "@/components/dashboard/SoftUIDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecurityPage() {
	const [retention, setRetention] = React.useState(5);
	const [schedule, setSchedule] = React.useState('daily');

	const backupNow = async () => {
		await fetch('/api/admin/site-content', { method:'GET' }); // placeholder call
	};

	const restoreFromFile = async () => {
		// Placeholder for restore action
	};

	return (
		<SoftUIDashboard>
			<div className="space-y-6" dir="rtl">
				<Card>
					<CardHeader>
						<CardTitle>النسخ الاحتياطي والاستعادة</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="md:col-span-3">
							<Button onClick={backupNow}>إنشاء نسخة احتياطية الآن</Button>
						</div>
						<div>
							<Label>جدولة النسخ</Label>
							<select className="w-full border rounded p-2" value={schedule} onChange={(e)=> setSchedule(e.target.value)}>
								<option value="daily">يومي</option>
								<option value="weekly">أسبوعي</option>
								<option value="monthly">شهري</option>
							</select>
						</div>
						<div>
							<Label>عدد النسخ المحفوظة</Label>
							<Input type="number" value={retention} onChange={(e)=> setRetention(Number(e.target.value||5))} />
						</div>
						<div className="md:col-span-3">
							<Label>استعادة</Label>
							<div className="flex items-center gap-2">
								<Input type="file" />
								<Button onClick={restoreFromFile}>استعادة</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</SoftUIDashboard>
	);
}
