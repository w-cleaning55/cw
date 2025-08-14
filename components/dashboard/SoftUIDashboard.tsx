"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Bell, 
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from "lucide-react";
import Sidebar from "../ui/sidebar";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  SortableTableHead,
  TableActions,
  TableActionButton,
  TableToolbar,
  TableSearch,
  TablePagination,
  TableExport,
  TableFilter,
  TableRowActions,
} from "../ui/table";
import { useTranslation } from "../../hooks/useTranslation";

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  growthRate: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
}

interface Booking {
  id: string;
  customerName: string;
  service: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  amount: number;
  paymentStatus: "paid" | "pending" | "failed";
}

export default function SoftUIDashboard({ children }: { children?: React.ReactNode }) {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    growthRate: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "bookings">("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentLanguage } = useTranslation();
  const isRTL = currentLanguage === "ar";

  // Load data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalBookings: 892,
        totalRevenue: 45678,
        growthRate: 12.5,
      });

      setUsers([
        {
          id: "1",
          name: "أحمد محمد",
          email: "ahmed@example.com",
          role: "مدير",
          status: "active",
          lastLogin: "2024-01-15 10:30",
          createdAt: "2023-06-15",
        },
        {
          id: "2",
          name: "فاطمة علي",
          email: "fatima@example.com",
          role: "مشرف",
          status: "active",
          lastLogin: "2024-01-14 15:45",
          createdAt: "2023-08-20",
        },
        {
          id: "3",
          name: "محمد حسن",
          email: "mohammed@example.com",
          role: "مشغل",
          status: "pending",
          lastLogin: "2024-01-10 09:15",
          createdAt: "2024-01-05",
        },
        {
          id: "4",
          name: "سارة أحمد",
          email: "sara@example.com",
          role: "مشغل",
          status: "inactive",
          lastLogin: "2023-12-20 14:20",
          createdAt: "2023-09-10",
        },
        {
          id: "5",
          name: "علي محمود",
          email: "ali@example.com",
          role: "مدير",
          status: "active",
          lastLogin: "2024-01-15 11:00",
          createdAt: "2023-07-01",
        },
      ]);

      setBookings([
        {
          id: "1",
          customerName: "عائلة محمد",
          service: "تنظيف منزل شامل",
          date: "2024-01-20",
          status: "confirmed",
          amount: 450,
          paymentStatus: "paid",
        },
        {
          id: "2",
          customerName: "شركة التقنية المتقدمة",
          service: "تنظيف مكاتب",
          date: "2024-01-22",
          status: "pending",
          amount: 1200,
          paymentStatus: "pending",
        },
        {
          id: "3",
          customerName: "فندق الشرق",
          service: "تنظيف فنادق",
          date: "2024-01-18",
          status: "completed",
          amount: 2800,
          paymentStatus: "paid",
        },
        {
          id: "4",
          customerName: "مطعم الأصالة",
          service: "تنظيف مطاعم",
          date: "2024-01-25",
          status: "cancelled",
          amount: 800,
          paymentStatus: "failed",
        },
        {
          id: "5",
          customerName: "عائلة أحمد",
          service: "تنظيف سجاد",
          date: "2024-01-21",
          status: "confirmed",
          amount: 300,
          paymentStatus: "paid",
        },
      ]);
    }, 1000);
  }, []);

  // Filter and sort data
  const filteredData = (activeTab === "users" ? users : bookings).filter(item => {
    if (activeTab === "users") {
      const user = item as User;
      return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
             user.role.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      const booking = item as Booking;
      return booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    
    let aValue: any, bValue: any;
    
    if (activeTab === "users") {
      const userA = a as User;
      const userB = b as User;
      aValue = userA[sortField as keyof User];
      bValue = userB[sortField as keyof User];
    } else {
      const bookingA = a as Booking;
      const bookingB = b as Booking;
      aValue = bookingA[sortField as keyof Booking];
      bValue = bookingB[sortField as keyof Booking];
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue, 'ar')
        : bValue.localeCompare(aValue, 'ar');
    }

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : sortDirection === "desc" ? null : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { class: "badge-success", text: "نشط" },
      inactive: { class: "badge-error", text: "غير نشط" },
      pending: { class: "badge-warning", text: "في الانتظار" },
      confirmed: { class: "badge-success", text: "مؤكد" },
      cancelled: { class: "badge-error", text: "ملغي" },
      completed: { class: "badge-primary", text: "مكتمل" },
      paid: { class: "badge-success", text: "مدفوع" },
      failed: { class: "badge-error", text: "فشل" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { class: "badge-secondary", text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatNumber = (num: number) => {
    if (isRTL) {
      // Convert to Arabic numerals
      return num.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />

      {/* Main Content */}
      <div className={`lg:mr-64 transition-all duration-300 ${isRTL ? 'lg:mr-0 lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                  title={isRTL ? "القائمة" : "Menu"}
                >
                  <Settings className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {isRTL ? "لوحة التحكم" : "Dashboard"}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {isRTL ? "إدارة النظام والخدمات" : "System and Services Management"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">أ</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي المستخدمين" : "Total Users"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(stats.totalUsers)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي الحجوزات" : "Total Bookings"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(stats.totalBookings)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "إجمالي الإيرادات" : "Total Revenue"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatNumber(stats.totalRevenue)} {isRTL ? "ريال" : "SAR"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isRTL ? "معدل النمو" : "Growth Rate"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    +{formatNumber(stats.growthRate)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "users"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {isRTL ? "المستخدمين" : "Users"}
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "bookings"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {isRTL ? "الحجوزات" : "Bookings"}
            </button>
          </div>

          {/* Table */}
          <div className="card">
            <TableToolbar>
              <div className="flex items-center space-x-4">
                <TableSearch
                  placeholder={activeTab === "users" 
                    ? (isRTL ? "البحث في المستخدمين..." : "Search users...")
                    : (isRTL ? "البحث في الحجوزات..." : "Search bookings...")
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80"
                />
                <TableFilter />
                <TableExport />
              </div>
              <button className="btn-primary">
                <Plus className="w-4 h-4 ml-2" />
                {isRTL ? "إضافة " : "Add "}
                {activeTab === "users" ? (isRTL ? "مستخدم" : "User") : (isRTL ? "حجز" : "Booking")}
              </button>
            </TableToolbar>

            <Table>
              <TableHeader>
                {activeTab === "users" ? (
                  <>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "name" ? sortDirection : null}
                      onSort={() => handleSort("name")}
                    >
                      {isRTL ? "الاسم" : "Name"}
                    </SortableTableHead>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "email" ? sortDirection : null}
                      onSort={() => handleSort("email")}
                    >
                      {isRTL ? "البريد الإلكتروني" : "Email"}
                    </SortableTableHead>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "role" ? sortDirection : null}
                      onSort={() => handleSort("role")}
                    >
                      {isRTL ? "الدور" : "Role"}
                    </SortableTableHead>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "status" ? sortDirection : null}
                      onSort={() => handleSort("status")}
                    >
                      {isRTL ? "الحالة" : "Status"}
                    </SortableTableHead>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "lastLogin" ? sortDirection : null}
                      onSort={() => handleSort("lastLogin")}
                    >
                      {isRTL ? "آخر تسجيل دخول" : "Last Login"}
                    </SortableTableHead>
                    <TableHead>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                  </>
                ) : (
                  <>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "customerName" ? sortDirection : null}
                      onSort={() => handleSort("customerName")}
                    >
                      {isRTL ? "اسم العميل" : "Customer Name"}
                    </SortableTableHead>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "service" ? sortDirection : null}
                      onSort={() => handleSort("service")}
                    >
                      {isRTL ? "الخدمة" : "Service"}
                    </SortableTableHead>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "date" ? sortDirection : null}
                      onSort={() => handleSort("date")}
                    >
                      {isRTL ? "التاريخ" : "Date"}
                    </SortableTableHead>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "status" ? sortDirection : null}
                      onSort={() => handleSort("status")}
                    >
                      {isRTL ? "الحالة" : "Status"}
                    </SortableTableHead>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "amount" ? sortDirection : null}
                      onSort={() => handleSort("amount")}
                    >
                      {isRTL ? "المبلغ" : "Amount"}
                    </SortableTableHead>
                    <SortableTableHead
                      sortable
                      sortDirection={sortField === "paymentStatus" ? sortDirection : null}
                      onSort={() => handleSort("paymentStatus")}
                    >
                      {isRTL ? "حالة الدفع" : "Payment Status"}
                    </SortableTableHead>
                    <TableHead>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
                  </>
                )}
              </TableHeader>
              <TableBody>
                {sortedData.map((item) => (
                  <TableRow key={item.id}>
                    {activeTab === "users" ? (
                      <>
                        <TableCell className="font-medium">{(item as User).name}</TableCell>
                        <TableCell>{(item as User).email}</TableCell>
                        <TableCell>{(item as User).role}</TableCell>
                        <TableCell>{getStatusBadge((item as User).status)}</TableCell>
                        <TableCell>{(item as User).lastLogin}</TableCell>
                        <TableCell>
                          <TableRowActions
                            onView={() => console.log("View user:", item.id)}
                            onEdit={() => console.log("Edit user:", item.id)}
                            onDelete={() => console.log("Delete user:", item.id)}
                          />
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{(item as Booking).customerName}</TableCell>
                        <TableCell>{(item as Booking).service}</TableCell>
                        <TableCell>{(item as Booking).date}</TableCell>
                        <TableCell>{getStatusBadge((item as Booking).status)}</TableCell>
                        <TableCell>{formatNumber((item as Booking).amount)} {isRTL ? "ريال" : "SAR"}</TableCell>
                        <TableCell>{getStatusBadge((item as Booking).paymentStatus)}</TableCell>
                        <TableCell>
                          <TableRowActions
                            onView={() => console.log("View booking:", item.id)}
                            onEdit={() => console.log("Edit booking:", item.id)}
                            onDelete={() => console.log("Delete booking:", item.id)}
                          />
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedData.length / 10)}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Additional Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
