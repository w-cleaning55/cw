"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Send,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useNotify } from "./NotificationSystem";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  serviceType: string;
  priority: "low" | "medium" | "high" | "urgent";
  message: string;
  preferredContact: "email" | "phone" | "whatsapp";
  address?: string;
  district?: string;
  preferredTime?: string;
}

interface ContactFormProps {
  className?: string;
  onSubmit?: (data: ContactFormData) => void;
  showAddressFields?: boolean;
  defaultServiceType?: string;
}

export default function ContactForm({
  className = "",
  onSubmit,
  showAddressFields = false,
  defaultServiceType = "",
}: ContactFormProps) {
  const { t } = useTranslation();
  const notify = useNotify();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    serviceType: defaultServiceType,
    priority: "medium",
    message: "",
    preferredContact: "phone",
    address: "",
    district: "",
    preferredTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const serviceTypes = [
    {
      value: "home_cleaning",
      label: "تنظيف المنازل",
      labelEn: "Home Cleaning",
    },
    {
      value: "office_cleaning",
      label: "تنظيف المكاتب",
      labelEn: "Office Cleaning",
    },
    {
      value: "apartment_cleaning",
      label: "تنظيف الشقق",
      labelEn: "Apartment Cleaning",
    },
    {
      value: "kitchen_cleaning",
      label: "تنظيف المطابخ",
      labelEn: "Kitchen Cleaning",
    },
    {
      value: "bathroom_cleaning",
      label: "تنظيف الحمامات",
      labelEn: "Bathroom Cleaning",
    },
    {
      value: "window_cleaning",
      label: "تنظيف النوافذ",
      labelEn: "Window Cleaning",
    },
    {
      value: "carpet_cleaning",
      label: "تنظيف السجاد",
      labelEn: "Carpet Cleaning",
    },
    {
      value: "post_construction",
      label: "تنظيف ما بعد البناء",
      labelEn: "Post Construction",
    },
    {
      value: "general_inquiry",
      label: "استفسار عام",
      labelEn: "General Inquiry",
    },
  ];

  const timeSlots = [
    {
      value: "morning",
      label: "صباحاً (8 ص - 12 ظ)",
      labelEn: "Morning (8 AM - 12 PM)",
    },
    {
      value: "afternoon",
      label: "بعد الظهر (12 ظ - 4 م)",
      labelEn: "Afternoon (12 PM - 4 PM)",
    },
    {
      value: "evening",
      label: "مساءً (4 م - 8 م)",
      labelEn: "Evening (4 PM - 8 PM)",
    },
    { value: "flexible", label: "وقت مرن", labelEn: "Flexible Time" },
  ];

  const districts = [
    "الحمراء",
    "النسيم",
    "الروضة",
    "البوادي",
    "الصفا",
    "الزهراء",
    "السامر",
    "النزهة",
    "الفيصلية",
    "السليمانية",
    "المروة",
    "الشاطئ",
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (
      !/^(\+966|0)?[5-9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "رقم الهاتف غير صحيح";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "الموضوع مطلوب";
    }

    if (!formData.serviceType) {
      newErrors.serviceType = "نوع الخدمة مطلوب";
    }

    if (!formData.message.trim()) {
      newErrors.message = "الرسال�� مطلوبة";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "الرسالة قصيرة جداً (أقل من 10 أحرف)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendNotifications = async (data: ContactFormData) => {
    const timestamp = new Date().toISOString();
    const messageId = `contact_${Date.now()}`;

    // إشعار للعميل
    try {
      await fetch("/api/notifications/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: { enabled: true },
          message: {
            recipient: data.email,
            subject: "تأكيد استلام رسالتك - عالم التنظيف",
            body: `
عزيزي ${data.name}،

شكراً لتواصلك معنا. تم استلام رسالتك بنجاح وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.

تفاصيل رسالتك:
- الموضوع: ${data.subject}
- نوع الخدمة: ${serviceTypes.find((s) => s.value === data.serviceType)?.label}
- الأولوية: ${data.priority === "high" ? "عالية" : data.priority === "medium" ? "متوسطة" : "منخفضة"}
- رقم المرجع: ${messageId}

سنتوا��ل معك خلال 24 ساعة من خلال ${data.preferredContact === "whatsapp" ? "الواتساب" : data.preferredContact === "phone" ? "المكالمة" : "البريد الإلكتروني"}.

مع تحيات فريق عالم التنظيف
`,
          },
        }),
      });
    } catch (error) {
      console.error("خطأ في إرسال إيميل العميل:", error);
    }

    // إشعار للموظف
    try {
      await fetch("/api/notifications/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: { enabled: true },
          message: {
            recipient: "info@cleaningworld.sa",
            subject: `رسالة جديدة من ${data.name} - ${data.priority === "urgent" ? "🚨 عاجل" : ""}`,
            body: `
تم استلام رسالة جديدة من العميل:

بيانات العميل:
- الاسم: ${data.name}
- البريد الإلكتروني: ${data.email}
- الهاتف: ${data.phone}
- العنوان: ${data.address || "غير محدد"}
- الحي: ${data.district || "غير محدد"}

تفاصيل الطلب:
- الموضوع: ${data.subject}
- نوع الخدمة: ${serviceTypes.find((s) => s.value === data.serviceType)?.label}
- الأولوية: ${data.priority === "urgent" ? "🚨 عاجل" : data.priority === "high" ? "عالية" : data.priority === "medium" ? "متوسطة" : "منخفضة"}
- الوقت المفضل: ${data.preferredTime ? timeSlots.find((t) => t.value === data.preferredTime)?.label : "غير محدد"}
- طريقة التواصل المفضلة: ${data.preferredContact === "whatsapp" ? "الواتساب" : data.preferredContact === "phone" ? "المكالمة" : "البريد الإلكتروني"}

الرسالة:
${data.message}

رقم المرجع: ${messageId}
التوقيت: ${new Date().toLocaleString("ar-SA")}
`,
          },
        }),
      });
    } catch (error) {
      console.error("خطأ في إرسال إيميل الموظف:", error);
    }

    // إشعارات SMS/WhatsApp إذا كانت مفعلة
    if (data.preferredContact === "whatsapp") {
      try {
        await fetch("/api/notifications/whatsapp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config: { enabled: true },
            message: {
              recipient: data.phone,
              body: `مرحباً ${data.name}، شكراً لتواصلك مع عالم التنظيف. تم استلام طلبك وسنتواصل معك قريباً. رقم المرجع: ${messageId}`,
            },
          }),
        });
      } catch (error) {
        console.error("خطأ في إرسال واتساب:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notify.error(
        "خطأ في البيانات",
        "يرجى تصحيح البيانات المدخلة والمحاولة مرة أخرى",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // حفظ الرسالة في قاعدة البيانات
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
          status: "unread",
          source: "contact_form",
        }),
      });

      if (!response.ok) {
        throw new Error("فشل في إرسال الرسالة");
      }

      // إرسال الإشعارات
      await sendNotifications(formData);

      // إشعار نجاح
      notify.success("تم إرسال رسالتك بنجاح", "سنتواصل معك في أقرب وقت ممكن");

      // استدعاء الـ callback إذا كان متوفراً
      if (onSubmit) {
        onSubmit(formData);
      }

      // إعادة تعيين النموذج
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        serviceType: defaultServiceType,
        priority: "medium",
        message: "",
        preferredContact: "phone",
        address: "",
        district: "",
        preferredTime: "",
      });
    } catch (error) {
      console.error("خطأ في إرسال النموذج:", error);
      notify.error(
        "خطأ في الإرسال",
        "حدث خطأ أثناء إرسال رسالتك. يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "secondary";
      case "medium":
        return "default";
      case "low":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card className={`max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageSquare className="w-6 h-6" />
          {t("contact.title")}
        </CardTitle>
        <p className="text-muted-foreground">{t("contact.subtitle")}</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات العميل */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("contact.form.name")} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="أدخل اسمك الكامل"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("contact.form.email")} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="example@email.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("contact.form.phone")} *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+966 50 123 4567"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredContact">طريقة التواصل المفضلة</Label>
              <Select
                value={formData.preferredContact}
                onValueChange={(value: "email" | "phone" | "whatsapp") =>
                  updateField("preferredContact", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      مكالمة هاتفية
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      واتساب
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      بريد إلكتروني
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* العنوان إذا كان مطلوباً */}
          {showAddressFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="أدخل العنوان التفصيلي"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">الحي</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => updateField("district", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحي" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* تفاصيل الطلب */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">نوع الخدمة *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => updateField("serviceType", value)}
              >
                <SelectTrigger
                  className={errors.serviceType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="اختر نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.serviceType}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">
                الأولوية
                <Badge
                  variant={getPriorityColor(formData.priority)}
                  className="ml-2"
                >
                  {formData.priority === "urgent"
                    ? "عاجل"
                    : formData.priority === "high"
                      ? "عالية"
                      : formData.priority === "medium"
                        ? "متوسطة"
                        : "منخفضة"}
                </Badge>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "low" | "medium" | "high" | "urgent") =>
                  updateField("priority", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفضة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="high">عالية</SelectItem>
                  <SelectItem value="urgent">🚨 عاجل</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">الموضوع *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => updateField("subject", e.target.value)}
                placeholder="موضوع الرسالة"
                className={errors.subject ? "border-red-500" : ""}
              />
              {errors.subject && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.subject}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredTime">الوقت المفضل</Label>
              <Select
                value={formData.preferredTime}
                onValueChange={(value) => updateField("preferredTime", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الوقت المناسب" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {slot.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* الرسالة */}
          <div className="space-y-2">
            <Label htmlFor="message">الرسالة *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              placeholder="اكتب رسالتك هنا... (على الأقل 10 أحرف)"
              rows={4}
              className={errors.message ? "border-red-500" : ""}
            />
            <div className="flex justify-between items-center">
              {errors.message && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.message}
                </p>
              )}
              <span className="text-xs text-muted-foreground">
                {formData.message.length} حرف
              </span>
            </div>
          </div>

          {/* زر الإرسال */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جارٍ الإرسال...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                إرسال الرسالة
              </>
            )}
          </Button>

          {/* معلومات إضافية */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  سيتم إرسال تأكيد استلام رسالتك على:
                </p>
                <ul className="text-muted-foreground space-y-1">
                  <li>• البريد الإلكتروني المدخل</li>
                  {formData.preferredContact === "whatsapp" && (
                    <li>• رسالة واتساب على الرقم المدخل</li>
                  )}
                  <li>• إشعار فوري لفريق الدعم</li>
                </ul>
                <p className="text-xs mt-2">
                  ⏰ متوسط وقت الرد: أقل من 24 ساعة
                </p>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
