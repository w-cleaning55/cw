import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Eye,
  DollarSign,
  Users,
  Image as ImageIcon,
  Settings,
  Save,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { toast } from "../../hooks/use-toast";
import ImageUploader from "./ImageUploader";

interface Service {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price?: number;
  currency: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  features: string[];
  featuresAr: string[];
  category: string;
  categoryAr: string;
  duration?: number; // in minutes
  equipment?: string[];
  equipmentAr?: string[];
  beforeAfterImages?: string[];
  gallery?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceImageManagerProps {
  serviceId?: string;
  onSave?: (service: Service) => void;
  onCancel?: () => void;
  initialData?: Service;
}

const defaultService: Omit<Service, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  price: 0,
  currency: "SAR",
  isActive: true,
  features: [],
  featuresAr: [],
  category: "",
  categoryAr: "",
  duration: 60,
  equipment: [],
  equipmentAr: [],
  beforeAfterImages: [],
  gallery: [],
};

export default function ServiceImageManager({
  serviceId,
  onSave,
  onCancel,
  initialData,
}: ServiceImageManagerProps) {
  const { t, currentLanguage } = useTranslation();
  const [service, setService] = useState<Service>(
    initialData || {
      ...defaultService,
      id: serviceId || `service-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newFeatureAr, setNewFeatureAr] = useState("");
  const [newEquipment, setNewEquipment] = useState("");
  const [newEquipmentAr, setNewEquipmentAr] = useState("");

  const handleServiceUpdate = (field: keyof Service, value: any) => {
    setService((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleMainImageUpload = (files: any[]) => {
    if (files.length > 0) {
      handleServiceUpdate("image", files[0].url);
    }
  };

  const handleIconUpload = (files: any[]) => {
    if (files.length > 0) {
      handleServiceUpdate("icon", files[0].url);
    }
  };

  const handleGalleryUpload = (files: any[]) => {
    const newGallery = [...(service.gallery || []), ...files.map((f) => f.url)];
    handleServiceUpdate("gallery", newGallery);
  };

  const handleBeforeAfterUpload = (files: any[]) => {
    const newBeforeAfter = [
      ...(service.beforeAfterImages || []),
      ...files.map((f) => f.url),
    ];
    handleServiceUpdate("beforeAfterImages", newBeforeAfter);
  };

  const removeFromGallery = (imageUrl: string) => {
    const updatedGallery =
      service.gallery?.filter((url) => url !== imageUrl) || [];
    handleServiceUpdate("gallery", updatedGallery);
  };

  const removeFromBeforeAfter = (imageUrl: string) => {
    const updatedBeforeAfter =
      service.beforeAfterImages?.filter((url) => url !== imageUrl) || [];
    handleServiceUpdate("beforeAfterImages", updatedBeforeAfter);
  };

  const addFeature = () => {
    if (newFeature.trim() && newFeatureAr.trim()) {
      handleServiceUpdate("features", [...service.features, newFeature.trim()]);
      handleServiceUpdate("featuresAr", [
        ...service.featuresAr,
        newFeatureAr.trim(),
      ]);
      setNewFeature("");
      setNewFeatureAr("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = service.features.filter((_, i) => i !== index);
    const updatedFeaturesAr = service.featuresAr.filter((_, i) => i !== index);
    handleServiceUpdate("features", updatedFeatures);
    handleServiceUpdate("featuresAr", updatedFeaturesAr);
  };

  const addEquipment = () => {
    if (newEquipment.trim() && newEquipmentAr.trim()) {
      handleServiceUpdate("equipment", [
        ...(service.equipment || []),
        newEquipment.trim(),
      ]);
      handleServiceUpdate("equipmentAr", [
        ...(service.equipmentAr || []),
        newEquipmentAr.trim(),
      ]);
      setNewEquipment("");
      setNewEquipmentAr("");
    }
  };

  const removeEquipment = (index: number) => {
    const updatedEquipment =
      service.equipment?.filter((_, i) => i !== index) || [];
    const updatedEquipmentAr =
      service.equipmentAr?.filter((_, i) => i !== index) || [];
    handleServiceUpdate("equipment", updatedEquipment);
    handleServiceUpdate("equipmentAr", updatedEquipmentAr);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate required fields
      if (
        !service.name ||
        !service.nameAr ||
        !service.description ||
        !service.descriptionAr
      ) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى تعبئة جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      // Save to API
      const response = await fetch(
        `/api/admin/services${serviceId ? `/${serviceId}` : ""}`,
        {
          method: serviceId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(service),
        },
      );

      if (response.ok) {
        const savedService = await response.json();
        toast({
          title: "تم الحفظ بنجاح",
          description: `تم ${serviceId ? "تحديث" : "إنشاء"} الخدمة بنجاح`,
        });

        if (onSave) {
          onSave(savedService);
        }
      } else {
        throw new Error("فشل في حفظ الخدمة");
      }
    } catch (error) {
      console.error("خطأ في حفظ الخدمة:", error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الخدمة",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const existingMainImage = service.image
    ? [
        {
          id: "main-image",
          filename: "main-image",
          originalName: "الصورة الرئيسية",
          url: service.image,
          type: "service-image",
          size: 0,
          mimetype: "image/jpeg",
          uploadedAt: new Date().toISOString(),
        },
      ]
    : [];

  const existingIcon = service.icon
    ? [
        {
          id: "service-icon",
          filename: "service-icon",
          originalName: "أيقونة الخدمة",
          url: service.icon,
          type: "service-icon",
          size: 0,
          mimetype: "image/svg+xml",
          uploadedAt: new Date().toISOString(),
        },
      ]
    : [];

  const existingGallery =
    service.gallery?.map((url, index) => ({
      id: `gallery-${index}`,
      filename: `gallery-${index}`,
      originalName: `صورة المعرض ${index + 1}`,
      url,
      type: "service-gallery",
      size: 0,
      mimetype: "image/jpeg",
      uploadedAt: new Date().toISOString(),
    })) || [];

  const existingBeforeAfter =
    service.beforeAfterImages?.map((url, index) => ({
      id: `before-after-${index}`,
      filename: `before-after-${index}`,
      originalName: `قبل وبعد ${index + 1}`,
      url,
      type: "before-after",
      size: 0,
      mimetype: "image/jpeg",
      uploadedAt: new Date().toISOString(),
    })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {serviceId ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
          </h2>
          <p className="text-muted-foreground">
            إدارة تفاصيل الخدمة والصور والمحتوى
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {serviceId ? "تحديث" : "إنشاء"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">اسم الخدمة (إنجليزي)</Label>
                  <Input
                    id="name"
                    value={service.name}
                    onChange={(e) =>
                      handleServiceUpdate("name", e.target.value)
                    }
                    placeholder="Service Name"
                  />
                </div>
                <div>
                  <Label htmlFor="nameAr">اسم الخدمة (عربي)</Label>
                  <Input
                    id="nameAr"
                    value={service.nameAr}
                    onChange={(e) =>
                      handleServiceUpdate("nameAr", e.target.value)
                    }
                    placeholder="اسم الخدمة"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">الوصف (إنجليزي)</Label>
                  <Textarea
                    id="description"
                    value={service.description}
                    onChange={(e) =>
                      handleServiceUpdate("description", e.target.value)
                    }
                    placeholder="Service Description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionAr">الوصف (عربي)</Label>
                  <Textarea
                    id="descriptionAr"
                    value={service.descriptionAr}
                    onChange={(e) =>
                      handleServiceUpdate("descriptionAr", e.target.value)
                    }
                    placeholder="وصف الخدمة"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="price">السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={service.price || 0}
                    onChange={(e) =>
                      handleServiceUpdate("price", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="currency">العملة</Label>
                  <Input
                    id="currency"
                    value={service.currency}
                    onChange={(e) =>
                      handleServiceUpdate("currency", e.target.value)
                    }
                    placeholder="SAR"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">المدة (دقيقة)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0"
                    value={service.duration || 60}
                    onChange={(e) =>
                      handleServiceUpdate("duration", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={service.isActive}
                      onCheckedChange={(checked) =>
                        handleServiceUpdate("isActive", checked)
                      }
                    />
                    <Label htmlFor="isActive">نشط</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">الفئة (إنجليزي)</Label>
                  <Input
                    id="category"
                    value={service.category}
                    onChange={(e) =>
                      handleServiceUpdate("category", e.target.value)
                    }
                    placeholder="Residential, Commercial, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="categoryAr">الفئة (عربي)</Label>
                  <Input
                    id="categoryAr"
                    value={service.categoryAr}
                    onChange={(e) =>
                      handleServiceUpdate("categoryAr", e.target.value)
                    }
                    placeholder="سكني، تجاري، إلخ"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>المميزات</CardTitle>
              <CardDescription>أضف مميزات الخدمة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-feature">مميزة جديدة (إنجليزي)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Feature"
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-feature-ar">مميزة جديدة (عربي)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-feature-ar"
                      value={newFeatureAr}
                      onChange={(e) => setNewFeatureAr(e.target.value)}
                      placeholder="المميزة"
                      onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    />
                    <Button onClick={addFeature} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {service.features.length > 0 && (
                <div className="space-y-2">
                  <Label>المميزات الحالية</Label>
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                          <span className="text-sm">{feature}</span>
                          <span className="text-sm text-muted-foreground">
                            {service.featuresAr[index]}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card>
            <CardHeader>
              <CardTitle>المعدات المستخدمة</CardTitle>
              <CardDescription>
                أضف المعدات والأدوات المستخدمة في الخدمة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new-equipment">معدة جديدة (إنجليزي)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-equipment"
                      value={newEquipment}
                      onChange={(e) => setNewEquipment(e.target.value)}
                      placeholder="Equipment"
                      onKeyPress={(e) => e.key === "Enter" && addEquipment()}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="new-equipment-ar">معد�� جديدة (عربي)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-equipment-ar"
                      value={newEquipmentAr}
                      onChange={(e) => setNewEquipmentAr(e.target.value)}
                      placeholder="المعدة"
                      onKeyPress={(e) => e.key === "Enter" && addEquipment()}
                    />
                    <Button onClick={addEquipment} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {service.equipment && service.equipment.length > 0 && (
                <div className="space-y-2">
                  <Label>المعدات الحالية</Label>
                  <div className="space-y-2">
                    {service.equipment.map((equipment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                          <span className="text-sm">{equipment}</span>
                          <span className="text-sm text-muted-foreground">
                            {service.equipmentAr?.[index]}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEquipment(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Images Section */}
        <div className="space-y-6">
          {/* Main Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                الصورة الرئيسية
              </CardTitle>
              <CardDescription>صورة واحدة رئيسية للخدمة</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                onUpload={handleMainImageUpload}
                maxFiles={1}
                allowMultiple={false}
                acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
                type="service-main"
                existingFiles={existingMainImage}
                onRemove={() => handleServiceUpdate("image", "")}
              />
            </CardContent>
          </Card>

          {/* Icon */}
          <Card>
            <CardHeader>
              <CardTitle>أيقونة الخدمة</CardTitle>
              <CardDescription>أيقونة صغيرة تمثل الخدمة</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                onUpload={handleIconUpload}
                maxFiles={1}
                allowMultiple={false}
                acceptedTypes={["image/svg+xml", "image/png", "image/jpeg"]}
                type="service-icon"
                existingFiles={existingIcon}
                onRemove={() => handleServiceUpdate("icon", "")}
              />
            </CardContent>
          </Card>

          {/* Service Status */}
          <Card>
            <CardHeader>
              <CardTitle>حالة الخدمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>الحالة</Label>
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "نشط" : "غير نشط"}
                </Badge>
              </div>

              {service.rating && (
                <div className="flex items-center justify-between">
                  <Label>التقييم</Label>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{service.rating}</span>
                    {service.reviewCount && (
                      <span className="text-sm text-muted-foreground">
                        ({service.reviewCount} مراجعة)
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label>السعر</Label>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {service.price} {service.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gallery and Before/After Images */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>معرض الصور</CardTitle>
            <CardDescription>
              صور إضافية تعرض الخدمة من زوايا مختلفة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              onUpload={handleGalleryUpload}
              maxFiles={10}
              allowMultiple={true}
              acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
              type="service-gallery"
              existingFiles={existingGallery}
              onRemove={(fileId) => {
                const index = parseInt(fileId.split("-")[1]);
                if (service.gallery && service.gallery[index]) {
                  removeFromGallery(service.gallery[index]);
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Before/After */}
        <Card>
          <CardHeader>
            <CardTitle>صور قبل وبعد</CardTitle>
            <CardDescription>
              صور توضح النتائج قبل وبعد تطبيق الخدمة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              onUpload={handleBeforeAfterUpload}
              maxFiles={10}
              allowMultiple={true}
              acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
              type="before-after"
              existingFiles={existingBeforeAfter}
              onRemove={(fileId) => {
                const index = parseInt(fileId.split("-")[2]);
                if (
                  service.beforeAfterImages &&
                  service.beforeAfterImages[index]
                ) {
                  removeFromBeforeAfter(service.beforeAfterImages[index]);
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
