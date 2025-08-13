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
import { useTheme } from "../../hooks/useTheme";
import {
  LineChart,
  BarChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Users,
  Calendar,
  Award,
  Target,
  Zap,
  MapPin,
  Phone,
} from "lucide-react";

interface ChartData {
  revenue: {
    daily: Array<{ date: string; amount: number; bookings: number }>;
    monthly: Array<{ month: string; amount: number; bookings: number }>;
    quarterly: Array<{ quarter: string; amount: number; growth: number }>;
  };
  services: {
    performance: Array<{
      name: string;
      revenue: number;
      bookings: number;
      rating: number;
    }>;
    trends: Array<{
      service: string;
      trend: "up" | "down" | "stable";
      change: number;
    }>;
  };
  customers: {
    acquisition: Array<{ month: string; new: number; returning: number }>;
    satisfaction: Array<{ rating: number; count: number; percentage: number }>;
    retention: Array<{ period: string; rate: number }>;
  };
  geographic: {
    districts: Array<{
      name: string;
      revenue: number;
      bookings: number;
      growth: number;
    }>;
  };
  operational: {
    efficiency: Array<{
      metric: string;
      current: number;
      target: number;
      trend: "up" | "down";
    }>;
    costs: Array<{ category: string; amount: number; percentage: number }>;
  };
}

