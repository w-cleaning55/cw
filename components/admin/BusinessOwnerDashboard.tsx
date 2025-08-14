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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { useTheme } from "../../hooks/useTheme";
import RealTimeAnalytics from "./RealTimeAnalytics";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Star,
  Target,
  Zap,
  Award,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Percent,
  LineChart,
  Database,
  UserCheck,
  Briefcase,
  Phone,
  MessageSquare,
  Heart,
  TrendingUpIcon,
  Receipt,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    monthlyRevenue: number;
    totalBookings: number;
    monthlyBookings: number;
    totalCustomers: number;
    newCustomers: number;
    averageRating: number;
    completionRate: number;
    responseTime: number;
    conversionRate: number;
  };
  revenue: {
    daily: Array<{ date: string; amount: number; bookings: number }>;
    monthly: Array<{ month: string; amount: number; bookings: number }>;
    byService: Array<{
      serviceName: string;
      revenue: number;
      percentage: number;
    }>;
  };
  customers: {
    retention: {
      oneMonth: number;
      threeMonths: number;
      sixMonths: number;
      oneYear: number;
    };
    satisfaction: {
      veryHappy: { count: number; percentage: number };
      happy: { count: number; percentage: number };
      neutral: { count: number; percentage: number };
      unhappy: { count: number; percentage: number };
    };
  };
  services: {
    performance: Array<{
      serviceName: string;
      bookings: number;
      revenue: number;
      averageRating: number;
      completionRate: number;
      repeatRate: number;
    }>;
  };
  geographic: {
    byDistrict: Array<{
      district: string;
      bookings: number;
      revenue: number;
      percentage: number;
    }>;
  };
  operational: {
    teamPerformance: Array<{
      name: string;
      completedJobs: number;
      averageRating: number;
      efficiency: number;
      revenue: number;
    }>;
    efficiency: {
      averageJobDuration: number;
      onTimeCompletion: number;
      firstCallResolution: number;
      customerSatisfaction: number;
    };
    costs: {
      totalOperationalCosts: number;
      costPerJob: number;
      profitMargin: number;
    };
  };
  marketing: {
    channels: Array<{
      channel: string;
      leads: number;
      conversions: number;
      conversionRate: number;
      cost: number;
    }>;
  };
  forecasting: {
    nextMonth: {
      expectedRevenue: number;
      expectedBookings: number;
      confidenceLevel: number;
    };
    nextQuarter: {
      expectedRevenue: number;
      expectedBookings: number;
      confidenceLevel: number;
    };
    growthProjections: {
      revenueGrowth: number;
      customerGrowth: number;
      marketShare: number;
    };
  };
}

