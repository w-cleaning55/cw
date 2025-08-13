"use client";

import React, { useState } from "react";
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  Calendar,
  MessageSquare,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  User,
  Activity
} from "lucide-react";
import SoftUICard from "./SoftUICard";
import SoftUIButton from "./SoftUIButton";

interface SoftUIDashboardProps {
  children?: React.ReactNode;
}

const SoftUIDashboard: React.FC<SoftUIDashboardProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { icon: <Home className="w-5 h-5" />, label: "لوحة التحكم", href: "/admin", active: true },
    { icon: <BarChart3 className="w-5 h-5" />, label: "التحليلات", href: "/admin/analytics" },
    { icon: <Users className="w-5 h-5" />, label: "العملاء", href: "/admin/customers" },
    { icon: <Calendar className="w-5 h-5" />, label: "المواعيد", href: "/admin/bookings" },
    { icon: <MessageSquare className="w-5 h-5" />, label: "الرسائل", href: "/admin/messages" },
    { icon: <Settings className="w-5 h-5" />, label: "الإعدادات", href: "/admin/settings" }
  ];

  const stats = [
    {
      title: "إجمالي العملاء",
      value: "2,850",
      change: "+12%",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "الإيرادات الشهرية",
      value: "45,200 ريال",
      change: "+8%",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "المشاريع المكتملة",
      value: "156",
      change: "+15%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "معدل الرضا",
      value: "98.5%",
      change: "+2%",
      icon: <Activity className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="h-full bg-white/70 backdrop-blur-lg border-r border-white/20">
          {/* Logo */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                🧽
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  عالم النظافة
                </h2>
                <p className="text-sm text-gray-500" dir="rtl">لوحة التحكم</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
            {sidebarItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/50 hover:text-blue-600'
                }`}
                dir="rtl"
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="md:ml-64 relative z-10">
        {/* Top header */}
        <header className="bg-white/70 backdrop-blur-lg border-b border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-2xl font-bold text-gray-900" dir="rtl">
                مرحباً بك في لوحة التحكم
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث..."
                  className="pl-10 pr-4 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-right"
                  dir="rtl"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-right hidden sm:block">
                  <div className="font-medium text-gray-900">المدير</div>
                  <div className="text-sm text-gray-500">admin@cw.com.sa</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <SoftUICard key={index} variant="glass" className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-3xl`}></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div className="text-green-500 text-sm font-semibold">
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-right" dir="rtl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                  </div>
                </div>
              </SoftUICard>
            ))}
          </div>

          {/* Chart section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <SoftUICard variant="glass">
              <h3 className="text-xl font-bold text-gray-900 mb-4" dir="rtl">
                الإيرادات الشهرية
              </h3>
              <div className="h-64 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600" dir="rtl">رسم بياني للإيرادات</p>
                </div>
              </div>
            </SoftUICard>

            <SoftUICard variant="glass">
              <h3 className="text-xl font-bold text-gray-900 mb-4" dir="rtl">
                نشاط العملاء
              </h3>
              <div className="space-y-4">
                {[
                  { name: "أحمد محمد", action: "طلب خدمة تنظيف", time: "قبل 5 دقائق" },
                  { name: "فاطمة الأحمدي", action: "أكمل الدفع", time: "قبل 15 دقيقة" },
                  { name: "محمد العتيبي", action: "قيّم الخدمة 5 نجوم", time: "قبل 30 دقيقة" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/30 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                      {activity.name.charAt(0)}
                    </div>
                    <div className="flex-1 text-right" dir="rtl">
                      <div className="font-medium text-gray-900">{activity.name}</div>
                      <div className="text-sm text-gray-600">{activity.action}</div>
                    </div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </SoftUICard>
          </div>

          {/* Quick actions */}
          <SoftUICard variant="gradient">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4" dir="rtl">
                إجراءات سريعة
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                <SoftUIButton variant="primary" icon={<Users className="w-4 h-4" />}>
                  إضافة عميل جديد
                </SoftUIButton>
                <SoftUIButton variant="secondary" icon={<Calendar className="w-4 h-4" />}>
                  جدولة موعد
                </SoftUIButton>
                <SoftUIButton variant="glass" icon={<BarChart3 className="w-4 h-4" />}>
                  عرض التقارير
                </SoftUIButton>
              </div>
            </div>
          </SoftUICard>

          {/* Custom content */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default SoftUIDashboard;
