'use client';

import dynamic from "next/dynamic";
import { Phone, Mail, MapPin, Star } from "lucide-react";
import React from "react";

const SoftUIDashboard = dynamic(() => import("../../../components/dashboard/SoftUIDashboard"), { ssr: false });
const SoftUITable = dynamic(() => import("../../../components/dashboard/SoftUITable"), { ssr: false });
const SoftUICard = dynamic(() => import("../../../components/dashboard/SoftUICard"), { ssr: false });

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  totalOrders?: number;
  totalSpent?: number;
  rating?: number;
  status?: string;
}

export default function CustomersPage() {
  const [rows, setRows] = React.useState<CustomerRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/customers", { cache: "no-store" });
        if (!res.ok) throw new Error("فشل تحميل العملاء");
        const data = await res.json();
        if (!active) return;
        const mapped: CustomerRow[] = Array.isArray(data)
          ? data.map((c: any) => ({
              id: c.id,
              name: c.name,
              email: c.email,
              phone: c.phone,
              location: c.city || c.address,
              totalOrders: c.totalBookings,
              totalSpent: c.totalSpent,
              rating: (c as any).rating,
              status: c.status,
            }))
          : [];
        setRows(mapped);
      } catch (e: any) {
        setError(e?.message || "خطأ غير متوقع");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const columns = [
    {
      key: "name",
      label: "اسم العميل",
      render: (value: string, row: CustomerRow) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {value?.charAt(0) || "?"}
          </div>
          <div>
            <div className="font-medium text-gray-900" dir="rtl">{value}</div>
            <div className="text-sm text-gray-500" dir="rtl">ID: {row.id}</div>
          </div>
        </div>
      )
    },
    {
      key: "contact",
      label: "معلومات الاتصال",
      render: (_: any, row: CustomerRow) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{row.email || ""}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{row.phone || ""}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600" dir="rtl">{row.location || ""}</span>
          </div>
        </div>
      )
    },
    {
      key: "orders",
      label: "الطلبات",
      render: (_: any, row: CustomerRow) => (
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{row.totalOrders ?? 0}</div>
          <div className="text-sm text-gray-500" dir="rtl">طلب مكتمل</div>
        </div>
      )
    },
    {
      key: "spent",
      label: "إجمالي الإنفاق",
      render: (_: any, row: CustomerRow) => (
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{(row.totalSpent ?? 0).toLocaleString()} ريال</div>
          <div className="text-sm text-gray-500" dir="rtl">القيمة الإجمالية</div>
        </div>
      )
    },
    {
      key: "rating",
      label: "التقييم",
      render: (_: any, row: CustomerRow) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium text-gray-900">{row.rating ?? "-"}</span>
        </div>
      )
    },
    {
      key: "status",
      label: "الحالة",
      render: (value: string | undefined) => (
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === "vip"
              ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
              : value === "active"
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
          }`}>
            {value ?? ""}
          </span>
        </div>
      )
    }
  ];

  const totalCustomers = rows.length;
  const vipCount = rows.filter((c) => (c.status || "") === "vip").length;
  const totalRevenue = rows.reduce((sum, c) => sum + (c.totalSpent ?? 0), 0);
  const avgRating = rows.length
    ? (rows.reduce((sum, c) => sum + (c.rating ?? 0), 0) / rows.length).toFixed(1)
    : "-";

  return (
    <SoftUIDashboard>
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SoftUICard variant="glass">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3">
                👥
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
              <div className="text-sm text-gray-600" dir="rtl">إجمالي العملاء</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3">
                ⭐
              </div>
              <div className="text-2xl font-bold text-gray-900">{vipCount}</div>
              <div className="text-sm text-gray-600" dir="rtl">عملاء VIP</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3">
                💰
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600" dir="rtl">إجمالي الإيرادات</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3">
                📊
              </div>
              <div className="text-2xl font-bold text-gray-900">{avgRating}</div>
              <div className="text-sm text-gray-600" dir="rtl">متوسط التقييم</div>
            </div>
          </SoftUICard>
        </div>

        {/* Customers Table */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700" dir="rtl">{error}</div>
        )}
        <SoftUITable title="قائمة العملاء" data={rows} columns={columns} loading={loading} />
      </div>
    </SoftUIDashboard>
  );
}
