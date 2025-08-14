"use client";

import React from "react";
import { Sparkles, Stars, Zap, Shield, Award, Heart } from "lucide-react";

export default function FastHeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />

      {/* Simple animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-purple-400/20 to-pink-400/30 animate-pulse" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>خدمات تنظيف عالية الجودة</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              عالم النظافة
              <span className="block text-4xl lg:text-5xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                المحترف
              </span>
            </h1>

            <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-lg">
              شريكتكم الموثوق لخدمات التنظيف المحترفة مع ضمان الجودة والتميز في
              كل مشروع
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-white font-semibold hover:scale-105 hover:-translate-y-1 transition-all duration-300">
                <span className="flex items-center gap-2">
                  احجز الآن
                  <Zap className="w-5 h-5" />
                </span>
              </button>

              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300">
                تواصل معنا
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 mt-12 text-white/70">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>شركة معتمدة</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>ضمان شامل</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span>2850+ عميل سعيد</span>
              </div>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            {/* Main Glass Card */}
            <div className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              {/* Content inside glass card */}
              <div className="relative text-center text-white">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-12 h-12" />
                </div>

                <h3 className="text-2xl font-bold mb-4">خدمة متميزة</h3>
                <p className="text-white/80 mb-6">
                  فريق متخصص ومدرب على أعلى مستوى من الجودة والاحترافية
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">4.9</div>
                    <div className="text-sm text-white/70">تقييم</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      2850+
                    </div>
                    <div className="text-sm text-white/70">عميل</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">
                      100%
                    </div>
                    <div className="text-sm text-white/70">ضمان</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          fill="none"
          className="w-full h-20 text-white"
        >
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            fillOpacity="0.1"
          />
        </svg>
      </div>
    </section>
  );
}
