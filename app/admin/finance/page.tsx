"use client";

import React from "react";
import SoftUIDashboard from "@/components/dashboard/SoftUIDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DollarSign, Receipt, ArrowDownCircle } from "lucide-react";

export default function FinancePage() {
	const [invoices, setInvoices] = React.useState<any[]>([]);
	const [expenses, setExpenses] = React.useState<any[]>([]);
	const [inv, setInv] = React.useState({ customer:"", amount:"", note:"" });
	const [exp, setExp] = React.useState({ vendor:"", amount:"", note:"" });

	const load = React.useCallback(async () => {
		const res = await fetch('/api/admin/finance', { cache: 'no-store' });
		const data = await res.json();
		setInvoices(data?.data?.invoices || []);
		setExpenses(data?.data?.expenses || []);
	}, []);

	React.useEffect(() => { load(); }, [load]);

	const saveInvoice = async () => {
		const payload = { kind:'invoice', item: { customer: inv.customer, amount: Number(inv.amount||0), note: inv.note, status:'unpaid' } };
		await fetch('/api/admin/finance', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
		setInv({ customer:"", amount:"", note:"" });
		load();
	};
	const saveExpense = async () => {
		const payload = { kind:'expense', item: { vendor: exp.vendor, amount: Number(exp.amount||0), note: exp.note, category:'general' } };
		await fetch('/api/admin/finance', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
		setExp({ vendor:"", amount:"", note:"" });
		load();
	};

	const totalInvoices = invoices.reduce((s, r) => s + (r.amount||0), 0);
	const totalExpenses = expenses.reduce((s, r) => s + (r.amount||0), 0);
	const net = totalInvoices - totalExpenses;

	return (
		<SoftUIDashboard>
			<div className="space-y-6" dir="rtl">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-emerald-700"><DollarSign className="w-5 h-5" /> إجمالي الفواتير: {totalInvoices.toLocaleString()} ر.س</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-rose-700"><ArrowDownCircle className="w-5 h-5" /> إجمالي المصروفات: {totalExpenses.toLocaleString()} ر.س</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-blue-700"><Receipt className="w-5 h-5" /> الصافي: {net.toLocaleString()} ر.س</CardTitle>
						</CardHeader>
					</Card>
				</div>

				<Tabs defaultValue="invoices">
					<TabsList>
						<TabsTrigger value="invoices">فواتير</TabsTrigger>
						<TabsTrigger value="expenses">مصروفات</TabsTrigger>
					</TabsList>
					<TabsContent value="invoices">
						<Card>
							<CardHeader><CardTitle>إضافة فاتورة</CardTitle></CardHeader>
							<CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
								<div><Label>العميل</Label><Input value={inv.customer} onChange={(e)=> setInv({...inv, customer:e.target.value})} /></div>
								<div><Label>المبلغ</Label><Input type="number" value={inv.amount} onChange={(e)=> setInv({...inv, amount:e.target.value})} /></div>
								<div className="md:col-span-2"><Label>ملاحظة</Label><Input value={inv.note} onChange={(e)=> setInv({...inv, note:e.target.value})} /></div>
								<div className="col-span-full flex justify-end"><Button onClick={saveInvoice}>حفظ</Button></div>
							</CardContent>
						</Card>
						<Card className="mt-4">
							<CardHeader><CardTitle>سجل الفواتير</CardTitle></CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
									{invoices.map((r)=> (
										<div key={r.id} className="p-3 rounded border bg-white">
											<div className="font-bold">{r.customer}</div>
											<div className="text-sm text-gray-600">{(r.amount||0).toLocaleString()} ر.س</div>
											<div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString('ar-SA')}</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="expenses">
						<Card>
							<CardHeader><CardTitle>إضافة مصروف</CardTitle></CardHeader>
							<CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
								<div><Label>المورد</Label><Input value={exp.vendor} onChange={(e)=> setExp({...exp, vendor:e.target.value})} /></div>
								<div><Label>المبلغ</Label><Input type="number" value={exp.amount} onChange={(e)=> setExp({...exp, amount:e.target.value})} /></div>
								<div className="md:col-span-2"><Label>ملاحظة</Label><Input value={exp.note} onChange={(e)=> setExp({...exp, note:e.target.value})} /></div>
								<div className="col-span-full flex justify-end"><Button onClick={saveExpense}>حفظ</Button></div>
							</CardContent>
						</Card>
						<Card className="mt-4">
							<CardHeader><CardTitle>سجل المصروفات</CardTitle></CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
									{expenses.map((r)=> (
										<div key={r.id} className="p-3 rounded border bg-white">
											<div className="font-bold">{r.vendor}</div>
											<div className="text-sm text-gray-600">{(r.amount||0).toLocaleString()} ر.س</div>
											<div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString('ar-SA')}</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* mini bar chart */}
				<Card>
					<CardHeader><CardTitle>لمحة سريعة</CardTitle></CardHeader>
					<CardContent>
						<div className="grid grid-cols-12 gap-2 items-end h-32">
							{[...Array(12)].map((_,i)=>{
								const mInv = invoices.filter((r)=> new Date(r.createdAt).getMonth()===i).reduce((s,r)=> s+(r.amount||0),0);
								const mExp = expenses.filter((r)=> new Date(r.createdAt).getMonth()===i).reduce((s,r)=> s+(r.amount||0),0);
								const invTotals = Array.from({length:12},(_,k)=> invoices.filter((r)=> new Date(r.createdAt).getMonth()===k).reduce((s,r)=> s+(r.amount||0),0));
								const expTotals = Array.from({length:12},(_,k)=> expenses.filter((r)=> new Date(r.createdAt).getMonth()===k).reduce((s,r)=> s+(r.amount||0),0));
								const max = Math.max(...invTotals, ...expTotals);
								return (
									<div key={i} className="flex flex-col items-center gap-1">
										<div className="w-3 bg-emerald-500" style={{ height: `${max? (mInv/max*100):0}%` }} />
										<div className="w-3 bg-rose-500" style={{ height: `${max? (mExp/max*100):0}%` }} />
										<div className="text-[10px] text-gray-500">{i+1}</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>
		</SoftUIDashboard>
	);
}