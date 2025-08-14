"use client";

import React from "react";
import { Phone, Mail, MapPin, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG, COMPANY_INFO } from "@/lib/constants";

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  details: string[];
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, title, details }) => (
  <div className="text-center">
    <div className="mx-auto mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2" dir="rtl">
      {title}
    </h3>
    {details.map((detail, index) => (
      <p key={index} className={index === 1 ? "text-blue-100" : ""}>{detail}</p>
    ))}
  </div>
);

interface ContactSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

const ContactSection: React.FC<ContactSectionProps> = ({ className = "", title, subtitle, description }) => {
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("فشل إرسال الطلب");
      setSuccess("تم إرسال طلبك بنجاح، سنعاود الاتصال بك.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (e: any) {
      setError(e?.message || "خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-12 h-12 mx-auto" />,
      title: "هاتف",
      details: [APP_CONFIG.phone],
    },
    {
      icon: <Mail className="w-12 h-12 mx-auto" />,
      title: "بريد إلكتروني",
      details: [APP_CONFIG.email],
    },
    {
      icon: <MapPin className="w-12 h-12 mx-auto" />,
      title: "العنوان",
      details: [
        `${COMPANY_INFO.location.city}، ${COMPANY_INFO.location.country}`,
        COMPANY_INFO.location.streetAddress || "",
      ].filter(Boolean),
    },
  ];

  const mapQuery = encodeURIComponent(`${COMPANY_INFO.location.city} ${COMPANY_INFO.location.streetAddress || ""}`);
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  return (
    <section id="contact" className={`py-20 bg-blue-600 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" dir="rtl">
            {title || "تواصل معنا اليوم"}
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto" dir="rtl">
            {subtitle || "احصل على استشارة مجانية وعرض أسعار مخصص لاحتياجاتك"}
          </p>
          {description && (
            <p className="text-blue-100/90 max-w-3xl mx-auto mt-3" dir="rtl">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <ContactInfo
              key={index}
              icon={info.icon}
              title={info.title}
              details={info.details}
            />
          ))}
        </div>

        {/* Map and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Map */}
          <div className="rounded-xl overflow-hidden shadow-lg border border-white/20 h-[360px] bg-white">
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="خريطة الموقع"
            />
          </div>

          {/* Form */}
          <form onSubmit={submit} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl space-y-4" dir="rtl">
            {success && <div className="p-3 bg-green-50 text-green-800 rounded">{success}</div>}
            {error && <div className="p-3 bg-red-50 text-red-700 rounded">{error}</div>}

            <div>
              <label className="block mb-1">الاسم</label>
              <input
                className="w-full rounded-lg px-3 py-2 text-gray-900"
                name="name"
                required
                value={form.name}
                onChange={onChange}
                placeholder="اكتب اسمك الكامل"
                autoComplete="name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">البريد الإلكتروني</label>
                <input
                  className="w-full rounded-lg px-3 py-2 text-gray-900"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="example@domain.com"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block mb-1">رقم الجوال</label>
                <input
                  className="w-full rounded-lg px-3 py-2 text-gray-900"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="+9665xxxxxxxx"
                  autoComplete="tel"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">الرسالة</label>
              <textarea
                className="w-full rounded-lg px-3 py-2 text-gray-900 h-28"
                name="message"
                required
                value={form.message}
                onChange={onChange}
                placeholder="صف طلبك أو استفسارك"
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-white text-blue-600 hover:bg-gray-100">
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> جاري الإرسال...</>
              ) : (
                <><Send className="w-4 h-4 mr-2" /> إرسال</>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
