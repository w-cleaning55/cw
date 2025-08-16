"use client";

import React from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialInput {
  name?: string;
  rating?: number;
  comment?: string;
  service?: string;
}

interface Testimonial {
  name: string;
  rating: number;
  comment: string;
  service: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => (
  <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="flex mb-4" role="img" aria-label={`تقييم ${testimonial.rating} من 5 نجوم`}>
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 text-yellow-400 fill-current"
            aria-hidden="true"
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
    </CardContent>
  </Card>
);

interface TestimonialsSectionProps {
  className?: string;
  title?: string;
  subtitle?: string;
  items?: TestimonialInput[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ className = "", title, subtitle, items }) => {
  const defaultTestimonials: Testimonial[] = [
    {
      name: "أحمد محمد",
      rating: 5,
      comment: "خدمة ممتازة وفريق محترف. تم تنظيف منزلي بشكل مثالي والنتيجة فاقت توقعاتي.",
      service: "تنظيف منزل",
    },
    {
      name: "فاطمة الأحمدي",
      rating: 5,
      comment: "سرعة في الأداء ودقة في العمل. أنصح الجميع بالتعامل مع عالم النظافة.",
      service: "تنظيف مكتب",
    },
    {
      name: "محمد العتيبي",
      rating: 5,
      comment: "تعامل راقي وأسعار معقولة. السجاد أصبح كالجديد تماماً.",
      service: "تنظيف سجاد",
    },
  ];

  const testimonials: Testimonial[] = (items && items.length > 0)
    ? items.map((t) => ({
        name: t.name || "عميل",
        rating: Math.min(5, Math.max(1, t.rating || 5)),
        comment: t.comment || "",
        service: t.service || "",
      }))
    : defaultTestimonials;

  return (
    <section className={`py-20 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
            {title || "آراء عملائنا"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto" dir="rtl">
            {subtitle || "ما يقوله عملاؤنا الكرام عن خدماتنا وجودة العمل"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
