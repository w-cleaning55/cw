"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedText } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Save,
  Edit,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Settings,
  Globe,
  Type,
  Layout,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Copy,
  Check,
  X,
  Bot,
  Sparkles,
} from "lucide-react";
import AIContentAssistant from "./AIContentAssistant";

interface DynamicContent {
  homepage: {
    hero: any;
    services: any;
    features: any;
    about: any;
    testimonials: any;
    contact: any;
  };
  settings: any;
  navigation: any;
  metadata: any;
}

interface ContentSection {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  lastModified: string;
}

export default function DynamicContentManager() {
  const { t, currentLanguage, isRTL } = useTranslation();
  const language = currentLanguage;
  const isArabic = isRTL;
  const [content, setContent] = useState<DynamicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("homepage");
  const [editMode, setEditMode] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // تحميل المحتوى
  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dynamic-content");
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async () => {
    if (!content) return;

    try {
      setSaving(true);
      const response = await fetch("/api/dynamic-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setUnsavedChanges(false);
        // إظهار رسالة نجاح
      }
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (path: string[], value: any) => {
    if (!content) return;

    const newContent: any = { ...content };
    let current: any = newContent;

    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i] as any];
    }

    current[path[path.length - 1] as any] = value;
    setContent(newContent);
    setUnsavedChanges(true);
  };

  const getNestedValue = (obj: any, path: string[]) => {
    return path.reduce((current, key) => current?.[key], obj);
  };

  // مكون تحرير النص متعدد اللغات مع مساعد AI
  const MultiLanguageInput = ({
    path,
    label,
    type = "text",
    required = false,
    aiMode = "content",
    placeholder = "",
    showAI = true,
  }: {
    path: string[];
    label: string;
    type?: string;
    required?: boolean;
    aiMode?:
      | "title"
      | "description"
      | "seo"
      | "keywords"
      | "content"
      | "social"
      | "email";
    placeholder?: string;
    showAI?: boolean;
  }) => {
    const value = getNestedValue(content, path);

    const handleAIGenerate = (
      generated: string | { ar: string; en: string },
    ) => {
      if (typeof generated === "string") {
        // محتوى بلغة واحدة
        updateContent([...path, isArabic ? "ar" : "en"], generated);
      } else {
        // محتوى متعدد اللغات
        updateContent([...path, "ar"], generated.ar);
        updateContent([...path, "en"], generated.en);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          {showAI && (
            <AIContentAssistant
              mode={aiMode}
              language="both"
              context={`${label} - ${placeholder}`}
              currentValue={value?.ar || value?.en || ""}
              onGenerate={handleAIGenerate}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">العربية</Label>
              {showAI && (
                <AIContentAssistant
                  mode={aiMode}
                  language="ar"
                  context={`${label} - العربية`}
                  currentValue={value?.ar || ""}
                  onGenerate={(generated) =>
                    updateContent([...path, "ar"], generated as string)
                  }
                />
              )}
            </div>
            {type === "textarea" ? (
              <Textarea
                value={value?.ar || ""}
                onChange={(e) => updateContent([...path, "ar"], e.target.value)}
                className="mt-1"
                rows={3}
                dir="rtl"
                placeholder={placeholder}
              />
            ) : (
              <Input
                type={type}
                value={value?.ar || ""}
                onChange={(e) => updateContent([...path, "ar"], e.target.value)}
                className="mt-1"
                dir="rtl"
                placeholder={placeholder}
              />
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-500">English</Label>
              {showAI && (
                <AIContentAssistant
                  mode={aiMode}
                  language="en"
                  context={`${label} - English`}
                  currentValue={value?.en || ""}
                  onGenerate={(generated) =>
                    updateContent([...path, "en"], generated as string)
                  }
                />
              )}
            </div>
            {type === "textarea" ? (
              <Textarea
                value={value?.en || ""}
                onChange={(e) => updateContent([...path, "en"], e.target.value)}
                className="mt-1"
                rows={3}
                dir="ltr"
                placeholder={placeholder}
              />
            ) : (
              <Input
                type={type}
                value={value?.en || ""}
                onChange={(e) => updateContent([...path, "en"], e.target.value)}
                className="mt-1"
                dir="ltr"
                placeholder={placeholder}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // مكون تحرير الصورة
  const ImageUploader = ({
    path,
    label,
    accept = "image/*",
  }: {
    path: string[];
    label: string;
    accept?: string;
  }) => {
    const [uploading, setUploading] = useState(false);
    const currentImage = getNestedValue(content, path);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("category", "content");
        formData.append("type", "website");

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          updateContent(path, result.imageUrl);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {currentImage && (
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
              <img
                src={currentImage}
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() =>
                  document.getElementById(`upload-${path.join("-")}`)?.click()
                }
              >
                {uploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploading ? "جارٍ الرفع..." : "رفع صورة"}
              </Button>
              {currentImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateContent(path, "")}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            <input
              id={`upload-${path.join("-")}`}
              type="file"
              accept={accept}
              onChange={handleUpload}
              className="hidden"
            />
            {currentImage && (
              <Input
                value={currentImage}
                onChange={(e) => updateContent(path, e.target.value)}
                placeholder="أو أدخل رابط الصورة"
                className="mt-2 text-sm"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // مكون تحرير القائمة
  const ListEditor = ({
    path,
    label,
    itemTemplate,
  }: {
    path: string[];
    label: string;
    itemTemplate: any;
  }) => {
    const items = getNestedValue(content, path) || [];

    const addItem = () => {
      const newItems = [
        ...items,
        { ...itemTemplate, id: Date.now().toString() },
      ];
      updateContent(path, newItems);
    };

    const removeItem = (index: number) => {
      const newItems = items.filter((_: any, i: number) => i !== index);
      updateContent(path, newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      updateContent(path, newItems);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <Button size="sm" onClick={addItem}>
            <Plus className="w-4 h-4" />
            إضافة عنصر
          </Button>
        </div>
        <div className="space-y-3">
          {items.map((item: any, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium">العنصر {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(itemTemplate).map((field) => {
                  if (field === "id") return null;

                  if (
                    typeof itemTemplate[field] === "object" &&
                    itemTemplate[field].ar
                  ) {
                    return (
                      <div key={field}>
                        <Label className="text-xs text-gray-500 mb-1 block">
                          {field}
                        </Label>
                        <div className="space-y-2">
                          <Input
                            placeholder="العربية"
                            value={item[field]?.ar || ""}
                            onChange={(e) =>
                              updateItem(index, field, {
                                ...item[field],
                                ar: e.target.value,
                              })
                            }
                            dir="rtl"
                          />
                          <Input
                            placeholder="English"
                            value={item[field]?.en || ""}
                            onChange={(e) =>
                              updateItem(index, field, {
                                ...item[field],
                                en: e.target.value,
                              })
                            }
                            dir="ltr"
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={field}>
                      <Label className="text-xs text-gray-500 mb-1 block">
                        {field}
                      </Label>
                      <Input
                        value={item[field] || ""}
                        onChange={(e) =>
                          updateItem(index, field, e.target.value)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">فشل في تحميل المحتوى</p>
        <Button onClick={loadContent} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إدارة المحتوى الديناميكي</h1>
          <p className="text-gray-600 mt-1">
            تحكم في محتوى وإعدادات الموقع بسهولة
          </p>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Monitor className="w-4 h-4" />
            <Switch checked={previewMode} onCheckedChange={setPreviewMode} />
            <span className="text-sm">معاينة</span>
          </div>
          <Button
            onClick={saveContent}
            disabled={saving || !unsavedChanges}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </div>

      {/* إشعار التغييرات غير المحفوظة */}
      {unsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-yellow-800">يوجد تغييرات غير محفوظة</span>
          </div>
        </div>
      )}

      {/* التبويبات الرئيسية */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="homepage"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Layout className="w-4 h-4" />
            <span>الصفحة الرئيسية</span>
          </TabsTrigger>
          <TabsTrigger
            value="navigation"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Globe className="w-4 h-4" />
            <span>التنقل</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Settings className="w-4 h-4" />
            <span>الإعدادات</span>
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Type className="w-4 h-4" />
            <span>متقدم</span>
          </TabsTrigger>
        </TabsList>

        {/* محتوى الصفحة الرئيسية */}
        <TabsContent value="homepage" className="space-y-6">
          {/* ترتيب الأقسام بالسحب والإفلات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Layout className="w-5 h-5" />
                <span>ترتيب الأقسام</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2" dir="rtl">
                {((content as any)?.homepage?.order || ["hero","services","features","about","testimonials","contact"]).map((secId: string, idx: number) => (
                  <div
                    key={secId}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border"
                    draggable
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex === null || dragIndex === idx) return;
                      const arr = [...(((content as any).homepage.order) || [])];
                      const [moved] = arr.splice(dragIndex, 1);
                      arr.splice(idx, 0, moved);
                      updateContent(["homepage","order"], arr as any);
                      setDragIndex(null);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="cursor-grab">≡</span>
                      <span className="font-medium">
                        {secId === 'hero' ? 'البانر' : secId === 'services' ? 'الخدمات' : secId === 'features' ? 'المميزات' : secId === 'about' ? 'من نحن' : secId === 'testimonials' ? 'الآراء' : 'التواصل'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                                                     const arr = [...(((content as any).homepage.order) || [])];
                           if (idx > 0) {
                             [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                             updateContent(["homepage","order"], arr as any);
                           }
                        }}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                                                     const arr = [...(((content as any).homepage.order) || [])];
                           if (idx < arr.length - 1) {
                             [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                             updateContent(["homepage","order"], arr as any);
                           }
                        }}
                      >
                        ↓
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* قسم البانر الرئيسي */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Layout className="w-5 h-5" />
                  <span>البانر الرئيسي (Hero Section)</span>
                </CardTitle>
                <Switch
                  checked={content.homepage.hero.visible !== false}
                  onCheckedChange={(checked) =>
                    updateContent(["homepage", "hero", "visible"], checked)
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">نمط المكوّن</Label>
                <select
                  value={content.homepage.hero.component || 'modern'}
                  onChange={(e) => updateContent(["homepage","hero","component"], e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="modern">عصري (Modern)</option>
                  <option value="simple">بسيط (Simple)</option>
                  <option value="premium">مميز (Premium)</option>
                </select>
              </div>
              <MultiLanguageInput
                path={["homepage", "hero", "title"]}
                label="العنوان الرئيسي"
                required
                aiMode="title"
                placeholder="عنوان جذاب للبانر الرئيسي"
              />
              <MultiLanguageInput
                path={["homepage", "hero", "subtitle"]}
                label="العنوان الفرعي"
                required
                aiMode="title"
                placeholder="عنوان فرعي يكمل العنوان الرئيسي"
              />
              <MultiLanguageInput
                path={["homepage", "hero", "description"]}
                label="الوصف"
                type="textarea"
                aiMode="description"
                placeholder="وصف شامل عن الشركة وخدماتها"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MultiLanguageInput
                  path={["homepage", "hero", "cta"]}
                  label="نص الزر الأساسي"
                  aiMode="content"
                  placeholder="نص دعوة للعمل جذاب"
                />
                <MultiLanguageInput
                  path={["homepage", "hero", "ctaSecondary"]}
                  label="نص الزر الثانوي"
                  aiMode="content"
                  placeholder="نص الزر الثانوي"
                />
              </div>
              <ImageUploader
                path={["homepage", "hero", "backgroundImage"]}
                label="صورة الخلفية"
              />

              {/* إحصائيات البانر */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium">الإحصائيات</Label>
                  <Switch
                    checked={content.homepage.hero.statsVisible}
                    onCheckedChange={(checked) =>
                      updateContent(
                        ["homepage", "hero", "statsVisible"],
                        checked,
                      )
                    }
                  />
                </div>
                {content.homepage.hero.statsVisible && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.keys(content.homepage.hero.stats).map((stat) => (
                      <Card key={stat} className="p-4">
                        <Label className="text-xs text-gray-500 mb-2 block">
                          {stat}
                        </Label>
                        <Input
                          value={content.homepage.hero.stats[stat].value}
                          onChange={(e) =>
                            updateContent(
                              ["homepage", "hero", "stats", stat, "value"],
                              e.target.value,
                            )
                          }
                          placeholder="القيمة"
                          className="mb-2"
                        />
                        <div className="space-y-2">
                          <Input
                            value={content.homepage.hero.stats[stat].label.ar}
                            onChange={(e) =>
                              updateContent(
                                [
                                  "homepage",
                                  "hero",
                                  "stats",
                                  stat,
                                  "label",
                                  "ar",
                                ],
                                e.target.value,
                              )
                            }
                            placeholder="التسمية بالعربية"
                            dir="rtl"
                          />
                          <Input
                            value={content.homepage.hero.stats[stat].label.en}
                            onChange={(e) =>
                              updateContent(
                                [
                                  "homepage",
                                  "hero",
                                  "stats",
                                  stat,
                                  "label",
                                  "en",
                                ],
                                e.target.value,
                              )
                            }
                            placeholder="التسمية بالإنجليزية"
                            dir="ltr"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* قسم الخدمات */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Settings className="w-5 h-5" />
                  <span>قسم الخدمات</span>
                </CardTitle>
                <Switch
                  checked={content.homepage.services.visible}
                  onCheckedChange={(checked) =>
                    updateContent(["homepage", "services", "visible"], checked)
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">نمط المكوّن</Label>
                <select
                  value={content.homepage.services.component || 'premium'}
                  onChange={(e) => updateContent(["homepage","services","component"], e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="premium">بطاقات مميزة (Premium)</option>
                  <option value="standard">قياسي (Standard)</option>
                  <option value="minimal">بسيط (Minimal)</option>
                </select>
              </div>
              <MultiLanguageInput
                path={["homepage", "services", "title"]}
                label="العنوان"
                required
                aiMode="title"
                placeholder="عنوان قسم الخدمات"
              />
              <MultiLanguageInput
                path={["homepage", "services", "subtitle"]}
                label="العنوان الفرعي"
                aiMode="description"
                placeholder="وصف موجز لقسم الخدمات"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    عدد الخدمات المعروضة
                  </Label>
                  <Input
                    type="number"
                    value={content.homepage.services.showCount}
                    onChange={(e) =>
                      updateContent(
                        ["homepage", "services", "showCount"],
                        parseInt(e.target.value),
                      )
                    }
                    min="1"
                    max="12"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">تخطيط العرض</Label>
                  <select
                    value={content.homepage.services.layout}
                    onChange={(e) =>
                      updateContent(
                        ["homepage", "services", "layout"],
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="grid">شبكة</option>
                    <option value="slider">شريط منزلق</option>
                    <option value="list">قائمة</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium">نمط البطاقة</Label>
                  <select
                    value={content.homepage.services.cardStyle}
                    onChange={(e) =>
                      updateContent(
                        ["homepage", "services", "cardStyle"],
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="modern">عصري</option>
                    <option value="classic">كلاسيكي</option>
                    <option value="minimal">بسيط</option>
                  </select>
                </div>
              </div>
              <MultiLanguageInput
                path={["homepage", "services", "viewAllButton"]}
                label="نص زر عرض الكل"
                aiMode="content"
                placeholder="نص الزر لعرض جميع الخدمات"
              />
            </CardContent>
          </Card>

          {/* قسم المميزات */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Check className="w-5 h-5" />
                  <span>قسم المميزات</span>
                </CardTitle>
                <Switch
                  checked={content.homepage.features.visible}
                  onCheckedChange={(checked) =>
                    updateContent(["homepage", "features", "visible"], checked)
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">نمط المكوّن</Label>
                <select
                  value={content.homepage.features.component || 'standard'}
                  onChange={(e) => updateContent(["homepage","features","component"], e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="standard">قياسي</option>
                  <option value="icons">أيقونات كبيرة</option>
                  <option value="compact">مضغوط</option>
                </select>
              </div>
              <MultiLanguageInput
                path={["homepage", "features", "title"]}
                label="العنوان"
                required
                aiMode="title"
                placeholder="عنوان قسم المميزات"
              />
              <MultiLanguageInput
                path={["homepage", "features", "subtitle"]}
                label="العنوان الفرعي"
                aiMode="description"
                placeholder="وصف موجز لمميزات الشركة"
              />

              <ListEditor
                path={["homepage", "features", "items"]}
                label="المميزات"
                itemTemplate={{
                  id: "",
                  icon: "Star",
                  title: { ar: "", en: "" },
                  description: { ar: "", en: "" },
                }}
              />
            </CardContent>
          </Card>

          {/* قسم من نحن */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Globe className="w-5 h-5" />
                  <span>قسم من نحن</span>
                </CardTitle>
                <Switch
                  checked={content.homepage.about.visible}
                  onCheckedChange={(checked) =>
                    updateContent(["homepage", "about", "visible"], checked)
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">نمط المكوّن</Label>
                <select
                  value={content.homepage.about.component || 'standard'}
                  onChange={(e) => updateContent(["homepage","about","component"], e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="standard">صورة ونص</option>
                  <option value="split">صورة مقسومة</option>
                  <option value="cards">بطاقات</option>
                </select>
              </div>
              <MultiLanguageInput
                path={["homepage", "about", "title"]}
                label="العنوان"
                required
              />
              <MultiLanguageInput
                path={["homepage", "about", "subtitle"]}
                label="العنوان الفرعي"
              />
              <MultiLanguageInput
                path={["homepage", "about", "description"]}
                label="الوصف"
                type="textarea"
              />
              <ImageUploader
                path={["homepage", "about", "image"]}
                label="الصورة الرئيسية"
              />
              <div>
                <Label className="text-sm font-medium">
                  رابط الفيديو (اختياري)
                </Label>
                <Input
                  value={content.homepage.about.videoUrl}
                  onChange={(e) =>
                    updateContent(
                      ["homepage", "about", "videoUrl"],
                      e.target.value,
                    )
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>
            </CardContent>
          </Card>

          {/* قسم آراء العملاء */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Type className="w-5 h-5" />
                  <span>قسم آراء العملاء</span>
                </CardTitle>
                <Switch
                  checked={content.homepage.testimonials.visible}
                  onCheckedChange={(checked) =>
                    updateContent(
                      ["homepage", "testimonials", "visible"],
                      checked,
                    )
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">نمط المكوّن</Label>
                <select
                  value={content.homepage.testimonials.component || 'standard'}
                  onChange={(e) => updateContent(["homepage","testimonials","component"], e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="standard">بطاقات</option>
                  <option value="carousel">كاروسيل</option>
                  <option value="minimal">قائمة بسيطة</option>
                </select>
              </div>
              <MultiLanguageInput
                path={["homepage", "testimonials", "title"]}
                label="العنوان"
                required
              />
              <MultiLanguageInput
                path={["homepage", "testimonials", "subtitle"]}
                label="العنوان الفرعي"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    عدد الآراء المعروضة
                  </Label>
                  <Input
                    type="number"
                    value={content.homepage.testimonials.showCount}
                    onChange={(e) =>
                      updateContent(
                        ["homepage", "testimonials", "showCount"],
                        parseInt(e.target.value),
                      )
                    }
                    min="1"
                    max="10"
                  />
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    checked={content.homepage.testimonials.autoSlide}
                    onCheckedChange={(checked) =>
                      updateContent(
                        ["homepage", "testimonials", "autoSlide"],
                        checked,
                      )
                    }
                  />
                  <Label className="text-sm">انزلاق تلقائي</Label>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    فترة الانزلاق (بالثواني)
                  </Label>
                  <Input
                    type="number"
                    value={content.homepage.testimonials.slideInterval / 1000}
                    onChange={(e) =>
                      updateContent(
                        ["homepage", "testimonials", "slideInterval"],
                        parseInt(e.target.value) * 1000,
                      )
                    }
                    min="3"
                    max="10"
                    disabled={!content.homepage.testimonials.autoSlide}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    checked={content.homepage.testimonials.showRatings}
                    onCheckedChange={(checked) =>
                      updateContent(
                        ["homepage", "testimonials", "showRatings"],
                        checked,
                      )
                    }
                  />
                  <Label className="text-sm">عرض التقييمات</Label>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    checked={content.homepage.testimonials.showDates}
                    onCheckedChange={(checked) =>
                      updateContent(
                        ["homepage", "testimonials", "showDates"],
                        checked,
                      )
                    }
                  />
                  <Label className="text-sm">عرض التواريخ</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* قسم التواصل */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Globe className="w-5 h-5" />
                  <span>قسم التواصل</span>
                </CardTitle>
                <Switch
                  checked={content.homepage.contact.visible}
                  onCheckedChange={(checked) =>
                    updateContent(["homepage", "contact", "visible"], checked)
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">نمط المكوّن</Label>
                <select
                  value={content.homepage.contact.component || 'formMap'}
                  onChange={(e) => updateContent(["homepage","contact","component"], e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="formMap">نموذج + خريطة</option>
                  <option value="cards">بطاقات تواصل</option>
                  <option value="cta">دعوة لاتصال</option>
                </select>
              </div>
              <MultiLanguageInput
                path={["homepage", "contact", "title"]}
                label="العنوان"
                required
              />
              <MultiLanguageInput
                path={["homepage", "contact", "subtitle"]}
                label="العنوان الفرعي"
              />
              <MultiLanguageInput
                path={["homepage", "contact", "description"]}
                label="الوصف"
                type="textarea"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MultiLanguageInput
                  path={["homepage", "contact", "ctaPrimary"]}
                  label="نص الزر الأساسي"
                />
                <MultiLanguageInput
                  path={["homepage", "contact", "ctaSecondary"]}
                  label="نص الزر الثانوي"
                />
              </div>
              <ImageUploader
                path={["homepage", "contact", "backgroundImage"]}
                label="صورة الخلفية"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* محتوى التنقل */}
        <TabsContent value="navigation" className="space-y-6">
          {/* إعدادات الهيدر */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Layout className="w-5 h-5" />
                <span>إعدادات الهيدر</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* اللوجو */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">اللوجو</Label>
                <ImageUploader
                  path={["navigation", "header", "logo", "image"]}
                  label="اللوجو الافتراضي"
                />
                <ImageUploader
                  path={["navigation", "header", "logo", "imageAr"]}
                  label="اللوجو العربي"
                />
                <MultiLanguageInput
                  path={["navigation", "header", "logo", "text"]}
                  label="نص اللوجو"
                />
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    checked={content.navigation.header.logo.showText}
                    onCheckedChange={(checked) =>
                      updateContent(
                        ["navigation", "header", "logo", "showText"],
                        checked,
                      )
                    }
                  />
                  <Label className="text-sm">عرض نص اللوجو</Label>
                </div>
              </div>

              {/* القائمة الرئيسية */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">القائمة الرئيسية</Label>
                <ListEditor
                  path={["navigation", "header", "menu"]}
                  label="عناصر القائمة"
                  itemTemplate={{
                    id: "",
                    label: { ar: "", en: "" },
                    url: "",
                    active: true,
                    order: 1,
                    style: "normal",
                  }}
                />
              </div>

              {/* إعدادات أخرى */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium">
                    معلومات التواصل في الهيدر
                  </Label>
                  <Input
                    value={content.navigation.header.contactInfo.phone}
                    onChange={(e) =>
                      updateContent(
                        ["navigation", "header", "contactInfo", "phone"],
                        e.target.value,
                      )
                    }
                    placeholder="رقم الهاتف"
                  />
                  <Input
                    value={content.navigation.header.contactInfo.whatsapp}
                    onChange={(e) =>
                      updateContent(
                        ["navigation", "header", "contactInfo", "whatsapp"],
                        e.target.value,
                      )
                    }
                    placeholder="رقم الواتساب"
                  />
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Switch
                      checked={
                        content.navigation.header.contactInfo.showInHeader
                      }
                      onCheckedChange={(checked) =>
                        updateContent(
                          [
                            "navigation",
                            "header",
                            "contactInfo",
                            "showInHeader",
                          ],
                          checked,
                        )
                      }
                    />
                    <Label className="text-sm">عرض في الهيدر</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-medium">إعدادات إضافية</Label>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Switch
                      checked={content.navigation.header.languageSelector.show}
                      onCheckedChange={(checked) =>
                        updateContent(
                          ["navigation", "header", "languageSelector", "show"],
                          checked,
                        )
                      }
                    />
                    <Label className="text-sm">محول اللغة</Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Switch
                      checked={content.navigation.header.themeSelector.show}
                      onCheckedChange={(checked) =>
                        updateContent(
                          ["navigation", "header", "themeSelector", "show"],
                          checked,
                        )
                      }
                    />
                    <Label className="text-sm">محول الثيم</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* إعدادات الفوتر */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Layout className="w-5 h-5" />
                <span>إعدادات الفوتر</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* أعمدة الفوتر */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">أعمدة الفوتر</Label>
                <ListEditor
                  path={["navigation", "footer", "columns"]}
                  label="الأعمدة"
                  itemTemplate={{
                    id: "",
                    title: { ar: "", en: "" },
                    links: [],
                  }}
                />
              </div>

              {/* وسائل التواصل الاجتماعي */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">
                    وسائل التواصل الاجتماعي
                  </Label>
                  <Switch
                    checked={content.navigation.footer.socialMedia.show}
                    onCheckedChange={(checked) =>
                      updateContent(
                        ["navigation", "footer", "socialMedia", "show"],
                        checked,
                      )
                    }
                  />
                </div>
                {content.navigation.footer.socialMedia.show && (
                  <ListEditor
                    path={["navigation", "footer", "socialMedia", "platforms"]}
                    label="المنصات"
                    itemTemplate={{
                      name: "",
                      url: "",
                      icon: "",
                    }}
                  />
                )}
              </div>

              {/* النشرة الإخبارية */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-medium">
                    النشرة الإخبارية
                  </Label>
                  <Switch
                    checked={content.navigation.footer.newsletter.show}
                    onCheckedChange={(checked) =>
                      updateContent(
                        ["navigation", "footer", "newsletter", "show"],
                        checked,
                      )
                    }
                  />
                </div>
                {content.navigation.footer.newsletter.show && (
                  <div className="space-y-4">
                    <MultiLanguageInput
                      path={["navigation", "footer", "newsletter", "title"]}
                      label="العنوان"
                    />
                    <MultiLanguageInput
                      path={[
                        "navigation",
                        "footer",
                        "newsletter",
                        "placeholder",
                      ]}
                      label="النص الافتراضي"
                    />
                    <MultiLanguageInput
                      path={["navigation", "footer", "newsletter", "button"]}
                      label="نص الزر"
                    />
                  </div>
                )}
              </div>

              {/* حقوق النشر */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">حقوق النشر</Label>
                <MultiLanguageInput
                  path={["navigation", "footer", "copyright", "text"]}
                  label="نص حقوق النشر"
                />
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    checked={content.navigation.footer.copyright.showYear}
                    onCheckedChange={(checked) =>
                      updateContent(
                        ["navigation", "footer", "copyright", "showYear"],
                        checked,
                      )
                    }
                  />
                  <Label className="text-sm">عرض السنة الحالية</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* محتوى الإعدادات */}
        <TabsContent value="settings" className="space-y-6">
          {/* الإعدادات الأساسية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Settings className="w-5 h-5" />
                <span>الإعدادات الأساسية</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <MultiLanguageInput
                path={["settings", "siteName"]}
                label="اسم الموقع"
                required
              />
              <MultiLanguageInput
                path={["settings", "siteDescription"]}
                label="وصف الموقع"
                type="textarea"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">
                    اللغة الافتراضية
                  </Label>
                  <select
                    value={content.settings.defaultLanguage}
                    onChange={(e) =>
                      updateContent(
                        ["settings", "defaultLanguage"],
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    checked={content.settings.enableMultiLanguage}
                    onCheckedChange={(checked) =>
                      updateContent(
                        ["settings", "enableMultiLanguage"],
                        checked,
                      )
                    }
                  />
                  <Label className="text-sm">تفعيل تعدد اللغات</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* إعدادات الثيم */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Palette className="w-5 h-5" />
                <span>إعدادات الثيم</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(content.settings.theme).map((color) => (
                  <div key={color}>
                    <Label className="text-sm font-medium capitalize">
                      {color}
                    </Label>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mt-1">
                      <Input
                        type="color"
                        value={content.settings.theme[color]}
                        onChange={(e) =>
                          updateContent(
                            ["settings", "theme", color],
                            e.target.value,
                          )
                        }
                        className="w-12 h-8 p-1"
                      />
                      <Input
                        value={content.settings.theme[color]}
                        onChange={(e) =>
                          updateContent(
                            ["settings", "theme", color],
                            e.target.value,
                          )
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* إعدادات التخطيط */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Layout className="w-5 h-5" />
                <span>إعدادات التخطيط</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">نمط الهيدر</Label>
                  <select
                    value={content.settings.layout.headerStyle}
                    onChange={(e) =>
                      updateContent(
                        ["settings", "layout", "headerStyle"],
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="modern">عصري</option>
                    <option value="classic">كلاسيكي</option>
                    <option value="minimal">بسيط</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium">نمط الفوتر</Label>
                  <select
                    value={content.settings.layout.footerStyle}
                    onChange={(e) =>
                      updateContent(
                        ["settings", "layout", "footerStyle"],
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="detailed">مفصل</option>
                    <option value="simple">بسيط</option>
                    <option value="minimal">مينيمال</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  العرض الأقصى للحاوي
                </Label>
                <Input
                  value={content.settings.layout.containerMaxWidth}
                  onChange={(e) =>
                    updateContent(
                      ["settings", "layout", "containerMaxWidth"],
                      e.target.value,
                    )
                  }
                  placeholder="1280px"
                />
              </div>
            </CardContent>
          </Card>

          {/* المميزات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Check className="w-5 h-5" />
                <span>المميزات</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.keys(content.settings.features).map((feature) => (
                <div
                  key={feature}
                  className="flex items-center justify-between"
                >
                  <Label className="text-sm font-medium">{feature}</Label>
                  <Switch
                    checked={content.settings.features[feature]}
                    onCheckedChange={(checked) =>
                      updateContent(["settings", "features", feature], checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* محتوى متقدم */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Type className="w-5 h-5" />
                <span>إعدادات متقدمة</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  تحذير: هذه الإعدادات للمطورين المتقدمين فقط. تغييرها قد يؤثر
                  على عمل الموقع.
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  معرف البيانات الوصفية
                </Label>
                <Input
                  value={content.metadata.version}
                  onChange={(e) =>
                    updateContent(["metadata", "version"], e.target.value)
                  }
                  disabled
                />
              </div>

              <div>
                <Label className="text-sm font-medium">آخر تعديل</Label>
                <Input
                  value={new Date(content.metadata.lastModified).toLocaleString(
                    "ar-SA",
                  )}
                  disabled
                />
              </div>

              <div>
                <Label className="text-sm font-medium">رقم المراجعة</Label>
                <Input value={content.metadata.revision} disabled />
              </div>

              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  تصدير البيانات
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  استيراد البيانات
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      إعادة تعيين
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد إعادة ا��تعيين</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من أنك تريد إعادة تعيين جميع الإعدادات إلى
                        القيم الافتراضية؟ هذا الإجراء لا يمكن التراجع عنه.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                        إعادة تعيين
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
