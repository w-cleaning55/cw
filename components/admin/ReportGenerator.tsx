"use client";

import React, { useState } from "react";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Download,
  FileText,
  Calendar,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Award,
  Clock,
  Printer,
  Mail,
  Share2,
  Settings,
  Eye,
} from "lucide-react";

interface ReportConfig {
  type: "daily" | "weekly" | "monthly" | "quarterly" | "annual" | "custom";
  startDate: string;
  endDate: string;
  sections: {
    overview: boolean;
    revenue: boolean;
    services: boolean;
    customers: boolean;
    geographic: boolean;
    operational: boolean;
    forecasting: boolean;
  };
  format: "pdf" | "excel" | "csv";
  includeCharts: boolean;
  includeDetails: boolean;
  language: "ar" | "en";
}

const ReportGenerator: React.FC = () => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: "monthly",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    sections: {
      overview: true,
      revenue: true,
      services: true,
      customers: true,
      geographic: false,
      operational: false,
      forecasting: false,
    },
    format: "pdf",
    includeCharts: true,
    includeDetails: true,
    language: "ar",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const reportTemplates = [
    {
      id: "executive-summary",
      name: "ملخص تنفيذي",
      description: "تقرير مختصر للإدارة العليا",
      icon: Award,
      sections: ["overview", "revenue", "forecasting"],
      duration: "monthly",
    },
    {
      id: "financial-detailed",
      name: "تقرير مالي مفصل",
      description: "تحليل شامل للوضع المالي",
      icon: DollarSign,
      sections: ["overview", "revenue", "operational"],
      duration: "monthly",
    },
    {
      id: "operations-report",
      name: "تقرير العمليات",
      description: "أداء الفرق والكفاءة التشغيلية",
      icon: BarChart3,
      sections: ["operational", "services", "geographic"],
      duration: "weekly",
    },
    {
      id: "customer-analysis",
      name: "تحليل العملاء",
      description: "سلوك ورضا العملاء",
      icon: Users,
      sections: ["customers", "services", "geographic"],
      duration: "monthly",
    },
    {
      id: "daily-snapshot",
      name: "لقطة يومية",
      description: "ملخص سريع للأداء اليومي",
      icon: Calendar,
      sections: ["overview", "revenue"],
      duration: "daily",
    },
  ];

  const handleTemplateSelect = (template: any) => {
    setReportConfig((prev) => ({
      ...prev,
      type: template.duration as any,
      sections: {
        overview: template.sections.includes("overview"),
        revenue: template.sections.includes("revenue"),
        services: template.sections.includes("services"),
        customers: template.sections.includes("customers"),
        geographic: template.sections.includes("geographic"),
        operational: template.sections.includes("operational"),
        forecasting: template.sections.includes("forecasting"),
      },
    }));
  };

  const handleSectionToggle = (section: keyof ReportConfig["sections"]) => {
    setReportConfig((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section],
      },
    }));
  };

  const generateReport = async () => {
    setIsGenerating(true);

    try {
      // محاكاة عملية إنشاء التقرير
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const reportData = {
        id: `report_${Date.now()}`,
        title: getReportTitle(),
        generatedAt: new Date().toISOString(),
        config: reportConfig,
        data: {
          summary: {
            totalRevenue: 47065.0,
            totalBookings: 135,
            customerSatisfaction: 4.8,
            completionRate: 96.3,
          },
          charts: reportConfig.includeCharts
            ? ["revenue_trend", "service_performance", "customer_satisfaction"]
            : [],
          sections: Object.keys(reportConfig.sections).filter(
            (key) =>
              reportConfig.sections[key as keyof ReportConfig["sections"]],
          ),
        },
      };

      // في التطبيق الحقيقي، سيتم إرسال هذا إلى API
      console.log("تقرير تم إنشاؤه:", reportData);

      // محاكاة تحميل الملف
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportData.title}_${new Date().toISOString().split("T")[0]}.${reportConfig.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("خطأ في إنشاء التقرير:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getReportTitle = () => {
    const types = {
      daily: "تقرير يومي",
      weekly: "تقرير أسبوعي",
      monthly: "تقرير شهري",
      quarterly: "تقرير ربع سنوي",
      annual: "تقرير سنوي",
      custom: "تقرير مخصص",
    };
    return types[reportConfig.type];
  };

  const previewReport = () => {
    const selectedSections = Object.keys(reportConfig.sections).filter(
      (key) => reportConfig.sections[key as keyof ReportConfig["sections"]],
    );

    setPreviewData({
      title: getReportTitle(),
      period: `${reportConfig.startDate} إلى ${reportConfig.endDate}`,
      sections: selectedSections,
      format: reportConfig.format,
      charts: reportConfig.includeCharts,
      details: reportConfig.includeDetails,
    } as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">مولد التقارير</h2>
          <p className="text-muted-foreground">إنشاء تقارير مخصصة وشاملة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewReport}>
            <Eye className="w-4 h-4 mr-2" />
            معاينة
          </Button>
          <Button onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? (
              <Settings className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? "جاري الإنشاء..." : "إنشاء التقرير"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">قوالب التقارير</CardTitle>
            <CardDescription>اختر قالب جاهز أو أنشئ تقرير مخصص</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportTemplates.map((template) => (
              <div
                key={template.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleTemplateSelect(template)}
              >
                <div className="flex items-start gap-3">
                  <template.icon className="w-5 h-5 mt-0.5 text-primary" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {template.description}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {template.sections.map((section) => (
                        <Badge
                          key={section}
                          variant="secondary"
                          className="text-xs"
                        >
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إعدادات التقرير</CardTitle>
            <CardDescription>تخصيص محتوى وتنسيق التقرير</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Report Type */}
            <div className="space-y-2">
              <Label>نوع التقرير</Label>
              <Select
                value={reportConfig.type}
                onValueChange={(value: any) =>
                  setReportConfig((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                  <SelectItem value="annual">سنوي</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>من تاريخ</Label>
                <Input
                  type="date"
                  value={reportConfig.startDate}
                  onChange={(e) =>
                    setReportConfig((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>إلى تاريخ</Label>
                <Input
                  type="date"
                  value={reportConfig.endDate}
                  onChange={(e) =>
                    setReportConfig((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <Label>تنسيق الملف</Label>
              <Select
                value={reportConfig.format}
                onValueChange={(value: any) =>
                  setReportConfig((prev) => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label>اللغة</Label>
              <Select
                value={reportConfig.language}
                onValueChange={(value: any) =>
                  setReportConfig((prev) => ({ ...prev, language: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label>خيارات إضافية</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="charts"
                    checked={reportConfig.includeCharts}
                    onCheckedChange={(checked) =>
                      setReportConfig((prev) => ({
                        ...prev,
                        includeCharts: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="charts" className="text-sm">
                    تضمين الرسوم البيانية
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="details"
                    checked={reportConfig.includeDetails}
                    onCheckedChange={(checked) =>
                      setReportConfig((prev) => ({
                        ...prev,
                        includeDetails: !!checked,
                      }))
                    }
                  />
                  <Label htmlFor="details" className="text-sm">
                    تضمين التفاصيل
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">أقسام التقرير</CardTitle>
            <CardDescription>اختر الأقسام المطلوبة في التقرير</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { key: "overview", label: "نظرة عامة", icon: BarChart3 },
              { key: "revenue", label: "الإيرادات", icon: DollarSign },
              { key: "services", label: "الخدمات", icon: Award },
              { key: "customers", label: "العملاء", icon: Users },
              { key: "geographic", label: "التوزيع الجغرافي", icon: MapPin },
              { key: "operational", label: "العمليات", icon: Clock },
              { key: "forecasting", label: "التوقعات", icon: TrendingUp },
            ].map((section) => (
              <div key={section.key} className="flex items-center space-x-2">
                <Checkbox
                  id={section.key}
                  checked={
                    reportConfig.sections[
                      section.key as keyof ReportConfig["sections"]
                    ]
                  }
                  onCheckedChange={() =>
                    handleSectionToggle(
                      section.key as keyof ReportConfig["sections"],
                    )
                  }
                />
                <Label
                  htmlFor={section.key}
                  className="flex items-center gap-2 text-sm"
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              معاينة التقرير
            </CardTitle>
            <CardDescription>مراجعة محتوى التقرير قبل الإنشاء</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">عنوان التقرير</h4>
                  <p className="text-sm text-muted-foreground">
                    {(previewData as any).title}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">الفترة الزمنية</h4>
                  <p className="text-sm text-muted-foreground">
                    {(previewData as any).period}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">تنسيق الملف</h4>
                  <p className="text-sm text-muted-foreground">
                    {(previewData as any).format.toUpperCase()}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">عدد الأقسام</h4>
                  <p className="text-sm text-muted-foreground">
                    {(previewData as any).sections.length} قسم
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">الأقسام المضمنة</h4>
                <div className="flex flex-wrap gap-2">
                  {(previewData as any).sections.map((section: string) => (
                    <Badge key={section} variant="secondary">
                      {section}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {(previewData as any).charts && (
                  <Badge variant="outline">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    يتضمن رسوم بيانية
                  </Badge>
                )}
                {(previewData as any).details && (
                  <Badge variant="outline">
                    <FileText className="w-3 h-3 mr-1" />
                    يتضمن تفاصيل
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
          <CardDescription>تقارير جاهزة ومهام شائعة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">تقرير اليوم</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">تقرير الأسبوع</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <DollarSign className="w-5 h-5" />
              <span className="text-xs">تقرير مالي</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <Mail className="w-5 h-5" />
              <span className="text-xs">إرسال تلقائي</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;
