"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  X,
  Settings,
  Filter,
  MarkAsRead,
  Archive,
  Star,
  Trash2,
} from "lucide-react";

interface Notification {
  id: string;
  type:
    | "success"
    | "warning"
    | "info"
    | "alert"
    | "revenue"
    | "booking"
    | "customer";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  action?: {
    label: string;
    href: string;
  };
}

const BusinessNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "revenue",
      title: "هدف الإيرادات محقق",
      message: "تم تحقيق هدف الإيرادات الشهرية بنسبة 105% - 47,065 ر.س",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
      isStarred: true,
      priority: "high",
      action: { label: "عرض التفاصيل", href: "/admin/analytics" },
    },
    {
      id: "2",
      type: "alert",
      title: "تحذير: انخفاض توفر الفرق",
      message: "فريق جدة الثاني متاح بنسبة 60% فقط - قد يؤثر على الحجوزات",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      isRead: false,
      isStarred: false,
      priority: "urgent",
      action: { label: "إدارة الفرق", href: "/admin/team-management" },
    },
    {
      id: "3",
      type: "booking",
      title: "حجز جديد عالي القيمة",
      message: "حجز بقيمة 1,250 ر.س من العزيزية - تنظيف منشأة تجارية",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
      isStarred: false,
      priority: "medium",
      action: { label: "عرض الحجز", href: "/admin/bookings" },
    },
    {
      id: "4",
      type: "customer",
      title: "تقييم ممتاز من عميل",
      message: 'تقييم 5 نجوم من أحمد محمد - "خدمة احترافية ونتائج ممتازة"',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      isRead: true,
      isStarred: false,
      priority: "low",
    },
    {
      id: "5",
      type: "warning",
      title: "تأخير في المهمة",
      message: "مهمة تنظيف في الروضة متأخرة 20 دقيقة - العميل تم إشعاره",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      isRead: true,
      isStarred: false,
      priority: "medium",
    },
    {
      id: "6",
      type: "success",
      title: "إكمال العقد الشهري",
      message: "تم إكمال جميع مهام عقد الصيانة الشهري للشركة التجارية",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      isStarred: false,
      priority: "low",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "urgent">(
    "all",
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertTriangle;
      case "alert":
        return AlertTriangle;
      case "info":
        return Info;
      case "revenue":
        return DollarSign;
      case "booking":
        return Calendar;
      case "customer":
        return Users;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === "urgent") return "text-red-600 bg-red-100 dark:bg-red-950";

    switch (type) {
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-950";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950";
      case "alert":
        return "text-red-600 bg-red-100 dark:bg-red-950";
      case "info":
        return "text-blue-600 bg-blue-100 dark:bg-blue-950";
      case "revenue":
        return "text-green-600 bg-green-100 dark:bg-green-950";
      case "booking":
        return "text-blue-600 bg-blue-100 dark:bg-blue-950";
      case "customer":
        return "text-purple-600 bg-purple-100 dark:bg-purple-950";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-950";
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-600",
      medium: "bg-blue-100 text-blue-600",
      high: "bg-orange-100 text-orange-600",
      urgent: "bg-red-100 text-red-600",
    };

    const labels = {
      low: "منخفض",
      medium: "متوسط",
      high: "عالي",
      urgent: "عاجل",
    };

    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread" && notification.isRead) return false;
    if (filter === "starred" && !notification.isStarred) return false;
    if (filter === "urgent" && notification.priority !== "urgent") return false;
    if (typeFilter !== "all" && notification.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const urgentCount = notifications.filter(
    (n) => n.priority === "urgent",
  ).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleToggleStar = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isStarred: !n.isStarred } : n)),
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "الآن";
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `منذ ${diffInDays} يوم`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Bell className="w-6 h-6" />
            إشعارات البيزنس
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            متابعة الأحداث المهمة والتنبيهات
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <MarkAsRead className="w-4 h-4 mr-2" />
            قراءة الكل
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            إعدادات الإشعارات
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Bell className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الإشعارات</p>
              <p className="text-xl font-bold">{notifications.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">عاجل</p>
              <p className="text-xl font-bold">{urgentCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">غير مقروء</p>
              <p className="text-xl font-bold">{unreadCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Star className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">مميز</p>
              <p className="text-xl font-bold">
                {notifications.filter((n) => n.isStarred).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              تصفية الإشعارات
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                الكل
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                غير مقروء ({unreadCount})
              </Button>
              <Button
                variant={filter === "starred" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("starred")}
              >
                مميز
              </Button>
              <Button
                variant={filter === "urgent" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("urgent")}
              >
                عاجل ({urgentCount})
              </Button>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="نوع الإشعار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="revenue">الإيرادات</SelectItem>
                <SelectItem value="booking">الحجوزات</SelectItem>
                <SelectItem value="customer">العملاء</SelectItem>
                <SelectItem value="alert">تنبيهات</SelectItem>
                <SelectItem value="warning">تحذيرات</SelectItem>
                <SelectItem value="success">نجاح</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>الإشعارات الحديثة</CardTitle>
          <CardDescription>
            عرض {filteredNotifications.length} من {notifications.length} إشعار
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-md ${
                    !notification.isRead ? "bg-muted/50 border-primary/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${getNotificationColor(notification.type, notification.priority)}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {getPriorityBadge(notification.priority)}
                            {notification.isStarred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStar(notification.id)}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                notification.isStarred
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-400"
                              }`}
                            />
                          </Button>

                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>

                      {notification.action && (
                        <div className="mt-3">
                          <Button variant="outline" size="sm">
                            {notification.action.label}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">لا توجد إشعارات</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessNotifications;
