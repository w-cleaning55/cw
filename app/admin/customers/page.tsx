'use client';

import dynamic from "next/dynamic";
import { Phone, Mail, MapPin, Star } from "lucide-react";

const SoftUIDashboard = dynamic(() => import("../../../components/dashboard/SoftUIDashboard"), { ssr: false });
const SoftUITable = dynamic(() => import("../../../components/dashboard/SoftUITable"), { ssr: false });
const SoftUICard = dynamic(() => import("../../../components/dashboard/SoftUICard"), { ssr: false });

export default function CustomersPage() {
  const customers = [
    {
      id: 1,
      name: "أحمد محمد الأحمدي",
      email: "ahmed@example.com",
      phone: "0501234567",
      location: "الرياض",
      totalOrders: 12,
      totalSpent: 3400,
      rating: 4.8,
      lastOrder: "2024-01-15",
      status: "نشط"
    },
    {
      id: 2,
      name: "فاطمة عبدالله",
      email: "fatima@example.com", 
      phone: "0509876543",
      location: "جدة",
      totalOrders: 8,
      totalSpent: 2100,
      rating: 5.0,
      lastOrder: "2024-01-10",
      status: "نشط"
    },
    {
      id: 3,
      name: "محمد العتيبي",
      email: "mohammed@example.com",
      phone: "0505555555",
      location: "الدمام",
      totalOrders: 15,
      totalSpent: 4200,
      rating: 4.9,
      lastOrder: "2024-01-12",
      status: "VIP"
    },
    {
      id: 4,
      name: "نورا السالم",
      email: "nora@example.com",
      phone: "0502222222",
      location: "الرياض",
      totalOrders: 5,
      totalSpent: 1500,
      rating: 4.6,
      lastOrder: "2024-01-08",
      status: "نشط"
    },
    {
      id: 5,
      name: "خالد المطيري",
      email: "khalid@example.com",
      phone: "0507777777",
      location: "مكة",
      totalOrders: 20,
      totalSpent: 6800,
      rating: 4.9,
      lastOrder: "2024-01-14",
      status: "VIP"
    }
  ];

  const columns = [
    {
      key: "name",
      label: "اسم العميل",
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {value.charAt(0)}
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
      render: (value: any, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{row.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{row.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600" dir="rtl">{row.location}</span>
          </div>
        </div>
      )
    },
    {
      key: "orders",
      label: "الطلبات",
      render: (value: any, row: any) => (
        <div className="text-center">
          <div className="text-xl font-bold text-blue-600">{row.totalOrders}</div>
          <div className="text-sm text-gray-500" dir="rtl">طلب مكتمل</div>
        </div>
      )
    },
    {
      key: "spent",
      label: "إجمالي الإنفاق",
      render: (value: any, row: any) => (
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{row.totalSpent.toLocaleString()} ريال</div>
          <div className="text-sm text-gray-500" dir="rtl">القيمة الإجمالية</div>
        </div>
      )
    },
    {
      key: "rating",
      label: "التقييم",
      render: (value: any, row: any) => (
        <div className="flex items-center justify-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-medium text-gray-900">{row.rating}</span>
        </div>
      )
    },
    {
      key: "status",
      label: "الحالة",
      render: (value: string) => (
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            value === "VIP" 
              ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
              : value === "نشط"
              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
              : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
          }`}>
            {value}
          </span>
        </div>
      )
    }
  ];

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
              <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
              <div className="text-sm text-gray-600" dir="rtl">إجمالي العملاء</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3">
                ⭐
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {customers.filter(c => c.status === "VIP").length}
              </div>
              <div className="text-sm text-gray-600" dir="rtl">عملاء VIP</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3">
                💰
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600" dir="rtl">إجمالي الإيرادات</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3">
                📊
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {(customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600" dir="rtl">متوسط التقييم</div>
            </div>
          </SoftUICard>
        </div>

        {/* Customers Table */}
        <SoftUITable
          title="قائمة العملاء"
          data={customers}
          columns={columns}
        />
      </div>
    </SoftUIDashboard>
  );
}
