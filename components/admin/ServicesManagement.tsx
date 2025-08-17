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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useTranslation } from "../../hooks/useTranslation";
import { useNotify } from "../NotificationSystem";
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
} from "lucide-react";
import AIGenerateButton from "@/components/admin/AIGenerateButton";

interface Service {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  price: number;
  duration: number;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  views?: number;
  bookings?: number;
}

export default function ServicesManagement() {
  const { t, currentLanguage } = useTranslation();
  const notify = useNotify();
  const isArabic = currentLanguage === "ar";

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    category: "residential",
    price: 0,
    duration: 1,
    active: true,
    featured: false,
  });

  // Load services from API
  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data.data || []);
      } else {
        throw new Error("Failed to load services");
      }
    } catch (error) {
      console.error("Error loading services:", error);
      notify.error(
        isArabic ? "خطأ" : "Error",
        isArabic ? "خطأ في تحميل الخدمات" : "Error loading services",
      );
    } finally {
      setLoading(false);
    }
  };

  // Create or update service
  const saveService = async () => {
    try {
      const method = editingService ? "PUT" : "POST";
      const url = "/api/admin/services";

      const payload = editingService
        ? { ...formData, id: editingService.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        notify.success(
          isArabic ? "نجاح" : "Success",
          editingService
            ? isArabic
              ? "تم تحديث الخدمة بنجاح"
              : "Service updated successfully"
            : isArabic
              ? "تم إنشاء الخدمة بنجاح"
              : "Service created successfully",
        );

        await loadServices();
        setIsDialogOpen(false);
        resetForm();
      } else {
        throw new Error("Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      notify.error(
        isArabic ? "خطأ" : "Error",
        isArabic ? "خطأ في حفظ الخدمة" : "Error saving service",
      );
    }
  };

  // Delete service
  const deleteService = async (serviceId: string) => {
    if (
      !confirm(
        isArabic
          ? "هل أنت متأكد من حذف هذه الخدمة؟"
          : "Are you sure you want to delete this service?",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services?id=${serviceId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        notify.success(
          isArabic ? "نجاح" : "Success",
          isArabic ? "تم حذف الخدمة بنجاح" : "Service deleted successfully",
        );
        await loadServices();
      } else {
        throw new Error("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      notify.error(
        isArabic ? "خطأ" : "Error",
        isArabic ? "خطأ في حذف الخدمة" : "Error deleting service",
      );
    }
  };

  // Toggle service status
  const toggleServiceStatus = async (service: Service) => {
    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: service.id,
          active: !service.active,
        }),
      });

      if (response.ok) {
        notify.success(
          isArabic ? "نجاح" : "Success",
          isArabic
            ? `تم ${!service.active ? "تفعيل" : "إلغاء تفعيل"} الخدمة`
            : `Service ${!service.active ? "enabled" : "disabled"} successfully`,
        );
        await loadServices();
      } else {
        throw new Error("Failed to toggle service status");
      }
    } catch (error) {
      console.error("Error toggling service status:", error);
      notify.error(
        isArabic ? "خطأ" : "Error",
        isArabic ? "خطأ في تغيير حالة الخدمة" : "Error toggling service status",
      );
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingService(null);
    setFormData({
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      category: "residential",
      price: 0,
      duration: 1,
      active: true,
      featured: false,
    });
  };

  // Open dialog for editing
  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      titleAr: service.titleAr,
      description: service.description,
      descriptionAr: service.descriptionAr,
      category: service.category,
      price: service.price,
      duration: service.duration,
      active: service.active,
      featured: service.featured,
    });
    setIsDialogOpen(true);
  };

  // Open dialog for adding new service
  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  useEffect(() => {
    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">
          {isArabic ? "جارٍ التحميل..." : "Loading..."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isArabic ? "إدارة الخدمات" : "Services Management"}
          </h1>
          <p className="text-muted-foreground">
            {isArabic
              ? "إدارة وتحديث الخدمات المقدمة"
              : "Manage and update offered services"}
          </p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          {isArabic ? "إضافة خدمة" : "Add Service"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isArabic ? "جميع الخدمات" : "All Services"}</CardTitle>
          <CardDescription>
            {isArabic ? "إدارة الخدمات المقدمة" : "Manage offered services"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {isArabic ? "لا توجد خدمات متاحة" : "No services available"}
              </div>
            ) : (
              services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {isArabic ? service.titleAr : service.title}
                    </p>
                    <div className="flex space-x-4 text-sm text-muted-foreground">
                      <span>
                        {service.price} {isArabic ? "ر.س" : "SAR"}
                      </span>
                      <span>
                        {service.duration} {isArabic ? "ساعات" : "hours"}
                      </span>
                      <span className="capitalize">{service.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={service.active ? "default" : "secondary"}>
                      {service.active
                        ? isArabic
                          ? "نشطة"
                          : "Active"
                        : isArabic
                          ? "غير نشطة"
                          : "Inactive"}
                    </Badge>
                    {service.featured && (
                      <Badge variant="outline">
                        {isArabic ? "مميزة" : "Featured"}
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(service)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      {isArabic ? "تعديل" : "Edit"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleServiceStatus(service)}
                    >
                      {service.active ? (
                        <ToggleLeft className="w-4 h-4 mr-1" />
                      ) : (
                        <ToggleRight className="w-4 h-4 mr-1" />
                      )}
                      {service.active
                        ? isArabic
                          ? "إلغاء تفعيل"
                          : "Disable"
                        : isArabic
                          ? "تفعيل"
                          : "Enable"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {isArabic ? "حذف" : "Delete"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService
                ? isArabic
                  ? "تعديل الخدمة"
                  : "Edit Service"
                : isArabic
                  ? "إضافة خدمة جديدة"
                  : "Add New Service"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "املأ البيانات التالية لإضافة أو تعديل الخدمة"
                : "Fill in the details to add or edit the service"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  {isArabic ? "اسم الخدمة (إنجليزي)" : "Service Name (English)"}
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Service name in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titleAr">
                  {isArabic ? "اسم الخدمة (عربي)" : "Service Name (Arabic)"}
                </Label>
                <Input
                  id="titleAr"
                  value={formData.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, titleAr: e.target.value })
                  }
                  placeholder="اسم الخدمة بالعربية"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="descriptionAr" className="flex items-center justify-between">
                  <span>{isArabic ? "الوصف (عربي)" : "Description (Arabic)"}</span>
                  <AIGenerateButton mode="description" language="ar" context={formData.titleAr || ''} onApply={(val)=> setFormData(prev=> ({...prev, descriptionAr: val}))} />
                </Label>
                <Textarea
                  id="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, descriptionAr: e.target.value }))
                  }
                  placeholder={
                    isArabic
                      ? "أدخل وصف الخدمة باللغة العربية"
                      : "Enter service description in Arabic"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center justify-between"><span>{isArabic? 'الوصف (إنجليزي)':'Description (English)'}</span> <AIGenerateButton mode="description" language="en" context={formData.title || ''} onApply={(val)=> setFormData(prev=> ({...prev, description: val}))} /></Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder={
                    isArabic
                      ? "أدخل وصف الخدمة باللغة الإنجليزية"
                      : "Enter service description in English"
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  {isArabic ? "الفئة" : "Category"}
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isArabic ? "اختر ا��فئة" : "Select category"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">
                      {isArabic ? "سكني" : "Residential"}
                    </SelectItem>
                    <SelectItem value="commercial">
                      {isArabic ? "تجاري" : "Commercial"}
                    </SelectItem>
                    <SelectItem value="specialized">
                      {isArabic ? "متخصص" : "Specialized"}
                    </SelectItem>
                    <SelectItem value="maintenance">
                      {isArabic ? "صيانة" : "Maintenance"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">
                  {isArabic ? "السعر (ر.س)" : "Price (SAR)"}
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">
                  {isArabic ? "المدة (ساعات)" : "Duration (hours)"}
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: Number(e.target.value),
                    })
                  }
                  placeholder="1"
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked })
                  }
                />
                <Label htmlFor="active">{isArabic ? "نشطة" : "Active"}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label htmlFor="featured">
                  {isArabic ? "مميزة" : "Featured"}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={saveService}>
              <Save className="w-4 h-4 mr-2" />
              {isArabic ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
