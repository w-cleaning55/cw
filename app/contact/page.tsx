"use client";

import React, { useState } from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        const data = await response.json();
        setSubmitStatus("error");
        setErrorMessage(data.error || "حدث خطأ أثناء إرسال الرسالة");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "الهاتف",
      value: "+966559061065",
      link: "tel:+966559061065",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "البريد الإلكتروني",
      value: "admin@cw.com.sa",
      link: "mailto:admin@cw.com.sa",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "العنوان",
      value: "جدة، المملكة العربية السعودية",
      link: "https://maps.google.com/?q=Jeddah,Saudi+Arabia",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "ساعات العمل",
      value: "السبت - الخميس: 8:00 ص - 5:00 م",
      link: null,
    },
  ];

  const services = [
    "تنظيف المنازل والفلل",
    "تنظيف المكاتب والشركات",
    "تنظيف السجاد والستائر",
    "جلي وتلميع الرخام",
    "تنظيف خزانات المياه",
    "مكافحة الحشرات",
    "خدمة أخرى",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" dir="rtl">
            اتصل بنا
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed" dir="rtl">
            نحن هنا لمساعدتك في جميع احتياجات التنظيف. تواصل معنا الآن!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center" dir="rtl">
                  أرسل لنا رسالة
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitStatus === "success" && (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium" dir="rtl">
                        الاسم الكامل *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="mt-1"
                        dir="rtl"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium" dir="rtl">
                        رقم الهاتف *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="mt-1"
                        dir="rtl"
                        placeholder="+966501234567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium" dir="rtl">
                      البريد الإلكتروني
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-1"
                      dir="rtl"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service" className="text-sm font-medium" dir="rtl">
                      نوع الخدمة المطلوبة
                    </Label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => handleInputChange("service", e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      dir="rtl"
                    >
                      <option value="">اختر نوع الخدمة</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium" dir="rtl">
                      الرسالة *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                      rows={5}
                      className="mt-1"
                      dir="rtl"
                      placeholder="اكتب تفاصيل طلبك هنا..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        إرسال الرسالة
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6" dir="rtl">
                معلومات التواصل
              </h2>
              <p className="text-lg text-gray-600 mb-8" dir="rtl">
                نحن متاحون على مدار الساعة لمساعدتك في جميع احتياجات التنظيف. 
                لا تتردد في التواصل معنا بأي وسيلة تفضلها.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4 space-x-reverse">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900" dir="rtl">
                      {info.title}
                    </h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                        dir="rtl"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-gray-600" dir="rtl">
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4" dir="rtl">
                إجراءات سريعة
              </h3>
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <a href="https://wa.me/966559061065" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    تواصل عبر واتساب
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <a href="tel:+966559061065">
                    <Phone className="w-4 h-4 mr-2" />
                    اتصل الآن
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4" dir="rtl">
              موقعنا في جدة
            </h3>
            <p className="text-gray-600 mb-6" dir="rtl">
              نخدم جميع أحياء جدة بفريق متخصص ومدرب
            </p>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600" dir="rtl">
                    خريطة تفاعلية - جدة، المملكة العربية السعودية
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4"
                  >
                    <a href="https://maps.google.com/?q=Jeddah,Saudi+Arabia" target="_blank" rel="noopener noreferrer">
                      عرض على الخريطة
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}