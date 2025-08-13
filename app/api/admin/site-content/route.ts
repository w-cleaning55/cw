import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

interface ComponentSettings {
  id: string;
  name: string;
  nameAr: string;
  isEnabled: boolean;
  order: number;
  settings: Record<string, any>;
  content: Record<string, any>;
}

interface ContentSettings {
  components: ComponentSettings[];
  heroSettings: any;
  serviceSettings: any;
  reviewSettings: any;
  aboutSettings: any;
  ctaSettings: any;
  footerSettings: any;
  lastUpdated: string;
}

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDefaultContent(): ContentSettings {
  return {
    components: [
      {
        id: "hero",
        name: "Hero Section",
        nameAr: "القسم الرئيسي",
        isEnabled: true,
        order: 1,
        settings: {},
        content: {},
      },
      {
        id: "about",
        name: "About Section",
        nameAr: "قسم من نحن",
        isEnabled: true,
        order: 2,
        settings: {},
        content: {},
      },
      {
        id: "services",
        name: "Services Section",
        nameAr: "قسم الخدمات",
        isEnabled: true,
        order: 3,
        settings: {},
        content: {},
      },
      {
        id: "reviews",
        name: "Reviews Section",
        nameAr: "قسم الآراء",
        isEnabled: true,
        order: 4,
        settings: {},
        content: {},
      },
      {
        id: "cta",
        name: "Call to Action",
        nameAr: "دعوة للعمل",
        isEnabled: true,
        order: 5,
        settings: {},
        content: {},
      },
      {
        id: "footer",
        name: "Footer",
        nameAr: "التذييل",
        isEnabled: true,
        order: 6,
        settings: {},
        content: {},
      },
    ],
    heroSettings: {
      title: "الحل الأمثل لخدمات التنظيف",
      titleAr: "الحل الأمثل لخدمات التنظيف",
      subtitle: "نظافة احترافية تفوق التوقعات",
      subtitleAr: "نظافة احترافية تفوق التوقعات",
      description:
        "نقدم خدمات تنظيف متكاملة باستخدام أحدث التقنيات والمعدات المتطورة مع فريق مدرب على أعلى مستوى",
      descriptionAr:
        "نقدم خدمات تنظيف متكاملة باستخدام أحدث التقنيات والمعدات المتطورة مع فريق مدرب على أعلى مستوى",
      backgroundImage: "",
      videoBackground: "",
      overlayOpacity: 0.7,
      animationSpeed: 1,
      ctaPrimary: "احجز الآن",
      ctaPrimaryAr: "احجز الآن",
      ctaSecondary: "اعرف المزيد",
      ctaSecondaryAr: "اعرف المزيد",
      showStats: true,
      stats: [
        {
          value: "2000+",
          label: "عميل راضٍ",
          labelAr: "عميل راضٍ",
          icon: "users",
        },
        {
          value: "500+",
          label: "مشروع مكتمل",
          labelAr: "مشروع مكتمل",
          icon: "award",
        },
        {
          value: "10+",
          label: "سنوات خبرة",
          labelAr: "سنوات خبرة",
          icon: "star",
        },
        {
          value: "24/7",
          label: "دعم متواصل",
          labelAr: "دعم متواصل",
          icon: "clock",
        },
      ],
    },
    serviceSettings: {
      title: "خدماتنا المتخصصة",
      titleAr: "خدماتنا المتخصصة",
      description: "نقدم مجموعة شاملة من خدمات التنظيف المتخصصة",
      descriptionAr: "نقدم مجموعة شاملة من خدمات التنظيف المتخصصة",
      showPricing: true,
      showRating: true,
      showBookingButton: true,
      imageUploadEnabled: true,
      iconUploadEnabled: true,
      services: [],
    },
    reviewSettings: {
      title: "آراء عملائنا",
      titleAr: "آراء عملائنا",
      showPhotos: true,
      showRating: true,
      showDate: true,
      autoplay: true,
      slidesPerView: 3,
      animationDuration: 5000,
      reviews: [],
    },
    aboutSettings: {
      title: "من نحن",
      titleAr: "من نحن",
      description: "شركة رائدة في مجال خدمات التنظيف",
      descriptionAr: "شركة رائدة في مجال خدمات التنظيف",
      mainImage: "",
      galleryImages: [],
      showExperience: true,
      experienceYears: 10,
      showTeamSize: true,
      teamSize: 50,
      showCertifications: true,
      certifications: [],
      values: [],
    },
    ctaSettings: {
      title: "احصل على خدمة تنظيف احترافية اليوم",
      titleAr: "احصل على خدمة تنظيف احترافية اليوم",
      description: "اتصل بنا الآن للحصول على استشارة مجانية وعرض سعر مخصص",
      descriptionAr: "اتصل بنا الآن للحصول على استشارة مجانية وعرض سعر مخصص",
      backgroundType: "gradient",
      backgroundImage: "",
      backgroundVideo: "",
      overlayColor: "#000000",
      overlayOpacity: 0.5,
      showPhone: true,
      phoneNumber: "+966501234567",
      showWhatsApp: true,
      whatsappNumber: "+966501234567",
      showEmail: true,
      email: "info@cleaningworld.sa",
      showDiscount: true,
      discountPercentage: 20,
      discountText: "خصم خاص للعملاء الجدد",
      discountTextAr: "خصم خاص للعملاء الجدد",
    },
    footerSettings: {
      companyDescription:
        "شركة تنظيف عالمي - الحل الأمثل لجميع احتياجات التنظيف",
      companyDescriptionAr:
        "شركة تنظيف عالمي - الحل الأمثل لجميع احتياجات التنظيف",
      showSocialLinks: true,
      showNewsletter: true,
      showQuickLinks: true,
      showContact: true,
      socialLinks: [
        { platform: "facebook", url: "https://facebook.com", icon: "facebook" },
        { platform: "twitter", url: "https://twitter.com", icon: "twitter" },
        {
          platform: "instagram",
          url: "https://instagram.com",
          icon: "instagram",
        },
        { platform: "linkedin", url: "https://linkedin.com", icon: "linkedin" },
      ],
      quickLinks: [
        { title: "الخدمات", titleAr: "الخدمات", url: "/services" },
        { title: "من نحن", titleAr: "من نحن", url: "/about" },
        { title: "اتصل بنا", titleAr: "اتصل بنا", url: "/contact" },
        { title: "الأسئلة الشائعة", titleAr: "الأسئلة الشائعة", url: "/faq" },
      ],
      contactInfo: {
        address: "الرياض، المملكة العربية السعودية",
        addressAr: "الرياض، المملكة العربية السعودية",
        phone: "+966501234567",
        email: "info@cleaningworld.sa",
        workingHours: "الأحد - الخميس: 8:00 ص - 6:00 م",
        workingHoursAr: "الأحد - الخميس: 8:00 ص - 6:00 م",
      },
      newsletterTitle: "اشترك في نشرتنا الإخبارية",
      newsletterTitleAr: "اشترك في نشرتنا الإخبارية",
      newsletterDescription: "احصل على آخر العروض والأخبار",
      newsletterDescriptionAr: "احصل على آخر العروض والأخبار",
    },
    lastUpdated: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    ensureDataDirectory();

    let content: ContentSettings;

    if (fs.existsSync(CONTENT_FILE)) {
      const fileContent = fs.readFileSync(CONTENT_FILE, "utf-8");
      content = JSON.parse(fileContent);
    } else {
      content = getDefaultContent();
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error reading content settings:", error);
    return NextResponse.json(
      { error: "Failed to load content settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();

    const body = await request.json();
    const updatedContent: ContentSettings = {
      ...body,
      lastUpdated: new Date().toISOString(),
    };

    fs.writeFileSync(CONTENT_FILE, JSON.stringify(updatedContent, null, 2));

    return NextResponse.json({
      success: true,
      message: "Content settings saved successfully",
      lastUpdated: updatedContent.lastUpdated,
    });
  } catch (error) {
    console.error("Error saving content settings:", error);
    return NextResponse.json(
      { error: "Failed to save content settings" },
      { status: 500 },
    );
  }
}
