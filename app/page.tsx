"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  Users,
  Award,
  Clock,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">
                  🧽 عالم النظافة
                </h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8" dir="rtl">
              <a
                href="#home"
                className="text-gray-900 hover:text-blue-600 font-medium"
              >
                الرئيسية
              </a>
              <a
                href="#services"
                className="text-gray-900 hover:text-blue-600 font-medium"
              >
                خدماتنا
              </a>
              <a
                href="#about"
                className="text-gray-900 hover:text-blue-600 font-medium"
              >
                من نحن
              </a>
              <a
                href="#contact"
                className="text-gray-900 hover:text-blue-600 font-medium"
              >
                اتصل بنا
              </a>
              <Link
                href="/admin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                لوحة الإدارة
              </Link>
            </nav>
            <div className="md:hidden">
              <button className="text-gray-500 hover:text-gray-600">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" dir="rtl">
              عالم النظافة جدة
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" dir="rtl">
              شريككم الموثوق لخدمات التنظيف المحترفة في جدة
            </p>
            <p className="text-lg mb-10 max-w-4xl mx-auto opacity-90" dir="rtl">
              نستخدم أحدث المعدات العالمية مع فريق من المتخصصين المدربين لضمان
              أعلى معايير النظافة والجودة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                احصل على عرض مجاني
              </button>
              <button className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                <Phone className="w-5 h-5 inline ml-2" />
                اتصل الآن: 0500000000
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">6+</div>
              <div className="text-gray-600">سنوات الخبرة</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2850+</div>
              <div className="text-gray-600">مشروع مكتمل</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">موظف متخصص</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98.5%</div>
              <div className="text-gray-600">رضا العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              dir="rtl"
            >
              خدماتنا المميزة
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" dir="rtl">
              نقدم مجموعة شاملة من خدمات التنظيف المحترفة لجميع احتياجاتكم
              السكنية والتجارية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "تنظيف المنازل والفلل",
                desc: "خدمة تنظيف شاملة للمنازل والفلل مع ضمان الجودة",
                icon: "🏠",
              },
              {
                title: "تنظيف المكاتب والشركات",
                desc: "حلول تنظيف احترافية للمكاتب والمباني التجارية",
                icon: "🏢",
              },
              {
                title: "تنظيف السجاد والستائر",
                desc: "خدمة تنظيف وتعقيم السجاد والستائر بأحدث التقنيات",
                icon: "🧽",
              },
              {
                title: "جلي وتلميع الرخام",
                desc: "تلميع وصيانة الأرضيات الرخامية والبلاط",
                icon: "✨",
              },
              {
                title: "تنظيف خزانات المياه",
                desc: "تنظيف وتعقيم خزانات المياه وفقاً للمعايير الصحية",
                icon: "💧",
              },
              {
                title: "مكافحة الحشرات",
                desc: "خدمات مكافحة الحشرات والقوارض بمواد آمنة",
                icon: "🛡️",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3
                  className="text-xl font-semibold text-gray-900 mb-3"
                  dir="rtl"
                >
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4" dir="rtl">
                  {service.desc}
                </p>
                <button className="text-blue-600 font-medium hover:text-blue-700">
                  اطلب الخدمة ←
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              dir="rtl"
            >
              لماذا نحن الخيار الأفضل؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" dir="rtl">
              نتميز بالجودة والمصداقية في تقديم خدمات التنظيف لأكثر من 6 سنوات
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3
                className="text-xl font-semibold text-gray-900 mb-3"
                dir="rtl"
              >
                ضمان 100%
              </h3>
              <p className="text-gray-600" dir="rtl">
                ضمان شامل على جميع خدماتنا مع إمكانية الإعادة في حالة عدم الرضا
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3
                className="text-xl font-semibold text-gray-900 mb-3"
                dir="rtl"
              >
                خدمة سريعة
              </h3>
              <p className="text-gray-600" dir="rtl">
                فريق عمل محترف ينجز المهام في الوقت المحدد بأعلى معايير الجودة
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3
                className="text-xl font-semibold text-gray-900 mb-3"
                dir="rtl"
              >
                جودة عالية
              </h3>
              <p className="text-gray-600" dir="rtl">
                استخدام أفضل المعدات والمواد الصديقة للبيئة والآمنة على الصحة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                dir="rtl"
              >
                من نحن؟
              </h2>
              <p className="text-gray-600 mb-6" dir="rtl">
                عالم النظافة جدة هي شركة رائدة في مجال خدمات التنظيف المحترفة،
                تأسست عام 2018 بهدف تقديم خدمات تنظيف عالية الجودة للمنازل
                والمكاتب والمنشآت التجارية في مدينة جدة.
              </p>
              <p className="text-gray-600 mb-6" dir="rtl">
                نحن نفخر بامتلاك فريق من المتخصصين المدربين على أعلى مستوى،
                ونستخدم أحدث المعدات والتقنيات الأمريكية والأوروبية لضمان تحقيق
                أفضل النتائج.
              </p>
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700" dir="rtl">
                  معدات حديثة ومتطورة
                </span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700" dir="rtl">
                  فريق مدرب ومؤهل
                </span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-gray-700" dir="rtl">
                  أسعار تنافسية وعادلة
                </span>
              </div>
            </div>
            <div className="bg-blue-100 p-8 rounded-xl">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600">50+</div>
                  <div className="text-gray-600">موظف متخصص</div>
                </div>
                <div>
                  <Award className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600">2850+</div>
                  <div className="text-gray-600">مشروع مكتمل</div>
                </div>
                <div>
                  <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600">4.9/5</div>
                  <div className="text-gray-600">تقييم العملاء</div>
                </div>
                <div>
                  <Clock className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-gray-600">خدمة العملاء</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              dir="rtl"
            >
              آراء عملائنا
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" dir="rtl">
              ما يقوله عملاؤنا الكرام عن خدماتنا وجودة العمل
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "أحمد محمد",
                rating: 5,
                comment:
                  "خدمة ممتازة وفريق محترف. تم تنظيف منزلي بشكل مثالي والنتيجة فاقت توقعاتي.",
                service: "تنظيف منزل",
              },
              {
                name: "فاطمة الأحمدي",
                rating: 5,
                comment:
                  "س��عة في الأداء ودقة في العمل. أنصح الجميع بالتعامل مع عالم النظافة.",
                service: "تنظيف مكتب",
              },
              {
                name: "محمد العتيبي",
                rating: 5,
                comment:
                  "تعامل راقي وأسعار معقولة. السجاد أصبح كالجديد تماماً.",
                service: "تنظيف سجاد",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4" dir="rtl">
                  "{testimonial.comment}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900" dir="rtl">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm" dir="rtl">
                    {testimonial.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-600 text-white">
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
            <div className="text-center">
              <Phone className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2" dir="rtl">
                هاتف
              </h3>
              <p>0500000000</p>
              <p>0112345678</p>
            </div>
            <div className="text-center">
              <Mail className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2" dir="rtl">
                بريد إلكتروني
              </h3>
              <p>info@cleaningworld.sa</p>
              <p>booking@cleaningworld.sa</p>
            </div>
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2" dir="rtl">
                العنوان
              </h3>
              <p dir="rtl">جدة، المملكة العربية السعودية</p>
              <p dir="rtl">حي الزهراء، شارع الملك عبدالعزيز</p>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mr-4">
              احصل على عرض مجاني
            </button>
            <button className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              اتصل الآن
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" dir="rtl">
                🧽 عالم النظافة
              </h3>
              <p className="text-gray-400 mb-4" dir="rtl">
                شريككم الموثوق لخدمات التنظيف المحترفة في جدة
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  📘
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  📱
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  🐦
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  📷
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" dir="rtl">
                خدماتنا
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white" dir="rtl">
                    تنظيف المنازل
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white" dir="rtl">
                    تنظيف المكاتب
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white" dir="rtl">
                    تنظيف السجاد
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white" dir="rtl">
                    جلي الرخام
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" dir="rtl">
                روابط مهمة
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white" dir="rtl">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white" dir="rtl">
                    اتصل بنا
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white" dir="rtl">
                    سياسة الخصوصية
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white" dir="rtl">
                    شروط الاستخدام
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4" dir="rtl">
                تواصل معنا
              </h4>
              <div className="space-y-2 text-gray-400">
                <p dir="rtl">📞 0500000000</p>
                <p>📧 info@cleaningworld.sa</p>
                <p dir="rtl">📍 جدة، المملكة العربية السعودية</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p dir="rtl">© 2024 عالم النظافة جدة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
