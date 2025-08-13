"use client";

import React from "react";
import {
  CompanyLogo,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  PhoneIcon,
  EmailIcon,
  LocationIcon,
} from "@/components/ui/CompactIcons";
import { MessageCircle } from "lucide-react";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
  className = "text-gray-400 hover:text-white transition-colors",
}) => (
  <a href={href} className={className} dir="rtl">
    {children}
  </a>
);

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => (
  <div>
    <h4 className="text-lg font-semibold mb-4" dir="rtl">
      {title}
    </h4>
    {children}
  </div>
);

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const services = [
    { name: "تنظيف المنازل", href: "#" },
    { name: "تنظيف المكاتب", href: "#" },
    { name: "تنظيف السجاد", href: "#" },
    { name: "جلي الرخام", href: "#" },
  ];

  const links = [
    { name: "من نحن", href: "#" },
    { name: "اتصل بنا", href: "#" },
    { name: "سياسة الخصوصية", href: "#" },
    { name: "شروط الاستخدام", href: "#" },
  ];

  const socialMedia = [
    { icon: <FacebookIcon size="md" />, href: "#", label: "Facebook" },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      href: "#",
      label: "WhatsApp",
    },
    { icon: <TwitterIcon size="md" />, href: "#", label: "Twitter" },
    { icon: <InstagramIcon size="md" />, href: "#", label: "Instagram" },
  ];

  return (
    <footer className={`bg-gray-900 text-white py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <CompanyLogo size="lg" />
              <h3 className="text-2xl font-bold" dir="rtl">
                عالم النظافة
              </h3>
            </div>
            <p className="text-gray-400 mb-4" dir="rtl">
              شريككم الموثوق لخدمات التنظيف المحترفة في جدة
            </p>
            <div
              className="flex space-x-4"
              role="list"
              aria-label="وسائل التواصل الاجتماعي"
            >
              {socialMedia.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                  role="listitem"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <FooterSection title="خدماتنا">
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <FooterLink href={service.href}>{service.name}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="روابط مهمة">
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <FooterLink href={link.href}>{link.name}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="تواصل معنا">
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center gap-2">
                <PhoneIcon className="text-blue-400" />
                <p>0500000000</p>
              </div>
              <div className="flex items-center gap-2">
                <EmailIcon className="text-blue-400" />
                <p>info@cleaningworld.sa</p>
              </div>
              <div className="flex items-center gap-2" dir="rtl">
                <LocationIcon className="text-blue-400" />
                <p>جدة، المملكة العربية السعودية</p>
              </div>
            </div>
          </FooterSection>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p dir="rtl">© 2024 عالم النظافة جدة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
