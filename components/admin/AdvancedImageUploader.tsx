"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedText } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIContentAssistant from "./AIContentAssistant";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit,
  Eye,
  Download,
  Share,
  Copy,
  Check,
  X,
  RefreshCw,
  FolderPlus,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Tag,
  Calendar,
  FileImage,
  FileVideo,
  File,
  Bot,
  Sparkles,
  Zap,
  Target,
  Hash,
  Type,
  Globe,
} from "lucide-react";

interface ImageMetadata {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  category: string;
  size: number;
  type: string;
  dimensions?: {
    width: number;
    height: number;
  };
  uploadedAt: string;
  title?: {
    ar: string;
    en: string;
  };
  description?: {
    ar: string;
    en: string;
  };
  altText?: {
    ar: string;
    en: string;
  };
  tags?: string[];
  seoScore?: number;
  usage?: {
    page: string;
    component: string;
    lastUsed: string;
  }[];
}

interface AdvancedImageUploaderProps {
  onSelect?: (image: ImageMetadata) => void;
  multiple?: boolean;
  allowedTypes?: string[];
  maxSize?: number;
  category?: string;
  showLibrary?: boolean;
}

const DEFAULT_CATEGORIES = [
  { id: "hero", name: { ar: "صور البانر", en: "Hero Images" }, icon: "Image" },
  {
    id: "services",
    name: { ar: "الخدمات", en: "Services" },
    icon: "Briefcase",
  },
  { id: "team", name: { ar: "الفر��ق", en: "Team" }, icon: "Users" },
  { id: "gallery", name: { ar: "المعرض", en: "Gallery" }, icon: "Grid" },
  { id: "blog", name: { ar: "المدونة", en: "Blog" }, icon: "FileText" },
  { id: "icons", name: { ar: "الأيقونات", en: "Icons" }, icon: "Star" },
  { id: "logos", name: { ar: "الشعارات", en: "Logos" }, icon: "Award" },
  {
    id: "backgrounds",
    name: { ar: "الخلفيات", en: "Backgrounds" },
    icon: "Layers",
  },
  { id: "products", name: { ar: "المنتجات", en: "Products" }, icon: "Package" },
  {
    id: "certificates",
    name: { ar: "الشهادات", en: "Certificates" },
    icon: "Award",
  },
];

