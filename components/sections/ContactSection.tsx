"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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
}

const ContactSection: React.FC<ContactSectionProps> = ({ className = "" }) => {
  const contactInfo = [
    {
      icon: <Phone className="w-12 h-12 mx-auto" />,
      title: "هاتف",
      details: ["0500000000", "0112345678"],
    },
    {
      icon: <Mail className="w-12 h-12 mx-auto" />,
      title: "بريد إلكتروني",
      details: ["info@cleaningworld.sa", "booking@cleaningworld.sa"],
    },
    {
      icon: <MapPin className="w-12 h-12 mx-auto" />,
      title: "العنوان",
      details: ["جدة، المملكة العربية السعودية", "حي الزهراء، شارع الملك عبدالعزيز"],
    },
  ];

  return (
    <section id="contact" className={`py-20 bg-blue-600 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" dir="rtl">
            تواصل معنا اليوم
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto" dir="rtl">
            احصل على استشارة مجانية وعرض أسعار مخصص لاحتياجاتك
          </p>
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

        <div className="text-center">
          <Button 
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mr-4"
            size="lg"
          >
            احصل على عرض مجاني
          </Button>
          <Button 
            variant="outline"
            className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-white"
            size="lg"
          >
            اتصل الآن
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
