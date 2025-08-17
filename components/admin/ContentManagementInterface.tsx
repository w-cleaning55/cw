"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/hooks/useTheme";
import { getLocalizedText } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import DynamicContentManager from "./DynamicContentManager";
import AdvancedImageUploader from "./AdvancedImageUploader";
import ThemeSelector from "../ThemeSelector";
import AIContentAssistant from "./AIContentAssistant";
import {
  Layout,
  Settings,
  Image as ImageIcon,
  Palette,
  BarChart3,
  Users,
  FileText,
  Globe,
  Shield,
  Zap,
  Save,
  Upload,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Copy,
  Share,
  Star,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Rocket,
  Target,
} from "lucide-react";

interface ContentStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  totalImages: number;
  totalThemes: number;
  lastUpdate: string;
  totalViews: number;
  performance: number;
}

interface RecentActivity {
  id: string;
  type: "edit" | "create" | "delete" | "publish";
  item: string;
  user: string;
  timestamp: string;
  details?: string;
}

export default function ContentManagementInterface() {
  const { t, isRTL } = useTranslation();
  const isArabic = isRTL;
  const { currentTheme, isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<ContentStats>({
    totalPages: 12,
    publishedPages: 8,
    draftPages: 4,
    totalImages: 156,
    totalThemes: 4,
    lastUpdate: new Date().toISOString(),
    totalViews: 2847,
    performance: 85,
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "edit",
      item: "الصفحة الرئيسية",
      user: "الأدمن",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      details: "تحديث قسم الخدمات",
    },
    {
      id: "2",
      type: "create",
      item: "صفحة من نحن",
      user: "الأدمن",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      details: "إنشاء صفحة جديدة",
    },
    {
      id: "3",
      type: "publish",
      item: "مقال المدونة",
      user: "الأدمن",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      details: "نصائح التنظيف",
    },
  ]);

  const [quickActions] = useState([
    {
      id: "new-page",
      title: { ar: "صفحة جديدة", en: "New Page" },
      description: { ar: "إنشاء صفحة جديدة", en: "Create a new page" },
      icon: Plus,
      color: "bg-blue-500",
      action: () => setActiveTab("content"),
    },
    {
      id: "upload-images",
      title: { ar: "رفع صور", en: "Upload Images" },
      description: { ar: "رفع صور جديدة", en: "Upload new images" },
      icon: ImageIcon,
      color: "bg-green-500",
      action: () => setActiveTab("media"),
    },
    {
      id: "change-theme",
      title: { ar: "تغيير الثيم", en: "Change Theme" },
      description: { ar: "تخصيص المظهر", en: "Customize appearance" },
      icon: Palette,
      color: "bg-purple-500",
      action: () => setActiveTab("themes"),
    },
    {
      id: "view-analytics",
      title: { ar: "التحليلات", en: "Analytics" },
      description: { ar: "عرض الإحصائيات", en: "View statistics" },
      icon: BarChart3,
      color: "bg-orange-500",
      action: () => setActiveTab("analytics"),
    },
  ]);

  // نظرة عامة
  const renderOverview = () => (
    <div className="space-y-8">
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الصفحات</p>
              <p className="text-3xl font-bold">{stats.totalPages}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% من الشهر الماضي
            </span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">الصفحات المنشورة</p>
              <p className="text-3xl font-bold">{stats.publishedPages}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Progress
              value={(stats.publishedPages / stats.totalPages) * 100}
              className="h-2"
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الصور</p>
              <p className="text-3xl font-bold">{stats.totalImages}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            +{Math.floor(stats.totalImages * 0.15)} هذا الأسبوع
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">أداء الموقع</p>
              <p className="text-3xl font-bold">{stats.performance}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={stats.performance} className="h-2" />
          </div>
        </Card>
      </div>

      {/* الإجراءات السريعة */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            الإجراءات السريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all"
                onClick={action.action}
              >
                <div
                  className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">
                    {getLocalizedText(action.title, isArabic, "إجراء")}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getLocalizedText(action.description, isArabic, "وصف")}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* النشاط الأخير والإشعارات */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* النشاط الأخير */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              ا��نشاط الأخير
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "edit"
                        ? "bg-blue-100"
                        : activity.type === "create"
                          ? "bg-green-100"
                          : activity.type === "delete"
                            ? "bg-red-100"
                            : "bg-purple-100"
                    }`}
                  >
                    {activity.type === "edit" && (
                      <Edit className="w-4 h-4 text-blue-600" />
                    )}
                    {activity.type === "create" && (
                      <Plus className="w-4 h-4 text-green-600" />
                    )}
                    {activity.type === "delete" && (
                      <Trash2 className="w-4 h-4 text-red-600" />
                    )}
                    {activity.type === "publish" && (
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.item}</p>
                    <p className="text-xs text-gray-500">{activity.details}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(activity.timestamp).toLocaleString("ar-SA")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* الإشعارات والتحديثات */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              الإشعارات والتحديثات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      تحديث جديد متاح
                    </p>
                    <p className="text-xs text-blue-700">
                      إصدار 2.1.0 يتضمن مميزات جديدة
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      نسخة احتياطية تمت
                    </p>
                    <p className="text-xs text-green-700">
                      آخر نسخة احتياطية: اليوم 3:00 ص
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      تحسين الأداء
                    </p>
                    <p className="text-xs text-yellow-700">
                      يمكن ضغط 23 صورة لتحسين السرعة
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* نصائح وإرشادات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            نصائح لتحسين المحتوى
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">تحسين SEO</h3>
              <p className="text-sm text-gray-600">
                استخدم الكلمات المفتاحية المناسبة في العناوين والأوصاف
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <Rocket className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">سرعة التحميل</h3>
              <p className="text-sm text-gray-600">
                قم بضغط الصور وتحسين أحجامها لتسريع الموقع
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <Users className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">تجربة المستخدم</h3>
              <p className="text-sm text-gray-600">
                اجعل التنقل سهلاً والمحتوى مرتباً ومفهوماً
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // التحليلات والتقارير
  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            تحليلات الموقع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">إجمالي الزيارات</div>
              <div className="text-xs text-green-600 mt-1">
                +15% من الشهر الماضي
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">64%</div>
              <div className="text-sm text-gray-600">معدل الارتداد</div>
              <div className="text-xs text-red-600 mt-1">
                -8% من الشهر الماضي
              </div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                3.2 دقيقة
              </div>
              <div className="text-sm text-gray-600">متوسط وقت البقاء</div>
              <div className="text-xs text-green-600 mt-1">
                +12% من الشهر الماضي
              </div>
            </div>
          </div>

          {/* رسم بياني بسيط */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">الزيارات الأسبوعية</h3>
            <div className="flex items-end justify-between h-40 gap-2">
              {[420, 380, 520, 460, 580, 640, 720].map((value, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-blue-500 rounded-t w-8 transition-all duration-500"
                    style={{ height: `${(value / 720) * 100}%` }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">
                    {["س", "ح", "ث", "ر", "خ", "ج", "س"][index]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* أداء الصفحات */}
      <Card>
        <CardHeader>
          <CardTitle>أداء الصفحات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { page: "الصفحة الرئيسية", views: 1247, performance: 92 },
              { page: "صفحة الخدمات", views: 856, performance: 88 },
              { page: "من نحن", views: 423, performance: 85 },
              { page: "اتصل بنا", views: 321, performance: 90 },
            ].map((page, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-medium">{page.page}</div>
                  <div className="text-sm text-gray-600">
                    {page.views} زيارة
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={page.performance} className="w-20 h-2" />
                  <span className="text-sm font-medium">
                    {page.performance}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // الإعدادات المتقدمة
  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      {/* إعدادات الأداء */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            إعدادات الأداء
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">ضغط الصور تلقائياً</Label>
              <p className="text-sm text-gray-600">
                تقليل حجم الصور لتحسين سرعة التحميل
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">تفعيل التخزين المؤقت</Label>
              <p className="text-sm text-gray-600">
                تسريع تحميل الصفحات للزوار المتكررين
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">تحميل الصور التدريجي</Label>
              <p className="text-sm text-gray-600">
                تحميل الصور عند الحاجة فقط
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* إعدادات الأمان */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            إعدادات الأمان
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">المصادقة الثنائية</Label>
              <p className="text-sm text-gray-600">حماية إضافية لحساب الأدمن</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">تسجيل النشاطات</Label>
              <p className="text-sm text-gray-600">حفظ سجل بجميع التغييرات</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">النسخ الاحتياطي التلقائي</Label>
              <p className="text-sm text-gray-600">
                إنشاء نسخة احتياطية يومياً
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* أدوات المطور */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            أدوات المطور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
            >
              <Download className="w-6 h-6" />
              <span>تصدير البيانات</span>
              <span className="text-xs text-gray-500">
                تحميل نسخة من جميع البيانات
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
            >
              <Upload className="w-6 h-6" />
              <span>استيراد البيانات</span>
              <span className="text-xs text-gray-500">
                رفع بيانات من ملف خارجي
              </span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
            >
              <RefreshCw className="w-6 h-6" />
              <span>إعادة تعيين التخزين المؤقت</span>
              <span className="text-xs text-gray-500">مسح الملفات المؤقتة</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
            >
              <Globe className="w-6 h-6" />
              <span>اختبار الروابط</span>
              <span className="text-xs text-gray-500">فحص الروابط المعطلة</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        {/* العنوان الرئيسي */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">إدارة المحتوى المتكاملة</h1>
          <p className="text-gray-600 dark:text-gray-400">
            تحكم كامل في محتوى وإعدادات موقعك من مكان واحد
          </p>
        </div>

        {/* التبويبات الرئيسية */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              <span className="hidden md:inline">المحتوى</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span className="hidden md:inline">الوسائط</span>
            </TabsTrigger>
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden md:inline">الثيمات</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden md:inline">التحليلات</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">الإعدادات</span>
            </TabsTrigger>
          </TabsList>

          {/* المحتوى */}
          <TabsContent value="overview" className="space-y-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <DynamicContentManager />
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <AdvancedImageUploader showLibrary={true} />
          </TabsContent>

          <TabsContent value="themes" className="space-y-6">
            <ThemeSelector showAdvanced={true} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {renderAnalytics()}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {renderAdvancedSettings()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
