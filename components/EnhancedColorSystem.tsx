import React from "react";
import { useEnhancedTheme } from "./EnhancedThemeProvider";

interface EnhancedColorSystemProps {
  children: React.ReactNode;
}

export default function EnhancedColorSystem({
  children,
}: EnhancedColorSystemProps) {
  const { theme, activePalette, isAnimating } = useEnhancedTheme();

  return (
    <div
      className={`enhanced-color-system ${isAnimating ? "transitioning" : ""}`}
    >
      {children}

      {/* Enhanced Color System Styles */}
      <style>{`
        .enhanced-color-system {
          --color-primary-rgb: ${activePalette ? hexToRgb(activePalette.colors.primary) : "37, 99, 235"};
          --color-secondary-rgb: ${activePalette ? hexToRgb(activePalette.colors.secondary) : "100, 116, 139"};
          --color-accent-rgb: ${activePalette ? hexToRgb(activePalette.colors.accent) : "14, 165, 233"};
          --color-background-rgb: ${activePalette ? hexToRgb(activePalette.colors.background) : "255, 255, 255"};
          --color-surface-rgb: ${activePalette ? hexToRgb(activePalette.colors.surface) : "248, 250, 252"};
          --color-text-rgb: ${activePalette ? hexToRgb(activePalette.colors.text) : "15, 23, 42"};
        }

        /* Enhanced gradient definitions */
        .gradient-primary {
          background: linear-gradient(
            135deg,
            rgb(var(--color-primary-rgb)) 0%,
            rgb(var(--color-accent-rgb)) 100%
          );
        }

        .gradient-primary-soft {
          background: linear-gradient(
            135deg,
            rgba(var(--color-primary-rgb), 0.1) 0%,
            rgba(var(--color-accent-rgb), 0.1) 100%
          );
        }

        .gradient-surface {
          background: linear-gradient(
            145deg,
            rgba(var(--color-surface-rgb), 0.95) 0%,
            rgba(var(--color-background-rgb), 0.8) 100%
          );
        }

        .gradient-text {
          background: linear-gradient(
            135deg,
            rgb(var(--color-primary-rgb)) 0%,
            rgb(var(--color-accent-rgb)) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Professional glass effects */
        .glass-effect {
          background: rgba(var(--color-surface-rgb), 0.1);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(var(--color-primary-rgb), 0.1);
          box-shadow: 
            0 8px 32px 0 rgba(var(--color-primary-rgb), 0.1),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }

        .glass-effect-strong {
          background: rgba(var(--color-surface-rgb), 0.2);
          backdrop-filter: blur(30px) saturate(200%);
          border: 1px solid rgba(var(--color-primary-rgb), 0.2);
          box-shadow: 
            0 16px 64px 0 rgba(var(--color-primary-rgb), 0.15),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.15);
        }

        /* Enhanced shadows */
        .shadow-soft {
          box-shadow: 
            0 1px 3px 0 rgba(var(--color-text-rgb), 0.1),
            0 1px 2px 0 rgba(var(--color-text-rgb), 0.06);
        }

        .shadow-medium {
          box-shadow: 
            0 4px 6px -1px rgba(var(--color-text-rgb), 0.1),
            0 2px 4px -1px rgba(var(--color-text-rgb), 0.06);
        }

        .shadow-large {
          box-shadow: 
            0 10px 15px -3px rgba(var(--color-text-rgb), 0.1),
            0 4px 6px -2px rgba(var(--color-text-rgb), 0.05);
        }

        .shadow-colored {
          box-shadow: 
            0 10px 25px -5px rgba(var(--color-primary-rgb), 0.25),
            0 10px 10px -5px rgba(var(--color-accent-rgb), 0.1);
        }

        /* Professional borders */
        .border-gradient {
          position: relative;
          background: linear-gradient(
            rgba(var(--color-background-rgb), 1),
            rgba(var(--color-background-rgb), 1)
          ) padding-box,
          linear-gradient(
            135deg,
            rgba(var(--color-primary-rgb), 0.3),
            rgba(var(--color-accent-rgb), 0.3)
          ) border-box;
          border: 1px solid transparent;
        }

        .border-animated {
          position: relative;
          overflow: hidden;
        }

        .border-animated::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(var(--color-primary-rgb), 0.4),
            transparent
          );
          transition: left 0.5s;
        }

        .border-animated:hover::before {
          left: 100%;
        }

        /* Enhanced text effects */
        .text-shimmer {
          background: linear-gradient(
            110deg,
            rgb(var(--color-text-rgb)) 45%,
            rgb(var(--color-primary-rgb)) 55%,
            rgb(var(--color-text-rgb)) 65%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2s linear infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Professional buttons */
        .btn-enhanced {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            rgb(var(--color-primary-rgb)) 0%,
            rgb(var(--color-accent-rgb)) 100%
          );
          border: none;
          color: white;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          opacity: 0;
          transition: opacity 300ms ease;
        }

        .btn-enhanced:hover::before {
          opacity: 1;
        }

        .btn-enhanced::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s;
        }

        .btn-enhanced:active::after {
          width: 200px;
          height: 200px;
          transition: width 0s, height 0s;
        }

        /* Professional cards */
        .card-enhanced {
          background: rgba(var(--color-surface-rgb), 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(var(--color-primary-rgb), 0.1);
          border-radius: calc(var(--radius) * 1.5);
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .card-enhanced::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(var(--color-primary-rgb), 0.5),
            transparent
          );
        }

        .card-enhanced:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 20px 25px -5px rgba(var(--color-primary-rgb), 0.1),
            0 10px 10px -5px rgba(var(--color-accent-rgb), 0.05);
          border-color: rgba(var(--color-primary-rgb), 0.2);
        }

        /* Enhanced inputs */
        .input-enhanced {
          position: relative;
          background: rgba(var(--color-surface-rgb), 0.5);
          border: 1px solid rgba(var(--color-primary-rgb), 0.2);
          backdrop-filter: blur(10px);
          transition: all 200ms ease;
        }

        .input-enhanced:focus {
          background: rgba(var(--color-surface-rgb), 0.8);
          border-color: rgb(var(--color-primary-rgb));
          box-shadow: 
            0 0 0 3px rgba(var(--color-primary-rgb), 0.1),
            0 4px 6px -1px rgba(var(--color-primary-rgb), 0.1);
          outline: none;
        }

        /* Professional spacing and rhythm */
        .rhythm-content > * + * {
          margin-top: 1.5rem;
        }

        .rhythm-content h1,
        .rhythm-content h2,
        .rhythm-content h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .rhythm-content p {
          line-height: 1.7;
        }

        /* Enhanced loading states */
        .loading-shimmer {
          background: linear-gradient(
            90deg,
            rgba(var(--color-surface-rgb), 1) 25%,
            rgba(var(--color-primary-rgb), 0.1) 50%,
            rgba(var(--color-surface-rgb), 1) 75%
          );
          background-size: 200% 100%;
          animation: loading-shimmer 1.5s infinite;
        }

        @keyframes loading-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Professional transitions */
        .transition-enhanced {
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .transition-smooth {
          transition: all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .transition-bounce {
          transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        /* Dark mode enhancements */
        .dark .glass-effect {
          background: rgba(var(--color-surface-rgb), 0.05);
          border-color: rgba(var(--color-primary-rgb), 0.15);
        }

        .dark .card-enhanced {
          background: rgba(var(--color-surface-rgb), 0.7);
          border-color: rgba(var(--color-primary-rgb), 0.15);
        }

        .dark .input-enhanced {
          background: rgba(var(--color-surface-rgb), 0.3);
          border-color: rgba(var(--color-primary-rgb), 0.25);
        }

        /* Accessibility enhancements */
        @media (prefers-reduced-motion: reduce) {
          .transition-enhanced,
          .transition-smooth,
          .transition-bounce,
          .btn-enhanced,
          .card-enhanced,
          .input-enhanced {
            transition: none;
          }
          
          .text-shimmer,
          .loading-shimmer {
            animation: none;
          }
        }

        /* Print styles */
        @media print {
          .glass-effect,
          .glass-effect-strong {
            background: white;
            backdrop-filter: none;
            border: 1px solid #ccc;
          }
          
          .gradient-primary,
          .gradient-primary-soft {
            background: #f0f0f0;
          }
        }
      `}</style>
    </div>
  );
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 0, 0";
}
