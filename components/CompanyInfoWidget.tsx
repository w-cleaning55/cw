"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  ExternalLink,
  MessageCircle,
  Globe,
  Award,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { COMPANY_INFO, COMPANY_STATS } from "@/lib/constants";

interface CompanyInfoWidgetProps {
  language?: "ar" | "en";
  showMap?: boolean;
  showStats?: boolean;
  className?: string;
}

const CompanyInfoWidget: React.FC<CompanyInfoWidgetProps> = ({
  language = "ar",
  showMap = true,
  showStats = true,
  className = "",
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<"ar" | "en">(language);

  // Bilingual content
  const content = {
    ar: {
      title: "معلومات الشركة",
      name: COMPANY_INFO.fullName,
      tagline: COMPANY_INFO.tagline,
      description: COMPANY_INFO.description,
      contactTitle: "تواصل معنا",
      locationTitle: "موقعنا",
      servicesTitle: "خدماتنا",
      statsTitle: "إحصائياتنا",
      callUs: "اتصل بنا",
      whatsapp: "واتساب",
      email: "البريد الإلكتروني",
      address: "العنوان",
      openOnMap: "افتح في الخريطة",
      viewProfile: "عرض الملف التجاري",
      workingHours: "ساعات العمل",
      workingTime: "24/7 - طوال الأسبوع",
      founded: `تأسست عام ${COMPANY_INFO.foundedYear}`,
      switchToEnglish: "English",
    },
    en: {
      title: "Company Information",
      name: "Cleaning World Jeddah",
      tagline:
        "Your trusted partner for professional cleaning services in Jeddah",
      description:
        "We use the latest international equipment with a team of trained specialists to ensure the highest standards of cleanliness and quality",
      contactTitle: "Contact Us",
      locationTitle: "Our Location",
      servicesTitle: "Our Services",
      statsTitle: "Our Statistics",
      callUs: "Call Us",
      whatsapp: "WhatsApp",
      email: "Email",
      address: "Address",
      openOnMap: "Open in Maps",
      viewProfile: "View Business Profile",
      workingHours: "Working Hours",
      workingTime: "24/7 - All Week",
      founded: `Founded in ${COMPANY_INFO.foundedYear}`,
      switchToEnglish: "العربية",
    },
  };

  const t = content[currentLanguage];
  const isRTL = currentLanguage === "ar";

  // Google Maps configuration for Jeddah
  const mapCenter = { lat: 21.4858, lng: 39.1925 }; // Jeddah coordinates
  const googleMapsUrl = `https://www.google.com/maps/place/Al+Zahra,+Jeddah+23425,+Saudi+Arabia/@${mapCenter.lat},${mapCenter.lng},15z`;

  // WhatsApp configuration
  const whatsappNumber = COMPANY_INFO.contact.phones[0].replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    currentLanguage === "ar"
      ? `مرحباً، أود الاستفسار عن خدمات التنظيف في ${COMPANY_INFO.fullName}`
      : `Hello, I would like to inquire about cleaning services at ${t.name}`,
  );
  const whatsappUrl = `https://wa.me/966${whatsappNumber.slice(1)}?text=${whatsappMessage}`;

  // Google Business Profile URL (you'll need to replace with actual profile)
  const googleBusinessUrl =
    "https://business.google.com/n/7234567890123456789/searchprofile?hl=ar";

  // Phone number formatting for display
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  return (
    <Card
      className={`w-full max-w-4xl mx-auto ${className}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <CardHeader className="text-center relative">
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentLanguage((prev) => (prev === "ar" ? "en" : "ar"))
            }
            className="text-xs"
          >
            <Globe className="w-3 h-3 mr-1" />
            {t.switchToEnglish}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="text-3xl">🧽</div>
          <CardTitle className="text-2xl font-bold text-blue-600">
            {t.name}
          </CardTitle>
        </div>

        <p className="text-gray-600 font-medium">{t.tagline}</p>
        <p className="text-sm text-gray-500">{t.description}</p>

        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            {t.founded}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {COMPANY_STATS.rating}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            {t.contactTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Numbers */}
            <div className="space-y-2">
              {COMPANY_INFO.contact.phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="font-mono">{formatPhoneNumber(phone)}</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-8 px-2"
                    >
                      <a href={`tel:${phone}`}>{t.callUs}</a>
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 px-2 bg-green-600 hover:bg-green-700"
                      asChild
                    >
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {t.whatsapp}
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Email & Working Hours */}
            <div className="space-y-3">
              {COMPANY_INFO.contact.emails.map((email, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <a
                    href={`mailto:${email}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {email}
                  </a>
                </div>
              ))}

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-sm font-medium">{t.workingHours}</div>
                  <div className="text-xs text-gray-500">{t.workingTime}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Location & Maps */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" />
            {t.locationTitle}
          </h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <div className="flex-1">
                <p className="text-sm">{COMPANY_INFO.location.streetAddress}</p>
                <p className="text-sm text-gray-500">
                  {COMPANY_INFO.location.city}, {COMPANY_INFO.location.country}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {t.openOnMap}
                </a>
              </Button>

              <Button variant="outline" size="sm" asChild>
                <a
                  href={googleBusinessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Star className="w-3 h-3 mr-1" />
                  {t.viewProfile}
                </a>
              </Button>
            </div>

            {/* Embedded Map */}
            {showMap && (
              <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(COMPANY_INFO.location.streetAddress + ", " + COMPANY_INFO.location.city)}&language=${currentLanguage}`}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
        </div>

        {/* Company Statistics */}
        {showStats && (
          <>
            <Separator />
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                {t.statsTitle}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {COMPANY_STATS.experience}
                  </div>
                  <div className="text-xs text-gray-600">
                    {COMPANY_STATS.experienceLabel}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {COMPANY_STATS.projects}
                  </div>
                  <div className="text-xs text-gray-600">
                    {COMPANY_STATS.projectsLabel}
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {COMPANY_STATS.employees}
                  </div>
                  <div className="text-xs text-gray-600">
                    {COMPANY_STATS.employeesLabel}
                  </div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {COMPANY_STATS.satisfaction}
                  </div>
                  <div className="text-xs text-gray-600">
                    {COMPANY_STATS.satisfactionLabel}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button className="flex-1 bg-green-600 hover:bg-green-700" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4 mr-2" />
              {currentLanguage === "ar"
                ? "تواصل عبر واتساب"
                : "Contact via WhatsApp"}
            </a>
          </Button>

          <Button variant="outline" className="flex-1" asChild>
            <a href={`tel:${COMPANY_INFO.contact.phones[0]}`}>
              <Phone className="w-4 h-4 mr-2" />
              {currentLanguage === "ar" ? "اتصل الآن" : "Call Now"}
            </a>
          </Button>

          <Button variant="outline" className="flex-1" asChild>
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Star className="w-4 h-4 mr-2" />
              {currentLanguage === "ar" ? "تقييمنا" : "Our Reviews"}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoWidget;
