"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AIContentAssistant from "@/components/admin/AIContentAssistant";
import { Sparkles } from "lucide-react";

interface AIGenerateButtonProps {
	label?: string;
	mode: "title" | "description" | "seo" | "keywords" | "content" | "social" | "email";
	language?: "ar" | "en" | "both";
	context?: string;
	onApply: (value: string) => void;
}

export default function AIGenerateButton({ label = "توليد بالذكاء الاصطناعي", mode, language = "ar", context = "", onApply }: AIGenerateButtonProps) {
	const [open, setOpen] = React.useState(false);
	return (
		<>
			<Button type="button" variant="outline" size="sm" onClick={()=> setOpen(true)} className="inline-flex items-center gap-1">
				<Sparkles className="w-4 h-4" /> {label}
			</Button>
			{open && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<Card className="w-full max-w-2xl">
						<CardHeader>
							<CardTitle>مساعد الذكاء الاصطناعي</CardTitle>
						</CardHeader>
						<CardContent>
							<AIContentAssistant
								mode={mode}
								language={language}
								context={context}
								onGenerate={(g)=> { const val = typeof g === 'string' ? g : g.ar; onApply(val); setOpen(false); }}
								onClose={()=> setOpen(false)}
							/>
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}