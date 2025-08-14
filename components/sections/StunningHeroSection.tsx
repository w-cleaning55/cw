"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Stars, Zap, Shield, Award, Heart } from "lucide-react";

export default function StunningHeroSection() {
  const floatingIcons = [
    { Icon: Sparkles, delay: 0, x: 100, y: 50 },
    { Icon: Stars, delay: 0.5, x: -80, y: 80 },
    { Icon: Zap, delay: 1, x: 150, y: -60 },
    { Icon: Shield, delay: 1.5, x: -120, y: -40 },
    { Icon: Award, delay: 2, x: 80, y: 120 },
    { Icon: Heart, delay: 2.5, x: -50, y: -80 },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Main Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        
        {/* Animated Gradients */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-400/30 via-purple-400/20 to-pink-400/30 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-emerald-400/30 via-blue-400/20 to-violet-400/30 rounded-full blur-3xl"
        />

        {/* Particle Effects */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-right"
          >
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>خدمات تنظيف عالية الجودة</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              عالم النظافة
              <span className="block text-4xl lg:text-5xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                المحترف
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 mb-8 leading-relaxed max-w-lg"
            >
              شريكتكم الموثوق لخدمات التنظيف المحترفة مع ضمان الجودة والتميز في كل مشروع
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl text-white font-semibold overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  احجز الآن
                  <Zap className="w-5 h-5" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300"
              >
                تواصل معنا
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-6 mt-12 text-white/70"
            >
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
            </motion.div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Glass Card */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                className="relative p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl" />
                
                {/* Content inside glass card */}
                <div className="relative text-center text-white">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-12 h-12" />
                  </motion.div>
                  
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
                      <div className="text-2xl font-bold text-purple-400">2850+</div>
                      <div className="text-sm text-white/70">عميل</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">100%</div>
                      <div className="text-sm text-white/70">ضمان</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Icons */}
              {floatingIcons.map(({ Icon, delay, x, y }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -20, 0],
                    x: [0, x * 0.1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: delay,
                  }}
                  className="absolute w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 flex items-center justify-center text-white"
                  style={{
                    left: `${50 + (x * 0.5)}%`,
                    top: `${50 + (y * 0.5)}%`,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          fill="none"
          className="w-full h-20 text-white"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            fillOpacity="0.1"
          />
        </svg>
      </div>
    </section>
  );
}
