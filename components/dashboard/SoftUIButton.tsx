"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SoftUIButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "glass" | "gradient" | "outline";
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const SoftUIButton: React.FC<SoftUIButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  icon
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-md",
    glass: "bg-white/20 backdrop-blur-lg border border-white/30 text-white shadow-lg hover:bg-white/30",
    gradient: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-blue-500/30 text-blue-600 hover:bg-blue-50 backdrop-blur-sm"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  return (
    <button
      className={cn(
        "rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/20",
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span>{icon}</span>}
        {children}
      </div>
    </button>
  );
};

export default SoftUIButton;
