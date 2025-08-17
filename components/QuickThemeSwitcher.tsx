"use client";

import React from "react";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickThemeSwitcherProps {
  className?: string;
}

export default function QuickThemeSwitcher({ className = "" }: QuickThemeSwitcherProps) {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label="Theme controls">
      <Button
        variant={theme === "light" ? "default" : "outline"}
        size="sm"
        onClick={() => setTheme("light")}
        className="h-8 w-8 p-0"
        title="فاتح"
        aria-label="تفعيل الوضع الفاتح"
      >
        <Sun className="w-4 h-4" />
      </Button>
      
      <Button
        variant={theme === "dark" ? "default" : "outline"}
        size="sm"
        onClick={() => setTheme("dark")}
        className="h-8 w-8 p-0"
        title="داكن"
        aria-label="تفعيل الوضع الداكن"
      >
        <Moon className="w-4 h-4" />
      </Button>
      
      <Button
        variant={theme === "system" ? "default" : "outline"}
        size="sm"
        onClick={() => setTheme("system")}
        className="h-8 w-8 p-0"
        title="تلقائي"
        aria-label="تفعيل الوضع التلقائي"
      >
        <Monitor className="w-4 h-4" />
      </Button>
    </div>
  );
}