import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CONTENT_FILE = path.join(process.cwd(), "data/dynamic-content.json");

export async function GET(request: NextRequest) {
  try {
    if (!fs.existsSync(CONTENT_FILE)) {
      // إنشاء ملف المحتوى الافتراضي إذا لم يكن موجوداً
      const defaultContent = {
        homepage: {
          hero: {
            component: "modern",
            title: { ar: "عالم النظافة جدة", en: "Cleaning World Jeddah" },
            subtitle: {
              ar: "شريككم الموثوق لخدمات التنظيف المحترفة",
              en: "Your trusted partner for professional cleaning services",
            },
            description: {
              ar: "شركة تنظيف محترفة في جدة نستخدم أحدث المعدات العالمية",
              en: "Professional cleaning company in Jeddah using latest international equipment",
            },
            cta: { ar: "احصل على عرض مجاني", en: "Get Free Quote" },
            ctaSecondary: { ar: "اتصل الآن", en: "Call Now" },
            backgroundImage: "/images/hero-banner.svg",
            statsVisible: true,
            stats: {
              experience: {
                value: "6+",
                label: { ar: "سنوات الخبرة", en: "Years Experience" },
              },
              projects: {
                value: "2850+",
                label: { ar: "مشروع مكتمل", en: "Projects Completed" },
              },
              employees: {
                value: "50+",
                label: { ar: "موظف متخصص", en: "Skilled Employees" },
              },
              satisfaction: {
                value: "98.5%",
                label: { ar: "رضا العملاء", en: "Customer Satisfaction" },
              },
            },
          },
          order: ["hero","services","features","about","testimonials","contact"],
          services: {
            component: "premium",
            visible: true,
            title: { ar: "خدماتنا المميزة", en: "Our Featured Services" },
            subtitle: {
              ar: "حلول تنظيف مهنية لجميع احتياجاتك",
              en: "Professional cleaning solutions for all your needs",
            },
            showCount: 6,
            viewAllButton: { ar: "عرض جميع الخدمات", en: "View All Services" },
            layout: "grid",
            cardStyle: "modern",
          },
          features: {
            component: "standard",
            visible: true,
            title: {
              ar: "لماذا نحن الخيار الأفضل؟",
              en: "Why We Are The Best Choice?",
            },
            subtitle: {
              ar: "نقدم خدمات تنظيف عالية الجودة بأحدث المعدات والتقنيات",
              en: "We provide high-quality cleaning services with latest equipment and technologies",
            },
            layout: "3columns",
            items: [],
          },
          about: {
            component: "standard",
            visible: true,
            title: { ar: "من نحن؟", en: "Who We Are?" },
            subtitle: {
              ar: "شركة رائدة في مجال خدمات التنظيف بجدة",
              en: "Leading company in cleaning services in Jeddah",
            },
            description: {
              ar: "شركة تنظيف احترافية تأسست عام 2018",
              en: "Professional cleaning company established in 2018",
            },
            image: "/uploads/about/about-hero.jpg",
            videoUrl: "",
            achievements: [],
          },
          testimonials: {
            component: "standard",
            visible: true,
            title: { ar: "آراء عملائنا", en: "Customer Reviews" },
            subtitle: {
              ar: "ما يقوله عملاؤنا الكرام عن خدماتنا",
              en: "What our valued customers say about our services",
            },
            showCount: 3,
            autoSlide: true,
            slideInterval: 5000,
            showRatings: true,
            showDates: true,
          },
          contact: {
            component: "formMap",
            visible: true,
            title: { ar: "تواصل معنا اليوم", en: "Contact Us Today" },
            subtitle: {
              ar: "احصل على استشارة مجانية وعرض أسعار خاص",
              en: "Get free consultation and special price quote",
            },
            description: {
              ar: "فريقنا جاهز لخدمتك على مدار الساعة",
              en: "Our team is ready to serve you 24/7",
            },
            ctaPrimary: { ar: "اتصل الآن", en: "Call Now" },
            ctaSecondary: { ar: "واتساب", en: "WhatsApp" },
            backgroundImage: "/uploads/cta/contact-bg.jpg",
          },
        },
        settings: {
          siteName: { ar: "عالم النظافة جدة", en: "Cleaning World Jeddah" },
          siteDescription: {
            ar: "شركة تنظيف احترافية في جدة",
            en: "Professional cleaning company in Jeddah",
          },
          defaultLanguage: "ar",
          enableMultiLanguage: true,
          supportedLanguages: ["ar", "en"],
          rtlSupport: true,
          theme: {
            primary: "#2563eb",
            secondary: "#059669",
            accent: "#dc2626",
            neutral: "#6b7280",
          },
          layout: {
            headerStyle: "modern",
            footerStyle: "detailed",
            sidebarPosition: "right",
            containerMaxWidth: "1280px",
          },
          features: {
            darkMode: true,
            animations: true,
            lazyLoading: true,
            seo: true,
            analytics: true,
            cookieConsent: true,
          },
        },
        navigation: {
          header: {
            logo: {
              image: "/images/logo.svg",
              imageAr: "/images/logo-ar.svg",
              text: { ar: "عالم النظافة", en: "Cleaning World" },
              showText: true,
            },
            menu: [
              {
                id: "home",
                label: { ar: "الرئيسية", en: "Home" },
                url: "/",
                active: true,
                order: 1,
              },
              {
                id: "services",
                label: { ar: "خدماتنا", en: "Our Services" },
                url: "/services",
                active: true,
                order: 2,
              },
              {
                id: "about",
                label: { ar: "من نحن", en: "About Us" },
                url: "/about",
                active: true,
                order: 3,
              },
              {
                id: "contact",
                label: { ar: "اتصل بنا", en: "Contact Us" },
                url: "/contact",
                active: true,
                order: 4,
              },
            ],
            contactInfo: {
              phone: "+966126543210",
              whatsapp: "+966556789012",
              showInHeader: true,
            },
            languageSelector: { show: true, style: "dropdown" },
            themeSelector: { show: true, position: "header" },
          },
          footer: {
            columns: [],
            socialMedia: {
              show: true,
              platforms: [
                {
                  name: "facebook",
                  url: "https://facebook.com/CleaningWorldJeddah",
                  icon: "Facebook",
                },
                {
                  name: "twitter",
                  url: "https://twitter.com/cleanworld_jed",
                  icon: "Twitter",
                },
                {
                  name: "instagram",
                  url: "https://instagram.com/cleaningworld.jeddah",
                  icon: "Instagram",
                },
              ],
            },
            newsletter: {
              show: true,
              title: {
                ar: "اشترك في النشرة الإخبارية",
                en: "Subscribe to Newsletter",
              },
              placeholder: {
                ar: "أدخل بريدك الإلكتروني",
                en: "Enter your email",
              },
              button: { ar: "اشت��اك", en: "Subscribe" },
            },
            copyright: {
              text: {
                ar: "جميع الحقوق محفوظة © 2024 عالم النظافة جدة",
                en: "All Rights Reserved © 2024 Cleaning World Jeddah",
              },
              showYear: true,
            },
          },
        },
        metadata: {
          version: "1.0.0",
          lastModified: new Date().toISOString(),
          modifiedBy: "admin",
          revision: 1,
        },
      };

      fs.writeFileSync(
        CONTENT_FILE,
        JSON.stringify(defaultContent, null, 2),
        "utf8",
      );
      return NextResponse.json(defaultContent);
    }

    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
    return NextResponse.json(content);
  } catch (error) {
    console.error("Error reading dynamic content:", error);
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();

    // تحديث البيانات الوصفية
    content.metadata = {
      ...content.metadata,
      lastModified: new Date().toISOString(),
      modifiedBy: "admin",
      revision: (content.metadata?.revision || 0) + 1,
    };

    // حفظ المحتوى
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf8");

    // إنشاء نسخة احتياطية
    const backupDir = path.join(process.cwd(), "data/backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(
      backupDir,
      `dynamic-content-${new Date().toISOString().split("T")[0]}-${Date.now()}.json`,
    );
    fs.writeFileSync(backupFile, JSON.stringify(content, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: "Content saved successfully",
      revision: content.metadata.revision,
    });
  } catch (error) {
    console.error("Error saving dynamic content:", error);
    return NextResponse.json(
      { error: "Failed to save content" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const backup = searchParams.get("backup");

    if (backup === "true") {
      // إنشاء نسخة احتياطية قبل الحذف
      if (fs.existsSync(CONTENT_FILE)) {
        const content = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
        const backupDir = path.join(process.cwd(), "data/backups");
        if (!fs.existsSync(backupDir)) {
          fs.mkdirSync(backupDir, { recursive: true });
        }

        const backupFile = path.join(
          backupDir,
          `dynamic-content-deleted-${Date.now()}.json`,
        );
        fs.writeFileSync(backupFile, JSON.stringify(content, null, 2), "utf8");
      }
    }

    // حذف الملف
    if (fs.existsSync(CONTENT_FILE)) {
      fs.unlinkSync(CONTENT_FILE);
    }

    return NextResponse.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting dynamic content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 },
    );
  }
}
