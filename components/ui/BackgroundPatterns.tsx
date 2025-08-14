"use client";

import React from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Large circles */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
        />
        
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-200/20 to-green-200/20 rounded-full blur-3xl"
        />

        {/* Medium shapes */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-2xl"
        />

        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
          }}
          className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 rounded-full blur-2xl"
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function GeometricPatterns() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Hexagon pattern */}
      <div className="absolute top-20 right-20 opacity-5">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {[...Array(6)].map((_, i) => (
            <motion.polygon
              key={i}
              points="100,20 180,60 180,140 100,180 20,140 20,60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, delay: i * 0.3 }}
              transform={`scale(${0.3 + i * 0.15}) translate(${i * 5}, ${i * 5})`}
            />
          ))}
        </svg>
      </div>

      {/* Triangle patterns */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-32 left-32 opacity-5"
      >
        <svg width="150" height="150" viewBox="0 0 150 150">
          <polygon points="75,10 140,130 10,130" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="75,30 120,110 30,110" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="75,50 100,90 50,90" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Circle patterns */}
      <div className="absolute top-1/3 left-1/4 opacity-5">
        {[...Array(5)].map((_, i) => (
          <motion.circle
            key={i}
            cx="50"
            cy="50"
            r={10 + i * 8}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.2 }}
            style={{
              position: 'absolute',
              width: '100px',
              height: '100px',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function FloatingElements() {
  const elements = [
    { size: 'w-4 h-4', color: 'bg-blue-400/20', x: '10%', y: '20%' },
    { size: 'w-6 h-6', color: 'bg-purple-400/20', x: '80%', y: '30%' },
    { size: 'w-3 h-3', color: 'bg-cyan-400/20', x: '20%', y: '70%' },
    { size: 'w-5 h-5', color: 'bg-green-400/20', x: '90%', y: '80%' },
    { size: 'w-4 h-4', color: 'bg-pink-400/20', x: '60%', y: '15%' },
    { size: 'w-7 h-7', color: 'bg-indigo-400/20', x: '30%', y: '85%' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, i) => (
        <motion.div
          key={i}
          className={`absolute ${element.size} ${element.color} rounded-full blur-sm`}
          style={{
            left: element.x,
            top: element.y,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

export default function BackgroundPatterns({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <AnimatedBackground />
      <GeometricPatterns />
      <FloatingElements />
      {children}
    </div>
  );
}