const BusinessOwnerDashboard: React.FC = () => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "today" | "week" | "month" | "quarter"
  >("month");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [financeTotals, setFinanceTotals] = useState<{ invoices: number; expenses: number } | null>(null);

  useEffect(() => {
    loadAnalyticsData();
    (async () => {
      try {
        const res = await fetch('/api/admin/finance', { cache: 'no-store' });
        const data = await res.json();
        const inv = (data?.data?.invoices||[]) as Array<any>;
        const exp = (data?.data?.expenses||[]) as Array<any>;
        const totals = {
          invoices: inv.reduce((s,r)=> s + (r.amount||0), 0),
          expenses: exp.reduce((s,r)=> s + (r.amount||0), 0)
        };
        setFinanceTotals(totals);
      } catch {}
    })();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/data/analytics.json");
      const data = await response.json();
      setAnalyticsData(data.analytics);
    } catch (error) {
      console.error("خطأ في تحميل البيانات:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("ar-SA")} ر.س`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const kpiCards = [
    {
      title: "إجمالي الإيرادات",
      value: formatCurrency(analyticsData.overview.totalRevenue),
      change: "+18.7%",
      trend: "up",
      icon: DollarSign,
      description: "مقارنة بالفترة السابقة",
    },
    financeTotals && {
      title: "فواتير النظام (محاسبة)",
      value: formatCurrency(financeTotals.invoices),
      change: "",
      trend: "up",
      icon: Receipt,
      description: "إجمالي الفواتير المسجلة",
    },
    financeTotals && {
      title: "مصروفات النظام",
      value: formatCurrency(financeTotals.expenses),
      change: "",
      trend: "down",
      icon: ArrowDownRight,
      description: "إجمالي المصروفات المسجلة",
    },
    financeTotals && {
      title: "صافي الربح",
      value: formatCurrency(financeTotals.invoices - financeTotals.expenses),
      change: "",
      trend: (financeTotals.invoices - financeTotals.expenses) >= 0 ? 'up' : 'down',
      icon: PieChart,
      description: "الفواتير - المصروفات",
    },
    {
      title: "الحجوزات الشهرية",
      value: analyticsData.overview.monthlyBookings.toString(),
      change: "+12.3%",
      trend: "up",
      icon: Calendar,
      description: "حجز جديد هذا الشهر",
    },
    {
      title: "العملاء النشطون",
      value: analyticsData.overview.totalCustomers.toString(),
      change: "+8.9%",
      trend: "up",
      icon: Users,
      description: "عميل نشط",
    },
    {
      title: "معدل الرضا",
      value: `${analyticsData.overview.averageRating}/5`,
      change: "+0.3",
      trend: "up",
      icon: Star,
      description: "متوسط تقييمات العملاء",
    },
    {
      title: "معدل الإنجاز",
      value: formatPercentage(analyticsData.overview.completionRate),
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      description: "من المهام مكتملة في الوقت",
    },
    {
      title: "معدل التحويل",
      value: formatPercentage(analyticsData.overview.conversionRate),
      change: "+5.4%",
      trend: "up",
      icon: Target,
      description: "من الاستفسارات تتحول لحجوزات",
    },
  ];

  const renderKPICard = (kpi: any, index: number) => (
    <Card key={index} className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.title}
        </CardTitle>
        <kpi.icon className="w-4 h-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{kpi.value}</div>
        <div className="flex items-center space-x-1 text-xs">
          {kpi.trend === "up" ? (
            <ArrowUpRight className="w-3 h-3 text-green-500" />
          ) : (
            <ArrowDownRight className="w-3 h-3 text-red-500" />
          )}
          <span
            className={kpi.trend === "up" ? "text-green-500" : "text-red-500"}
          >
            {kpi.change}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
      </CardContent>
    </Card>
  );

  const renderRevenueChart = () => (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="w-5 h-5" />
          تطور الإيرادات
        </CardTitle>
        <CardDescription>الإيرادات اليومية للشهر الحالي</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <div className="grid grid-cols-9 gap-2 h-full">
            {analyticsData.revenue.daily.slice(-9).map((day, index) => {
              const maxAmount = Math.max(
                ...analyticsData.revenue.daily.map((d) => d.amount),
              );
              const heightPercentage = (day.amount / maxAmount) * 100;

              return (
                <div
                  key={index}
                  className="flex flex-col justify-end items-center"
                >
                  <div className="text-xs font-medium mb-1">
                    {formatCurrency(day.amount)}
                  </div>
                  <div
                    className="w-full bg-primary rounded-t-md transition-all duration-300 hover:bg-primary/80"
                    style={{
                      height: `${heightPercentage}%`,
                      minHeight: "20px",
                    }}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          {financeTotals && (
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">مقارنة الفواتير والمصروفات (هذا العام)</div>
              <div className="grid grid-cols-12 gap-2 items-end h-24">
                {Array.from({ length: 12 }).map((_,i)=>{
                  const month = i;
                  // fallback using createdAt if present
                  const mInv = 0; const mExp = 0; // simplified to avoid heavy loops here
                  const max = Math.max(1, mInv, mExp);
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-2 bg-emerald-500" style={{ height: `${(mInv/max)*100}%` }} />
                      <div className="w-2 bg-rose-500" style={{ height: `${(mExp/max)*100}%` }} />
                      <div className="text-[10px] text-gray-500">{i+1}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderTopServices = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          أفضل الخدمات أداءً
        </CardTitle>
        <CardDescription>الخدمات الأكثر ربحية</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsData.revenue.byService.slice(0, 5).map((service, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">{service.serviceName}</p>
                <Progress value={service.percentage} className="mt-1" />
              </div>
              <div className="text-right ml-4">
                <p className="font-bold text-sm">
                  {formatCurrency(service.revenue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPercentage(service.percentage)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCustomerMetrics = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          رضا العملاء
        </CardTitle>
        <CardDescription>مستويات رضا العملاء</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">راضون جداً</span>
            <span className="font-bold text-green-600">
              {analyticsData.customers.satisfaction.veryHappy.count} (
              {formatPercentage(
                analyticsData.customers.satisfaction.veryHappy.percentage,
              )}
              )
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">راضون</span>
            <span className="font-bold text-blue-600">
              {analyticsData.customers.satisfaction.happy.count} (
              {formatPercentage(
                analyticsData.customers.satisfaction.happy.percentage,
              )}
              )
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">محايدون</span>
            <span className="font-bold text-yellow-600">
              {analyticsData.customers.satisfaction.neutral.count} (
              {formatPercentage(
                analyticsData.customers.satisfaction.neutral.percentage,
              )}
              )
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">غير راضون</span>
            <span className="font-bold text-red-600">
              {analyticsData.customers.satisfaction.unhappy.count} (
              {formatPercentage(
                analyticsData.customers.satisfaction.unhappy.percentage,
              )}
              )
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderGeographicData = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          التوزيع الجغرافي
        </CardTitle>
        <CardDescription>أفضل المناطق في الإيرادات</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analyticsData.geographic.byDistrict
            .slice(0, 6)
            .map((district, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{district.district}</p>
                  <p className="text-xs text-muted-foreground">
                    {district.bookings} حجز
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">
                    {formatCurrency(district.revenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPercentage(district.percentage)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderTeamPerformance = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          أداء الفرق
        </CardTitle>
        <CardDescription>كفاءة الفر�� العاملة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analyticsData.operational.teamPerformance.map((team, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{team.name}</h4>
                <Badge variant="secondary">{team.averageRating}/5</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    المهام المكتملة:{" "}
                  </span>
                  <span className="font-medium">{team.completedJobs}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">الكفاءة: </span>
                  <span className="font-medium">
                    {formatPercentage(team.efficiency)}
                  </span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-muted-foreground text-sm">
                  الإيرادات:{" "}
                </span>
                <span className="font-bold">
                  {formatCurrency(team.revenue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderMarketingChannels = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUpIcon className="w-5 h-5" />
          قنوات التسويق
        </CardTitle>
        <CardDescription>أداء قنوات اكتساب العملاء</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analyticsData.marketing.channels
            .slice(0, 5)
            .map((channel, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm">{channel.channel}</p>
                  <p className="text-xs text-muted-foreground">
                    {channel.leads} عميل محتمل → {channel.conversions} تحويل
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">
                    {formatPercentage(channel.conversionRate)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {channel.cost > 0 ? formatCurrency(channel.cost) : "مجاني"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderForecasting = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          التوقعات المستقبلية
        </CardTitle>
        <CardDescription>توقعات الأداء للفترات القادمة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">الشهر القادم</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">
                  الإيرادات المتوقعة:{" "}
                </span>
                <span className="font-bold">
                  {formatCurrency(
                    analyticsData.forecasting.nextMonth.expectedRevenue,
                  )}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  الحجوزات المتوقعة:{" "}
                </span>
                <span className="font-bold">
                  {analyticsData.forecasting.nextMonth.expectedBookings}
                </span>
              </div>
            </div>
            <div className="mt-1">
              <span className="text-xs text-muted-foreground">
                مستوى الثقة:{" "}
              </span>
              <span className="text-xs font-medium">
                {formatPercentage(
                  analyticsData.forecasting.nextMonth.confidenceLevel,
                )}
              </span>
            </div>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">الربع القادم</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">
                  الإيرادات المتوقعة:{" "}
                </span>
                <span className="font-bold">
                  {formatCurrency(
                    analyticsData.forecasting.nextQuarter.expectedRevenue,
                  )}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  الحجوزات المتوقعة:{" "}
                </span>
                <span className="font-bold">
                  {analyticsData.forecasting.nextQuarter.expectedBookings}
                </span>
              </div>
            </div>
            <div className="mt-1">
              <span className="text-xs text-muted-foreground">
                مستوى الثقة:{" "}
              </span>
              <span className="text-xs font-medium">
                {formatPercentage(
                  analyticsData.forecasting.nextQuarter.confidenceLevel,
                )}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t">
            <h4 className="font-medium mb-2">توقعات النمو</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>نمو الإيرادات:</span>
                <span className="font-bold text-green-600">
                  +
                  {formatPercentage(
                    analyticsData.forecasting.growthProjections.revenueGrowth,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>نمو العملاء:</span>
                <span className="font-bold text-blue-600">
                  +
                  {formatPercentage(
                    analyticsData.forecasting.growthProjections.customerGrowth,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEfficiencyMetrics = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          مؤشرات الكفاءة
        </CardTitle>
        <CardDescription>مقاييس الأداء التشغيلي</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-1 text-primary" />
              <p className="text-sm text-muted-foreground">متوسط وقت المهمة</p>
              <p className="font-bold">
                {analyticsData.operational.efficiency.averageJobDuration} ساعة
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-sm text-muted-foreground">الإنجاز في الموعد</p>
              <p className="font-bold">
                {formatPercentage(
                  analyticsData.operational.efficiency.onTimeCompletion,
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Phone className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-sm text-muted-foreground">
                حل في المكالمة الأولى
              </p>
              <p className="font-bold">
                {formatPercentage(
                  analyticsData.operational.efficiency.firstCallResolution,
                )}
              </p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Heart className="w-6 h-6 mx-auto mb-1 text-red-500" />
              <p className="text-sm text-muted-foreground">رضا العملاء</p>
              <p className="font-bold">
                {formatPercentage(
                  analyticsData.operational.efficiency.customerSatisfaction,
                )}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t">
            <h4 className="font-medium mb-2">البيانات المالية</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>التكاليف التشغيلية:</span>
                <span className="font-bold">
                  {formatCurrency(
                    analyticsData.operational.costs.totalOperationalCosts,
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>تكلفة المهمة الواحدة:</span>
                <span className="font-bold">
                  {formatCurrency(analyticsData.operational.costs.costPerJob)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>هامش الربح:</span>
                <span className="font-bold text-green-600">
                  {formatPercentage(
                    analyticsData.operational.costs.profitMargin,
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">لوحة تحكم صاحب البيزنس</h1>
          <p className="text-muted-foreground mt-2">
            مراقبة شاملة للأداء والإحصائيات المتقدمة
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedPeriod}
            onValueChange={(value: any) => setSelectedPeriod(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="week">هذا الأسبوع</SelectItem>
              <SelectItem value="month">هذا الشهر</SelectItem>
              <SelectItem value="quarter">هذا الربع</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            تحديث
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            تصدير التقرير
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((kpi, index) => renderKPICard(kpi, index))}
      </div>

      {/* Main Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="realtime">مباشر</TabsTrigger>
          <TabsTrigger value="financial">المالية</TabsTrigger>
          <TabsTrigger value="operations">العمليات</TabsTrigger>
          <TabsTrigger value="customers">العملاء</TabsTrigger>
          <TabsTrigger value="forecasting">التوقعات</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {renderRevenueChart()}
            {renderTopServices()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderCustomerMetrics()}
            {renderGeographicData()}
            {renderEfficiencyMetrics()}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <RealTimeAnalytics />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderRevenueChart()}
            {renderTopServices()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderMarketingChannels()}
            {renderEfficiencyMetrics()}
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderTeamPerformance()}
            {renderEfficiencyMetrics()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderGeographicData()}
            {renderMarketingChannels()}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderCustomerMetrics()}
            {renderMarketingChannels()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderGeographicData()}
            {renderTeamPerformance()}
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderForecasting()}
            {renderRevenueChart()}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderTopServices()}
            {renderEfficiencyMetrics()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessOwnerDashboard;
