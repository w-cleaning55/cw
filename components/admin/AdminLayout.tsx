import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../hooks/useTranslation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  Bell,
  Briefcase,
  MessageSquare,
  Shield,
  Database,
  Globe,
  Menu,
  X,
  ChevronLeft,
  LogOut,
  Calendar,
  TrendingUp,
  Palette,
  Bot,
  Crown,
} from "lucide-react";

const adminNavItems = [
  {
    title: "Dashboard",
    titleAr: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Business Owner Dashboard",
    titleAr: "لوحة صاحب البيزنس",
    href: "/admin/owner-dashboard",
    icon: Crown,
  },
  {
    title: "Business Notifications",
    titleAr: "إشعارات البيزنس",
    href: "/admin/business-notifications",
    icon: Bell,
  },
  {
    title: "Bookings",
    titleAr: "الحجوزات",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    title: "Customers",
    titleAr: "العملاء",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Services",
    titleAr: "ال��دمات",
    href: "/admin/services",
    icon: Briefcase,
  },
  {
    title: "Company Settings",
    titleAr: "إعدادات الشركة",
    href: "/admin/company-settings",
    icon: Settings,
  },
  {
    title: "Content Management",
    titleAr: "إدارة المحتوى",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Analytics",
    titleAr: "التحليلات",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Advanced Charts",
    titleAr: "الرسوم المتقدمة",
    href: "/admin/advanced-charts",
    icon: TrendingUp,
  },
  {
    title: "Report Generator",
    titleAr: "مولد التقارير",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Messages",
    titleAr: "الرسائل",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Notifications",
    titleAr: "الإشعارات",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Database Config",
    titleAr: "إعدادات قاعدة البيانات",
    href: "/admin/database",
    icon: Database,
  },
  {
    title: "Color Palettes",
    titleAr: "باليتات الألوان",
    href: "/admin/color-palettes",
    icon: Palette,
  },
  {
    title: "AI Settings",
    titleAr: "إعدادات الذكاء الاصطن��عي",
    href: "/admin/ai-settings",
    icon: Bot,
  },
  {
    title: "SEO & Analytics",
    titleAr: "السيو والتحليلات",
    href: "/admin/seo",
    icon: TrendingUp,
  },
  {
    title: "Internationalization",
    titleAr: "اللغات",
    href: "/admin/i18n",
    icon: Globe,
  },
  {
    title: "Security",
    titleAr: "الأمان",
    href: "/admin/security",
    icon: Shield,
  },
  {
    title: "System Settings",
    titleAr: "إعدادات النظام",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const { t, currentLanguage } = useTranslation();

  const isArabic = currentLanguage === "ar";

  const isActiveRoute = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex"
            >
              <ChevronLeft
                className={cn(
                  "w-4 h-4 transition-transform",
                  sidebarCollapsed && "rotate-180",
                )}
              />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActiveRoute(item.href, item.exact)
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                sidebarCollapsed && "justify-center",
              )}
              title={
                sidebarCollapsed
                  ? isArabic
                    ? item.titleAr
                    : item.title
                  : undefined
              }
            >
              <item.icon
                className={cn("w-5 h-5", !sidebarCollapsed && "mr-3")}
              />
              {!sidebarCollapsed && (
                <span>{isArabic ? item.titleAr : item.title}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
              sidebarCollapsed && "justify-center",
            )}
            title={sidebarCollapsed ? "Back to Website" : undefined}
          >
            <LogOut className={cn("w-5 h-5", !sidebarCollapsed && "mr-3")} />
            {!sidebarCollapsed && <span>Back to Website</span>}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64",
        )}
      >
        {/* Top bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage your application settings and data
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {isArabic ? "لوحة الإدارة" : "Admin Panel"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
