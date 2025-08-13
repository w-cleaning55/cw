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
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Activity,
  RefreshCw,
  Zap,
  Target,
  Eye,
  Phone,
} from "lucide-react";

interface RealTimeMetrics {
  currentVisitors: number;
  activeBookings: number;
  todayRevenue: number;
  responseTime: number;
  conversionRate: number;
  customerSatisfaction: number;
  teamAvailability: number;
  systemStatus: "healthy" | "warning" | "critical";
  lastUpdated: string;
}

const RealTimeAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    currentVisitors: 23,
    activeBookings: 8,
    todayRevenue: 3450.0,
    responseTime: 1.2,
    conversionRate: 12.5,
    customerSatisfaction: 4.9,
    teamAvailability: 85,
    systemStatus: "healthy",
    lastUpdated: new Date().toISOString(),
  });

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // محاكاة تحديث البيانات في الوقت الفعلي
      setMetrics((prev) => ({
        ...prev,
        currentVisitors: Math.max(
          1,
          prev.currentVisitors + Math.floor(Math.random() * 6) - 3,
        ),
        activeBookings: Math.max(
          0,
          prev.activeBookings + Math.floor(Math.random() * 3) - 1,
        ),
        todayRevenue: prev.todayRevenue + Math.random() * 200,
        responseTime: Math.max(
          0.5,
          prev.responseTime + Math.random() * 0.4 - 0.2,
        ),
        conversionRate: Math.max(
          0,
          Math.min(100, prev.conversionRate + Math.random() * 2 - 1),
        ),
        customerSatisfaction: Math.max(
          1,
          Math.min(5, prev.customerSatisfaction + Math.random() * 0.2 - 0.1),
        ),
        teamAvailability: Math.max(
          0,
          Math.min(
            100,
            prev.teamAvailability + Math.floor(Math.random() * 10) - 5,
          ),
        ),
        lastUpdated: new Date().toISOString(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("ar-SA")} ر.س`;
  const formatTime = (time: string) =>
    new Date(time).toLocaleTimeString("ar-SA");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "healthy":
        return "نظام سليم";
      case "warning":
        return "تحذير";
      case "critical":
        return "حرج";
      default:
        return "غير معروف";
    }
  };

  const realTimeCards = [
    {
      title: "الزوار الحاليون",
      value: metrics.currentVisitors.toString(),
      icon: Users,
      change: "+3",
      trend: "up",
      description: "متصل الآن",
    },
    {
      title: "الحجوزات النشطة",
      value: metrics.activeBookings.toString(),
      icon: Calendar,
      change: "+1",
      trend: "up",
      description: "قيد المعالجة",
    },
    {
      title: "إيرادات اليوم",
      value: formatCurrency(metrics.todayRevenue),
      icon: DollarSign,
      change: "+8.2%",
      trend: "up",
      description: "حتى الآن",
    },
    {
      title: "وقت الاستجابة",
      value: `${metrics.responseTime.toFixed(1)}م`,
      icon: Clock,
      change: "-0.3م",
      trend: "down",
      description: "متوسط الرد",
    },
    {
      title: "معدل التحويل",
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: Target,
      change: "+2.1%",
      trend: "up",
      description: "آخر ساعة",
    },
    {
      title: "رضا العملاء",
      value: `${metrics.customerSatisfaction.toFixed(1)}/5`,
      icon: Activity,
      change: "+0.1",
      trend: "up",
      description: "تقييم فوري",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">الإحصائيات المباشرة</h2>
          <p className="text-muted-foreground">مراقبة الأداء في الوقت الفعلي</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            />
            <span className="text-sm text-muted-foreground">
              {isLive ? "مباشر" : "متوقف"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                إيقاف التحديث
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
                تشغيل التحديث
              </>
            )}
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">حالة النظام</CardTitle>
            <Badge className={getStatusColor(metrics.systemStatus)}>
              {getStatusText(metrics.systemStatus)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Zap className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">توفر الفرق</p>
                <p className="font-bold">{metrics.teamAvailability}%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Eye className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">مراقبة المواقع</p>
                <p className="font-bold">نشط</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Phone className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">مركز الاتصال</p>
                <p className="font-bold">متاح</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Activity className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">API</p>
                <p className="font-bold">سليم</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {realTimeCards.map((card, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{card.value}</div>
              <div className="flex items-center gap-2 text-xs">
                {card.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span
                  className={
                    card.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {card.change}
                </span>
                <span className="text-muted-foreground">
                  {card.description}
                </span>
              </div>

              {/* Live indicator */}
              {isLive && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            النشاط الأخير
          </CardTitle>
          <CardDescription>الأحداث المباشرة والتحديثات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                time: "الآن",
                event: "حجز جديد من العزيزية",
                type: "booking",
                color: "text-green-600",
              },
              {
                time: "منذ دقيقتين",
                event: "تم إكمال خدمة تنظيف في الزهراء",
                type: "completed",
                color: "text-blue-600",
              },
              {
                time: "منذ 5 دقائق",
                event: "استفسار جديد عبر واتساب",
                type: "inquiry",
                color: "text-yellow-600",
              },
              {
                time: "منذ 8 دقائق",
                event: "تقييم 5 نجوم من عميل",
                type: "review",
                color: "text-purple-600",
              },
              {
                time: "منذ 12 دقيقة",
                event: "دفع ��م بنجاح - 450 ر.س",
                type: "payment",
                color: "text-green-600",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${activity.color.replace("text-", "bg-")}`}
                  />
                  <div>
                    <p className="text-sm font-medium">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-sm text-muted-foreground">
        آخر تحديث: {formatTime(metrics.lastUpdated)} | البيانات محدثة كل 3 ثوانٍ
      </div>
    </div>
  );
};

export default RealTimeAnalytics;