const AdvancedAnalyticsCharts: React.FC = () => {
  const { theme } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState<string>("revenue");
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d",
  );

  useEffect(() => {
    loadChartData();
  }, [selectedMetric, timeRange]);

  const loadChartData = async () => {
    try {
      const response = await fetch("/data/analytics.json");
      const data = await response.json();

      // Transform data for charts
      const transformedData: ChartData = {
        revenue: {
          daily: data.analytics.revenue.daily || [],
          monthly: data.analytics.revenue.monthly || [],
          quarterly: [
            { quarter: "Q1 2024", amount: 65890, growth: 12.5 },
            { quarter: "Q2 2024", amount: 78230, growth: 18.7 },
            { quarter: "Q3 2024", amount: 89450, growth: 14.3 },
            { quarter: "Q4 2024", amount: 95670, growth: 6.9 },
          ],
        },
        services: {
          performance:
            data.analytics.services.performance?.map((service: any) => ({
              name: service.serviceName,
              revenue: service.revenue,
              bookings: service.bookings,
              rating: service.averageRating,
            })) || [],
          trends: [
            { service: "تنظيف المنشآت التجارية", trend: "up", change: 25.3 },
            { service: "خدمة التعقيم العميق", trend: "up", change: 18.7 },
            { service: "تنظيف السجاد والستائر", trend: "stable", change: 2.1 },
            { service: "مكافحة الحشرات", trend: "down", change: -5.4 },
          ],
        },
        customers: {
          acquisition:
            data.analytics.customers.acquisition?.map((item: any) => ({
              month: item.month,
              new: item.newCustomers,
              returning: item.totalCustomers - item.newCustomers,
            })) || [],
          satisfaction: [
            { rating: 5, count: 127, percentage: 64.5 },
            { rating: 4, count: 58, percentage: 29.4 },
            { rating: 3, count: 10, percentage: 5.1 },
            { rating: 2, count: 2, percentage: 1.0 },
            { rating: 1, count: 0, percentage: 0.0 },
          ],
          retention: [
            { period: "شهر واحد", rate: 85.2 },
            { period: "3 أشهر", rate: 78.9 },
            { period: "6 أشهر", rate: 72.3 },
            { period: "سنة", rate: 65.7 },
          ],
        },
        geographic: {
          districts:
            data.analytics.geographic.byDistrict?.map((district: any) => ({
              name: district.district,
              revenue: district.revenue,
              bookings: district.bookings,
              growth: Math.random() * 30 - 10, // Mock growth data
            })) || [],
        },
        operational: {
          efficiency: [
            { metric: "وقت الاستجابة", current: 45, target: 30, trend: "up" },
            { metric: "معدل الإنجاز", current: 96.3, target: 95, trend: "up" },
            { metric: "رضا العملاء", current: 4.8, target: 4.5, trend: "up" },
            {
              metric: "الكفاءة التشغيلية",
              current: 87.5,
              target: 90,
              trend: "down",
            },
          ],
          costs: [
            { category: "الرواتب", amount: 15600, percentage: 54.8 },
            { category: "المعدات", amount: 4890, percentage: 17.2 },
            { category: "المواد", amount: 3920, percentage: 13.8 },
            { category: "النقل", amount: 2340, percentage: 8.2 },
            { category: "أخرى", amount: 1700, percentage: 6.0 },
          ],
        },
      };

      setChartData(transformedData);
    } catch (error) {
      console.error("خطأ في تحميل بيانات الرسوم البيانية:", error);
    }
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-pulse mx-auto mb-4" />
          <p>جاري تحميل الرسوم البيانية...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    `${amount.toLocaleString("ar-SA")} ر.س`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  // Revenue Line Chart
  const renderRevenueLineChart = () => (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="w-5 h-5" />
          تطور الإيرادات الشهرية
        </CardTitle>
        <CardDescription>مقارنة الإيرادات على مدار الشهور</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <div className="relative w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 800 300">
              {/* Grid lines */}
              <defs>
                <pattern
                  id="grid"
                  width="80"
                  height="30"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 80 0 L 0 0 0 30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Revenue line */}
              {chartData.revenue.monthly.length > 1 && (
                <polyline
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  points={chartData.revenue.monthly
                    .slice(-10)
                    .map((item, index) => {
                      const x = (index / 9) * 760 + 20;
                      const maxRevenue = Math.max(
                        ...chartData.revenue.monthly.map((m) => m.amount),
                      );
                      const y = 280 - (item.amount / maxRevenue) * 240;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
              )}

              {/* Data points */}
              {chartData.revenue.monthly.slice(-10).map((item, index) => {
                const x = (index / 9) * 760 + 20;
                const maxRevenue = Math.max(
                  ...chartData.revenue.monthly.map((m) => m.amount),
                );
                const y = 280 - (item.amount / maxRevenue) * 240;
                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r="4" fill="hsl(var(--primary))" />
                    <text
                      x={x}
                      y={y - 15}
                      textAnchor="middle"
                      fontSize="10"
                      fill="currentColor"
                    >
                      {formatCurrency(item.amount)}
                    </text>
                    <text
                      x={x}
                      y={295}
                      textAnchor="middle"
                      fontSize="10"
                      fill="currentColor"
                      opacity="0.7"
                    >
                      {new Date(item.month).toLocaleDateString("ar-SA", {
                        month: "short",
                      })}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Services Performance Bar Chart
  const renderServicesBarChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          أداء الخدمات
        </CardTitle>
        <CardDescription>إيرادات الخدمات المختلفة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.services.performance.slice(0, 6).map((service, index) => {
            const maxRevenue = Math.max(
              ...chartData.services.performance.map((s) => s.revenue),
            );
            const widthPercentage = (service.revenue / maxRevenue) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{service.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(service.revenue)}
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all duration-300"
                      style={{ width: `${widthPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{service.bookings} حجز</span>
                    <span>{service.rating}/5 ⭐</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  // Customer Satisfaction Pie Chart
  const renderSatisfactionPieChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          توزيع رضا العملاء
        </CardTitle>
        <CardDescription>مستويات رضا العملاء</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {(() => {
              const total = chartData.customers.satisfaction.reduce(
                (sum, item) => sum + item.count,
                0,
              );
              let currentAngle = 0;
              const colors = [
                "#22c55e",
                "#3b82f6",
                "#f59e0b",
                "#ef4444",
                "#6b7280",
              ];

              return chartData.customers.satisfaction.map((item, index) => {
                const percentage = (item.count / total) * 100;
                const angle = (percentage / 100) * 360;
                const x1 =
                  100 + 80 * Math.cos(((currentAngle - 90) * Math.PI) / 180);
                const y1 =
                  100 + 80 * Math.sin(((currentAngle - 90) * Math.PI) / 180);
                const x2 =
                  100 +
                  80 * Math.cos(((currentAngle + angle - 90) * Math.PI) / 180);
                const y2 =
                  100 +
                  80 * Math.sin(((currentAngle + angle - 90) * Math.PI) / 180);

                const largeArcFlag = angle > 180 ? 1 : 0;
                const pathData = [
                  "M",
                  100,
                  100,
                  "L",
                  x1,
                  y1,
                  "A",
                  80,
                  80,
                  0,
                  largeArcFlag,
                  1,
                  x2,
                  y2,
                  "Z",
                ].join(" ");

                const result = (
                  <path
                    key={index}
                    d={pathData}
                    fill={colors[index]}
                    opacity="0.8"
                  />
                );

                currentAngle += angle;
                return result;
              });
            })()}
          </svg>
        </div>
        <div className="space-y-2">
          {chartData.customers.satisfaction.map((item, index) => {
            const colors = [
              "text-green-600",
              "text-blue-600",
              "text-yellow-600",
              "text-red-600",
              "text-gray-600",
            ];
            return (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full bg-current ${colors[index]}`}
                  />
                  {item.rating} نجوم
                </span>
                <span>
                  {item.count} ({formatPercentage(item.percentage)})
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  // Geographic Revenue Distribution
  const renderGeographicChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          التوزيع الجغرافي للإيرادات
        </CardTitle>
        <CardDescription>أداء المناطق المختلفة</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chartData.geographic.districts.slice(0, 8).map((district, index) => {
            const maxRevenue = Math.max(
              ...chartData.geographic.districts.map((d) => d.revenue),
            );
            const widthPercentage = (district.revenue / maxRevenue) * 100;

            return (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{district.name}</span>
                  <div className="flex items-center gap-2">
                    <span>{formatCurrency(district.revenue)}</span>
                    <Badge
                      variant={district.growth > 0 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {district.growth > 0 ? "+" : ""}
                      {formatPercentage(district.growth)}
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-primary/70 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${widthPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {district.bookings} حجز
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  // Operational Efficiency Metrics
  const renderEfficiencyMetrics = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          مؤشرات الكفاءة التشغيلية
        </CardTitle>
        <CardDescription>مقارنة الأداء الحالي بالأهداف</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.operational.efficiency.map((metric, index) => {
            const achievementPercentage =
              (metric.current / metric.target) * 100;
            const isAboveTarget = metric.current >= metric.target;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{metric.current}</span>
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className={`rounded-full h-3 transition-all duration-300 ${
                        isAboveTarget ? "bg-green-500" : "bg-yellow-500"
                      }`}
                      style={{
                        width: `${Math.min(achievementPercentage, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>الهدف: {metric.target}</span>
                    <span>
                      {formatPercentage(achievementPercentage)} من الهدف
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  // Cost Breakdown Chart
  const renderCostBreakdown = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          توزيع التكاليف التشغيلية
        </CardTitle>
        <CardDescription>تحليل مفصل للتكاليف</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {chartData.operational.costs.map((cost, index) => {
            const colors = [
              "bg-blue-500",
              "bg-green-500",
              "bg-yellow-500",
              "bg-red-500",
              "bg-purple-500",
            ];

            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${colors[index]}`} />
                  <span className="text-sm font-medium">{cost.category}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">
                    {formatCurrency(cost.amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatPercentage(cost.percentage)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="اختر المؤشر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">الإيرادات</SelectItem>
              <SelectItem value="services">الخدمات</SelectItem>
              <SelectItem value="customers">العملاء</SelectItem>
              <SelectItem value="operations">العمليات</SelectItem>
              <SelectItem value="geographic">الجغرافيا</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={timeRange}
            onValueChange={(value: any) => setTimeRange(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 أيام</SelectItem>
              <SelectItem value="30d">30 يوم</SelectItem>
              <SelectItem value="90d">90 يوم</SelectItem>
              <SelectItem value="1y">سنة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button size="sm">
          <Activity className="w-4 h-4 mr-2" />
          تحديث البيانات
        </Button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderRevenueLineChart()}
        {renderServicesBarChart()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderSatisfactionPieChart()}
        {renderGeographicChart()}
        {renderEfficiencyMetrics()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderCostBreakdown()}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              أهم الإنجازات
            </CardTitle>
            <CardDescription>النقاط البارزة هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    زيادة الإيرادات
                  </p>
                  <p className="text-sm text-green-600">
                    +18.7% مقارنة بالشهر الماضي
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    عملاء جدد
                  </p>
                  <p className="text-sm text-blue-600">
                    +23 عميل جديد هذا الشهر
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <Target className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    تحقيق الهدف
                  </p>
                  <p className="text-sm text-yellow-600">
                    105% من هدف الحجوزات
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsCharts;