export default function AdvancedImageUploader({
  onSelect,
  multiple = false,
  allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ],
  maxSize = 10 * 1024 * 1024, // 10MB
  category = "general",
  showLibrary = true,
}: AdvancedImageUploaderProps) {
  const { t, isRTL } = useTranslation();
  const isArabic = isRTL;
  const [activeTab, setActiveTab] = useState("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [selectedImages, setSelectedImages] = useState<ImageMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "size">(
    "newest",
  );
  const [editingImage, setEditingImage] = useState<ImageMetadata | null>(null);
  const [generating, setGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // تحميل الصور
  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  const loadImages = async () => {
    try {
      const response = await fetch(
        `/api/upload-image?category=${selectedCategory}`,
      );
      const data = await response.json();
      if (data.success) {
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  // معالجة رفع الملفات
  const handleFileUpload = async (files: FileList) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`نوع الملف ${file.type} غير مدعوم`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`حجم الملف ${file.name} كبير جداً`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("category", category);
        formData.append("type", "website");

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        // تحديث شريط التقدم
        setUploadProgress(((index + 1) / validFiles.length) * 100);

        if (result.success) {
          // إنتاج البيانات الوصفية بالذكاء الاصطناعي
          const metadata = await generateImageMetadata(file, result);
          return metadata;
        }
        throw new Error(result.error);
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages((prev) => [...uploadedImages, ...prev]);
      setActiveTab("library");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("حدث خطأ أثناء رفع الملفات");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // إنتاج البيانات الوصفية بالذكاء الاصطناعي
  const generateImageMetadata = async (
    file: File,
    uploadResult: any,
  ): Promise<ImageMetadata> => {
    try {
      setGenerating(true);

      // تحليل اسم الملف لاستخلاص معلومات
      const fileName = file.name.toLowerCase();
      const category = detectCategory(fileName);

      // إنتاج العنوان والوصف بالذكاء الاصطناعي
      const aiResponse = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `قم بإنشاء عنوان ووصف و alt text مناسب للصورة بناءً على اسم الملف: "${file.name}" والفئة: "${category}". الصورة مخصصة لشركة تنظيف في جدة. اكتب النتيجة بالشكل التالي:
          
العنوان العربي: [العنوان]
العنوان الإنجليزي: [Title]
الوصف العربي: [الوصف]
الوصف الإنجليزي: [Description]
النص البديل العربي: [النص البديل]
النص البديل الإنجليزي: [Alt Text]
الكلمات المفتاحية: [tag1, tag2, tag3]`,
          context: {
            mode: "image_metadata",
            businessContext: {
              industry: "خدمات التنظيف",
              location: "جدة",
              company: "عالم النظافة جدة",
            },
          },
        }),
      });

      const aiData = await aiResponse.json();
      let aiMetadata: any = {};

      if (aiData.success) {
        aiMetadata = parseAIImageResponse(aiData.response);
      }

      // قراءة أبعاد الصورة
      const dimensions = await getImageDimensions(file);

      const imageMetadata: ImageMetadata = {
        id: uploadResult.metadata.id,
        filename: uploadResult.metadata.filename,
        originalName: file.name,
        url: uploadResult.imageUrl,
        category: category,
        size: file.size,
        type: file.type,
        dimensions,
        uploadedAt: new Date().toISOString(),
        title: aiMetadata.title || {
          ar: file.name.replace(/\.[^/.]+$/, ""),
          en: file.name.replace(/\.[^/.]+$/, ""),
        },
        description: aiMetadata.description || {
          ar: `صورة ${category} لشركة عالم النظافة جدة`,
          en: `${category} image for Cleaning World Jeddah`,
        },
        altText: aiMetadata.altText || {
          ar: `صورة ${file.name.replace(/\.[^/.]+$/, "")}`,
          en: `Image of ${file.name.replace(/\.[^/.]+$/, "")}`,
        },
        tags: aiMetadata.tags || [category, "تنظيف", "جدة"],
        seoScore: calculateSEOScore(aiMetadata),
        usage: [],
      };

      // حفظ البيانات الوصفية
      await saveImageMetadata(imageMetadata);

      return imageMetadata;
    } catch (error) {
      console.error("Error generating image metadata:", error);
      return {
        id: uploadResult.metadata.id,
        filename: uploadResult.metadata.filename,
        originalName: file.name,
        url: uploadResult.imageUrl,
        category: category,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        title: { ar: file.name, en: file.name },
        description: { ar: "", en: "" },
        altText: { ar: file.name, en: file.name },
        tags: [category],
        seoScore: 0,
        usage: [],
      };
    } finally {
      setGenerating(false);
    }
  };

  // تحليل رد الذكاء الاصطناعي
  const parseAIImageResponse = (response: string) => {
    const lines = response.split("\n");
    const result: any = {
      title: { ar: "", en: "" },
      description: { ar: "", en: "" },
      altText: { ar: "", en: "" },
      tags: [],
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("العنوان العربي:")) {
        result.title.ar = trimmed.replace("العنوان العربي:", "").trim();
      } else if (trimmed.startsWith("العنوان الإنجليزي:")) {
        result.title.en = trimmed.replace("العنوان الإنجليزي:", "").trim();
      } else if (trimmed.startsWith("الوصف العربي:")) {
        result.description.ar = trimmed.replace("الوصف العربي:", "").trim();
      } else if (trimmed.startsWith("الوصف الإنجليزي:")) {
        result.description.en = trimmed.replace("الوصف الإنجليزي:", "").trim();
      } else if (trimmed.startsWith("النص البديل العربي:")) {
        result.altText.ar = trimmed.replace("النص البديل العربي:", "").trim();
      } else if (trimmed.startsWith("النص البديل الإنجليزي:")) {
        result.altText.en = trimmed
          .replace("النص البديل الإنجليزي:", "")
          .trim();
      } else if (trimmed.startsWith("الكلمات المفتاحية:")) {
        const tagsStr = trimmed.replace("الكلمات المفتاحية:", "").trim();
        result.tags = tagsStr
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean);
      }
    });

    return result;
  };

  // اكتشاف الفئة من اسم الملف
  const detectCategory = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();

    if (lowerName.includes("hero") || lowerName.includes("banner"))
      return "hero";
    if (lowerName.includes("service") || lowerName.includes("clean"))
      return "services";
    if (lowerName.includes("team") || lowerName.includes("staff"))
      return "team";
    if (lowerName.includes("logo")) return "logos";
    if (lowerName.includes("icon")) return "icons";
    if (lowerName.includes("certificate")) return "certificates";
    if (lowerName.includes("background") || lowerName.includes("bg"))
      return "backgrounds";

    return category || "general";
  };

  // حساب أبعاد الصورة
  const getImageDimensions = (
    file: File,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        resolve({ width: 0, height: 0 });
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: 0, height: 0 });
      };

      img.src = url;
    });
  };

  // حساب نقاط SEO
  const calculateSEOScore = (metadata: any): number => {
    let score = 0;

    // فحص وجود العنوان
    if (metadata.title?.ar && metadata.title?.en) score += 25;

    // فحص وجود الوصف
    if (metadata.description?.ar && metadata.description?.en) score += 25;

    // فحص وجود النص البديل
    if (metadata.altText?.ar && metadata.altText?.en) score += 25;

    // فحص وجود الكلمات المفتاحية
    if (metadata.tags && metadata.tags.length > 0) score += 25;

    return score;
  };

  // حفظ البيانات الوصفية
  const saveImageMetadata = async (metadata: ImageMetadata) => {
    try {
      await fetch("/api/image-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });
    } catch (error) {
      console.error("Error saving image metadata:", error);
    }
  };

  // معالجة السحب والإفلات
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // تصفية الصور
  const filteredImages = images.filter((image) => {
    const matchesSearch =
      searchQuery === "" ||
      image.title?.ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.title?.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || image.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ترتيب الصور
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
        );
      case "name":
        return a.originalName.localeCompare(b.originalName);
      case "size":
        return b.size - a.size;
      default:
        return 0;
    }
  });

  const handleImageSelect = (image: ImageMetadata) => {
    if (multiple) {
      setSelectedImages((prev) => {
        const isSelected = prev.find((img) => img.id === image.id);
        if (isSelected) {
          return prev.filter((img) => img.id !== image.id);
        } else {
          return [...prev, image];
        }
      });
    } else {
      onSelect?.(image);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="upload"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Upload className="w-4 h-4" />
            <span>رفع جديد</span>
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <ImageIcon className="w-4 h-4" />
            <span>مكتبة الصور</span>
          </TabsTrigger>
          <TabsTrigger
            value="ai-tools"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Bot className="w-4 h-4" />
            <span>أدوات AI</span>
          </TabsTrigger>
        </TabsList>

        {/* تبويب الرفع */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Upload className="w-5 h-5" />
                <span>رفع صور جديدة</span>
                {generating && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    <Bot className="w-3 h-3 mr-1" />
                    AI يحلل...
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">
                      اسحب الصور هنا أو انقر للاختيار
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      يدعم: JPG, PNG, WebP, GIF, SVG - حتى{" "}
                      {formatFileSize(maxSize)}
                    </p>
                  </div>
                  <Button variant="outline" className="pointer-events-none">
                    <Upload className="w-4 h-4 mr-2" />
                    اختيار الملفات
                  </Button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={allowedTypes.join(",")}
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files)
                }
                className="hidden"
              />

              {uploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">جارٍ الرفع...</span>
                    <span className="text-sm text-gray-500">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* إعدادات الرفع */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">الفئة</Label>
                  <select
                    value={category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {getLocalizedText(cat.name, isArabic, "اسم الفئة")}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse pt-6">
                  <Switch defaultChecked />
                  <Label className="text-sm">
                    إنتاج البيانات الوصفية تلقائياً
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تبويب مكتبة الصور */}
        <TabsContent value="library" className="space-y-6">
          {/* شريط البحث والتصفية */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="البحث في الصور..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="all">جميع الفئات</option>
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {getLocalizedText(cat.name, isArabic, "اسم الفئة")}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="newest">الأحدث</option>
                    <option value="oldest">الأقدم</option>
                    <option value="name">الاسم</option>
                    <option value="size">الحجم</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                  >
                    {viewMode === "grid" ? (
                      <List className="w-4 h-4" />
                    ) : (
                      <Grid className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* عرض الصور */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
                : "space-y-4"
            }
          >
            {sortedImages.map((image) => (
              <Card
                key={image.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedImages.find((img) => img.id === image.id)
                    ? "ring-2 ring-blue-500"
                    : ""
                } ${viewMode === "list" ? "flex" : ""}`}
                onClick={() => handleImageSelect(image)}
              >
                {viewMode === "grid" ? (
                  <div>
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <img
                        src={image.url}
                        alt={
                          getLocalizedText(image.altText, isArabic, "نص بديل") ||
                          image.originalName
                        }
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-xs">
                          {formatFileSize(image.size)}
                        </Badge>
                      </div>
                      {image.seoScore && (
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant={
                              image.seoScore >= 75
                                ? "default"
                                : image.seoScore >= 50
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            SEO: {image.seoScore}%
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-2">
                      <p className="text-xs font-medium truncate">
                        {getLocalizedText(image.title, isArabic, "عنوان") ||
                          image.originalName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {image.category}
                      </p>
                      {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {image.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              +{image.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 rtl:space-x-reverse p-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={image.url}
                        alt={
                          getLocalizedText(image.altText, isArabic, "نص بديل") ||
                          image.originalName
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {getLocalizedText(image.title, isArabic, "عنوان") ||
                          image.originalName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {getLocalizedText(image.description, isArabic, "وصف")}
                      </p>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse mt-1">
                        <span className="text-xs text-gray-400">
                          {formatFileSize(image.size)}
                        </span>
                        {image.dimensions && (
                          <span className="text-xs text-gray-400">
                            {image.dimensions.width}×{image.dimensions.height}
                          </span>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {image.category}
                        </Badge>
                        {image.seoScore && (
                          <Badge
                            variant={
                              image.seoScore >= 75
                                ? "default"
                                : image.seoScore >= 50
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            SEO: {image.seoScore}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingImage(image);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {sortedImages.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">لا توجد صور تطابق البحث</p>
            </div>
          )}
        </TabsContent>

        {/* تبويب أدوات AI */}
        <TabsContent value="ai-tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 rtl:space-x-reverse">
                <Bot className="w-5 h-5" />
                <Sparkles className="w-4 h-4" />
                <span>أدوات الذكاء الاصطناعي للصور</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                    <Type className="w-5 h-5 text-blue-500" />
                    <h3 className="font-medium">إنتاج عناوين تلقائية</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    إنتاج عناوين جذابة ومُحسنة لمحركات البحث للصور
                  </p>
                  <AIContentAssistant
                    mode="title"
                    language="both"
                    context="عنوان للصورة"
                    onGenerate={(generated) =>
                      console.log("Generated title:", generated)
                    }
                  />
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                    <FileImage className="w-5 h-5 text-green-500" />
                    <h3 className="font-medium">إنتاج أوصاف</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    إنتاج أوصاف شاملة ومفيدة للصور
                  </p>
                  <AIContentAssistant
                    mode="description"
                    language="both"
                    context="وصف للصورة"
                    onGenerate={(generated) =>
                      console.log("Generated description:", generated)
                    }
                  />
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <h3 className="font-medium">تحسين SEO</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    إنتاج نصوص بديلة محسنة لمحركات البحث
                  </p>
                  <AIContentAssistant
                    mode="seo"
                    language="both"
                    context="تحسين SEO للصورة"
                    onGenerate={(generated) =>
                      console.log("Generated SEO:", generated)
                    }
                  />
                </Card>

                <Card className="p-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-3">
                    <Hash className="w-5 h-5 text-orange-500" />
                    <h3 className="font-medium">اقتراح كلمات مفتاحية</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    اقتراح كلمات مفتاحية مناسبة للصور
                  </p>
                  <AIContentAssistant
                    mode="keywords"
                    language="both"
                    context="كلمات مفتاحية للصورة"
                    onGenerate={(generated) =>
                      console.log("Generated keywords:", generated)
                    }
                  />
                </Card>
              </div>

              {/* أدوات إدارة جماعية */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                  <Zap className="w-5 h-5" />
                  <span>أدوات الإدارة الجماعية</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col">
                    <Bot className="w-6 h-6 mb-2" />
                    <span className="text-sm">تحديث البيانات الوصفية</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Target className="w-6 h-6 mb-2" />
                    <span className="text-sm">تحسين SEO للكل</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col">
                    <Hash className="w-6 h-6 mb-2" />
                    <span className="text-sm">إنتاج كلمات مفتاحية</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* نافذة تحرير الصورة */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>تحرير بيانات الصورة</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingImage(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* معاينة الصورة */}
                <div>
                  <Label className="text-sm font-medium">معاينة</Label>
                  <div className="mt-1 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={editingImage.url}
                      alt={editingImage.originalName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>{editingImage.originalName}</p>
                    <p>{formatFileSize(editingImage.size)}</p>
                    {editingImage.dimensions && (
                      <p>
                        {editingImage.dimensions.width}×
                        {editingImage.dimensions.height}
                      </p>
                    )}
                  </div>
                </div>

                {/* بيانات الصورة */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">العنوان</Label>
                      <AIContentAssistant
                        mode="title"
                        language="both"
                        context={`عنوان للصورة: ${editingImage.originalName}`}
                        currentValue={editingImage.title?.ar || ""}
                        onGenerate={(generated) => {
                          if (typeof generated === "object") {
                            setEditingImage((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    title: generated,
                                  }
                                : null,
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={editingImage.title?.ar || ""}
                        onChange={(e) =>
                          setEditingImage((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  title: { 
                                    ar: e.target.value,
                                    en: prev.title?.en || ""
                                  },
                                }
                              : null,
                          )
                        }
                        placeholder="العنوان بالعربية"
                        dir="rtl"
                      />
                      <Input
                        value={editingImage.title?.en || ""}
                        onChange={(e) =>
                          setEditingImage((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  title: { 
                                    ar: prev.title?.ar || "",
                                    en: e.target.value
                                  },
                                }
                              : null,
                          )
                        }
                        placeholder="العنوان بالإنجليزية"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">الوصف</Label>
                      <AIContentAssistant
                        mode="description"
                        language="both"
                        context={`وصف للصورة: ${editingImage.originalName}`}
                        currentValue={editingImage.description?.ar || ""}
                        onGenerate={(generated) => {
                          if (typeof generated === "object") {
                            setEditingImage((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    description: generated,
                                  }
                                : null,
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        value={editingImage.description?.ar || ""}
                        onChange={(e) =>
                          setEditingImage((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  description: {
                                    ar: e.target.value,
                                    en: prev.description?.en || ""
                                  },
                                }
                              : null,
                          )
                        }
                        placeholder="الوصف بالعربية"
                        rows={3}
                        dir="rtl"
                      />
                      <Textarea
                        value={editingImage.description?.en || ""}
                        onChange={(e) =>
                          setEditingImage((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  description: {
                                    ar: prev.description?.ar || "",
                                    en: e.target.value
                                  },
                                }
                              : null,
                          )
                        }
                        placeholder="الوصف بالإنجليزية"
                        rows={3}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">
                        النص البديل (Alt Text)
                      </Label>
                      <AIContentAssistant
                        mode="seo"
                        language="both"
                        context={`نص بديل للصورة: ${editingImage.originalName}`}
                        currentValue={editingImage.altText?.ar || ""}
                        onGenerate={(generated) => {
                          if (typeof generated === "object") {
                            setEditingImage((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    altText: generated,
                                  }
                                : null,
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        value={editingImage.altText?.ar || ""}
                        onChange={(e) =>
                          setEditingImage((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  altText: {
                                    ar: e.target.value,
                                    en: prev.altText?.en || ""
                                  },
                                }
                              : null,
                          )
                        }
                        placeholder="النص البديل بالعربية"
                        dir="rtl"
                      />
                      <Input
                        value={editingImage.altText?.en || ""}
                        onChange={(e) =>
                          setEditingImage((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  altText: {
                                    ar: prev.altText?.ar || "",
                                    en: e.target.value
                                  },
                                }
                              : null,
                          )
                        }
                        placeholder="النص البديل بالإنجليزية"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">
                        الكلمات المفتاحية
                      </Label>
                      <AIContentAssistant
                        mode="keywords"
                        language="ar"
                        context={`كلمات مفتاحية للصورة: ${editingImage.originalName}`}
                        onGenerate={(generated) => {
                          if (typeof generated === "string") {
                            const tags = generated
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean);
                            setEditingImage((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    tags: [...(prev.tags || []), ...tags],
                                  }
                                : null,
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(editingImage.tags || []).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center space-x-1 rtl:space-x-reverse"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() =>
                              setEditingImage((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      tags: prev.tags?.filter(
                                        (_, i) => i !== index,
                                      ),
                                    }
                                  : null,
                              )
                            }
                            className="hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="أضف كلمة مفتاحية واضغط Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const input = e.target as HTMLInputElement;
                          const tag = input.value.trim();
                          if (tag && !editingImage.tags?.includes(tag)) {
                            setEditingImage((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    tags: [...(prev.tags || []), tag],
                                  }
                                : null,
                            );
                            input.value = "";
                          }
                        }
                      }}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">نقاط SEO</Label>
                    <div className="mt-1">
                      <Progress
                        value={editingImage.seoScore || 0}
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editingImage.seoScore || 0}% -{" "}
                        {(editingImage.seoScore || 0) >= 75
                          ? "ممتاز"
                          : (editingImage.seoScore || 0) >= 50
                            ? "جيد"
                            : "يحتاج تحسين"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setEditingImage(null)}>
                  إلغاء
                </Button>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Button
                    variant="outline"
                    onClick={() => {
                      // إعادة حساب نقاط SEO
                      const seoScore = calculateSEOScore(editingImage);
                      setEditingImage((prev) =>
                        prev ? { ...prev, seoScore } : null,
                      );
                    }}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    إعادة حساب SEO
                  </Button>
                  <Button
                    onClick={() => {
                      // حفظ التغييرات
                      saveImageMetadata(editingImage);
                      setEditingImage(null);
                      loadImages();
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
