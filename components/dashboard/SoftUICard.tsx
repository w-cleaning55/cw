"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SoftUICardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "solid" | "gradient" | "shadow";
  padding?: "sm" | "md" | "lg" | "xl";
  borderRadius?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const SoftUICard: React.FC<SoftUICardProps> = ({
  children,
  className = "",
  variant = "glass",
  padding = "lg",
  borderRadius = "xl"
}) => {
  const variants = {
    glass: "bg-white/70 backdrop-blur-lg border border-white/20 shadow-lg",
    solid: "bg-white shadow-xl border border-gray-100",
    gradient: "bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm border border-white/30 shadow-lg",
    shadow: "bg-white shadow-2xl border-0"
  };

  const paddings = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8",
    xl: "p-10"
  };

  const radiuses = {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
    "2xl": "rounded-[2rem]"
  };

  return (
    <div 
      className={cn(
        "transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl",
        variants[variant],
        paddings[padding],
        radiuses[borderRadius],
        className
      )}
    >
      {children}
    </div>
  );
};

export default SoftUICard;
