"use client";

import React, { useState } from "react";
import {
  Home, 
  Users, 
  Calendar, 
  Settings, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  Bell, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuth } from "../../hooks/useAuth";

interface SidebarItem {
  id: string;
  label: string;
  labelAr: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export default function Sidebar({ isOpen, onToggle, className }: SidebarProps) {
  const { currentLanguage } = useTranslation();
  const { logout, user } = useAuth();
  const isRTL = currentLanguage === "ar";

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      labelAr: "لوحة التحكم",
      icon: Home,
      href: "/admin",
    },
    {
      id: "users",
      label: "Users",
      labelAr: "المستخدمين",
      icon: Users,
      href: "/admin/users",
      badge: 1247,
    },
    {
      id: "bookings",
      label: "Bookings",
      labelAr: "الحجوزات",
      icon: Calendar,
      href: "/admin/bookings",
      badge: 892,
    },
    {
      id: "analytics",
      label: "Analytics",
      labelAr: "التحليلات",
      icon: BarChart3,
      href: "/admin/analytics",
    },
    {
      id: "reports",
      label: "Reports",
      labelAr: "التقارير",
      icon: FileText,
      href: "/admin/reports",
    },
    {
      id: "messages",
      label: "Messages",
      labelAr: "الرسائل",
      icon: MessageSquare,
      href: "/admin/messages",
      badge: 23,
    },
    {
      id: "notifications",
      label: "Notifications",
      labelAr: "الإشعارات",
      icon: Bell,
      href: "/admin/notifications",
      badge: 5,
    },
    {
      id: "settings",
      label: "Settings",
      labelAr: "الإعدادات",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  const formatNumber = (num: number) => {
    if (isRTL) {
      // Convert to Arabic numerals
      return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    }
    return num.toString();
  };

  const getLabel = (item: SidebarItem) => {
    return isRTL ? item.labelAr : item.label;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
        ${isRTL ? 'right-0' : 'left-0'}
        ${isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        w-64 lg:translate-x-0 lg:static lg:z-auto
        ${className || ''}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isRTL ? "لوحة التحكم" : "Admin Panel"}
              </h2>
              <p className="text-xs text-gray-500">
                {isRTL ? "إدارة النظام" : "System Management"}
              </p>
            </div>
    </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            title={isRTL ? "إغلاق" : "Close"}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || user?.email || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role || "Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    hover:bg-blue-50 hover:text-blue-700
                    ${window.location.pathname === item.href 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700'
                    }
                    ${isRTL ? 'text-right' : 'text-left'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{getLabel(item)}</span>
                  </div>
                  
                  {item.badge && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {formatNumber(item.badge)}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className={`
              flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600
              hover:bg-red-50 transition-colors
              ${isRTL ? 'text-right' : 'text-left'}
            `}
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5" />
              <span>{isRTL ? "تسجيل الخروج" : "Logout"}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          fixed top-4 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg
          lg:hidden transition-all duration-300
          ${isRTL ? 'right-4' : 'left-4'}
        `}
        title={isRTL ? "القائمة" : "Menu"}
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
    </>
  );
}
