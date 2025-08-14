"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, Award, Star, Zap, Shield, Heart, Target } from "lucide-react";

export default function StunningStatsSection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      icon: Users,
      number: 2850,
      suffix: "+",
      label: "عميل سعيد",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
      description: "عملاء راضون عن خدماتنا",
    },
    {
      icon: Star,
      number: 4.9,
      suffix: "/5",
      label: "تقييم العملاء",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/20 to-orange-500/20",
      description: "متوسط تقييم عملائنا",
    },
    {
      icon: Award,
      number: 100,
      suffix: "%",
      label: "ضمان الجودة",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/20 to-emerald-500/20",
      description: "ضمان شامل على جميع الخدمات",
    },
    {
      icon: Zap,
      number: 24,
      suffix: "/7",
      label: "خدمة العملاء",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
      description: "دعم مستمر على مدار الساعة",
    },
  ];

  const achievements = [
    { icon: Shield, label: "شركة معتمدة", color: "text-blue-400" },
    { icon: Heart, label: "خدمة موثوقة", color: "text-red-400" },
    { icon: Target, label: "دقة في الإنجاز", color: "text-green-400" },
    { icon: TrendingUp, label: "نمو مستمر", color: "text-purple-400" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50/50" />
        
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-200/30 to-green-200/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 text-blue-700 text-sm mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            <span>إحصائيات مذهلة</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            أرقام تتحدث عن
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              تميزنا وإنجازاتنا
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            نفخر بالثقة التي منحها لنا عملاؤنا وبالإنجازات التي حققناها معاً
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="group relative"
            >
              {/* Main Card */}
              <div className="relative p-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative text-center">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                    className="text-4xl font-bold text-gray-800 mb-2"
                  >
                    <CountingNumber 
                      end={stat.number} 
                      suffix={stat.suffix}
                      isInView={isInView}
                      delay={index * 0.2 + 0.5}
                    />
                  </motion.div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {stat.label}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600">
                    {stat.description}
                  </p>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                  className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full blur-xl opacity-30`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Achievements Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center items-center gap-8"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              className="flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg"
            >
              <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
              <span className="font-medium text-gray-700">{achievement.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Counting Animation Component
function CountingNumber({ 
  end, 
  suffix, 
  isInView, 
  delay 
}: { 
  end: number; 
  suffix: string; 
  isInView: boolean; 
  delay: number; 
}) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = end / steps;
      let currentCount = 0;

      const counter = setInterval(() => {
        currentCount += increment;
        if (currentCount >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(currentCount));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [end, isInView, delay]);

  return (
    <span>
      {count.toLocaleString('ar-SA')}
      {suffix}
    </span>
  );
}
