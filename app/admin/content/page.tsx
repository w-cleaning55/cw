"use client";

import React from "react";
import SoftUIDashboard from "@/components/dashboard/SoftUIDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AIContentAssistant from "@/components/admin/AIContentAssistant";
import { Save, Sparkles } from "lucide-react";

export default function ContentStudioPage() {
	const [caption, setCaption] = React.useState("");
	const [topic, setTopic] = React.useState("نتائج تنظيف السجاد");
	const [showAI, setShowAI] = React.useState(false);
	const [saving, setSaving] = React.useState(false);

	const saveDraft = async () => {
		try {
			setSaving(true);
			await fetch('/api/admin/site-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'social', topic, caption, createdAt: new Date().toISOString() })});
		} finally {
			setSaving(false);
		}
	};

	return (
		<SoftUIDashboard>
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2" dir="rtl">استديو محتوى السوشيال</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3" dir="rtl">
						<div>
							<label className="text-sm">الموضوع</label>
							<input className="w-full border rounded p-2" value={topic} onChange={(e)=> setTopic(e.target.value)} />
						</div>
						<div>
							<label className="text-sm">النص/الكابشن</label>
							<Textarea rows={6} value={caption} onChange={(e)=> setCaption(e.target.value)} placeholder="اكتب النص هنا..." />
						</div>
						<div className="flex items-center gap-2 justify-end">
							<Button variant="outline" onClick={()=> setShowAI(true)}><Sparkles className="w-4 h-4 mr-1" /> توليد بالذكاء الاصطناعي</Button>
							<Button onClick={saveDraft} disabled={saving}><Save className="w-4 h-4 mr-1" /> حفظ كمسودة</Button>
						</div>
					</CardContent>
				</Card>

				{showAI && (
					<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
						<Card className="w-full max-w-2xl">
							<CardHeader>
								<CardTitle>مساعد المحتوى</CardTitle>
							</CardHeader>
							<CardContent>
								<AIContentAssistant
									mode="social"
									language="ar"
									context={topic}
									onGenerate={(g)=> { if (typeof g === 'string') setCaption(g); else setCaption(g.ar); setShowAI(false); }}
									onClose={()=> setShowAI(false)}
								/>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</SoftUIDashboard>
	);
}
