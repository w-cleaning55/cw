import React, { useEffect } from "react";
import { useEnhancedTheme } from "./EnhancedThemeProvider";

interface ProfessionalDesignSystemProps {
  children: React.ReactNode;
}

export default function ProfessionalDesignSystem({
  children,
}: ProfessionalDesignSystemProps) {
  const { activePalette, theme } = useEnhancedTheme();

  useEffect(() => {
    // Clean up any unwanted styles and prevent color bleeding
    const cleanupStyles = () => {
      const root = document.documentElement;

      // Remove any problematic CSS variables that might cause bleeding
      const problematicVars = [
        "--color-bleeding",
        "--gradient-overflow",
        "--shadow-bleed",
        "--border-blend",
      ];

      problematicVars.forEach((varName) => {
        root.style.removeProperty(varName);
      });

      // Apply professional containment
      root.style.setProperty("contain", "layout style paint");

      // Ensure proper color isolation
      root.style.setProperty("isolation", "isolate");

      // Prevent color bleeding in flex/grid containers
      root.style.setProperty("--container-isolation", "isolate");
    };

    cleanupStyles();
  }, [activePalette, theme]);

  return (
    <div className="professional-design-system">
      {children}

      {/* Professional Design System Styles */}
      <style>{`
        /* Reset and Professional Base */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          line-height: 1.15;
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        body {
          margin: 0;
          font-family: system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          font-feature-settings: 'kern' 1;
          font-kerning: normal;
          font-variant-ligatures: common-ligatures contextual;
          font-variant-numeric: oldstyle-nums proportional-nums;
        }

        /* Professional Color Containment */
        .color-contained {
          isolation: isolate;
          contain: layout style paint;
        }

        .gradient-contained {
          isolation: isolate;
          position: relative;
          overflow: hidden;
        }

        .gradient-contained::before {
          content: '';
          position: absolute;
          inset: 0;
          background: inherit;
          z-index: -1;
          contain: strict;
        }

        /* Professional Shadow System */
        .shadow-clean {
          box-shadow: 
            0 1px 3px 0 rgba(0, 0, 0, 0.1),
            0 1px 2px 0 rgba(0, 0, 0, 0.06);
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05));
        }

        .shadow-clean-md {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.04));
        }

        .shadow-clean-lg {
          box-shadow: 
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.03));
        }

        /* Professional Border System */
        .border-clean {
          border: 1px solid hsl(var(--border));
          border-radius: calc(var(--radius) - 2px);
        }

        .border-professional {
          border: 1px solid hsla(var(--border), 0.5);
          border-radius: var(--radius);
          position: relative;
        }

        .border-professional::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            135deg,
            hsla(var(--primary), 0.1) 0%,
            hsla(var(--border), 0.3) 50%,
            hsla(var(--primary), 0.1) 100%
          );
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask-composite: xor;
        }

        /* Clean Typography */
        h1, h2, h3, h4, h5, h6 {
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: -0.025em;
          color: hsl(var(--foreground));
          margin: 0;
        }

        h1 {
          font-size: clamp(1.5rem, 4vw, 2.25rem);
        }

        h2 {
          font-size: clamp(1.25rem, 3.5vw, 1.875rem);
        }

        h3 {
          font-size: clamp(1.125rem, 3vw, 1.5rem);
        }

        p {
          line-height: 1.6;
          color: hsl(var(--muted-foreground));
          margin: 0;
        }

        /* Professional Button System */
        .btn-clean {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1;
          padding: 0.5rem 1rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          cursor: pointer;
          text-decoration: none;
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }

        .btn-clean:focus-visible {
          outline: 2px solid hsl(var(--ring));
          outline-offset: 2px;
        }

        .btn-clean:disabled {
          pointer-events: none;
          opacity: 0.5;
        }

        .btn-primary {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }

        .btn-primary:hover {
          background: hsl(var(--primary) / 0.9);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px hsl(var(--primary) / 0.3);
        }

        .btn-secondary {
          background: hsl(var(--secondary));
          color: hsl(var(--secondary-foreground));
        }

        .btn-secondary:hover {
          background: hsl(var(--secondary) / 0.8);
        }

        .btn-outline {
          border: 1px solid hsl(var(--border));
          background: transparent;
          color: hsl(var(--foreground));
        }

        .btn-outline:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }

        .btn-ghost {
          background: transparent;
          color: hsl(var(--foreground));
        }

        .btn-ghost:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }

        /* Professional Card System */
        .card-clean {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          box-shadow: 0 1px 3px 0 hsl(var(--shadow-color) / 0.1);
          color: hsl(var(--card-foreground));
          isolation: isolate;
          contain: layout style;
        }

        .card-elevated {
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border) / 0.5);
          border-radius: calc(var(--radius) + 2px);
          box-shadow: 
            0 4px 6px -1px hsl(var(--shadow-color) / 0.1),
            0 2px 4px -1px hsl(var(--shadow-color) / 0.06);
          color: hsl(var(--card-foreground));
          isolation: isolate;
          contain: layout style;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-elevated:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 10px 15px -3px hsl(var(--shadow-color) / 0.1),
            0 4px 6px -2px hsl(var(--shadow-color) / 0.05);
        }

        /* Professional Input System */
        .input-clean {
          display: flex;
          height: 2.5rem;
          width: 100%;
          border-radius: var(--radius);
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          color: hsl(var(--foreground));
        }

        .input-clean::placeholder {
          color: hsl(var(--muted-foreground));
        }

        .input-clean:focus {
          outline: none;
          border-color: hsl(var(--ring));
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }

        .input-clean:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* Professional Layout System */
        .container-clean {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          isolation: isolate;
        }

        .grid-clean {
          display: grid;
          gap: 1rem;
          isolation: isolate;
        }

        .flex-clean {
          display: flex;
          isolation: isolate;
        }

        /* Remove Strange Symbols and Clean Text */
        .text-clean {
          font-family: inherit;
          font-synthesis: none;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Remove problematic pseudo-elements */
        .clean-element::before,
        .clean-element::after {
          display: none !important;
        }

        /* Professional Scrollbars */
        .scrollbar-clean {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--muted)) hsl(var(--background));
        }

        .scrollbar-clean::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .scrollbar-clean::-webkit-scrollbar-track {
          background: hsl(var(--background));
          border-radius: 4px;
        }

        .scrollbar-clean::-webkit-scrollbar-thumb {
          background: hsl(var(--muted));
          border-radius: 4px;
          border: 2px solid hsl(var(--background));
        }

        .scrollbar-clean::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }

        /* Professional Spacing System */
        .space-y-clean > * + * {
          margin-top: 1rem;
        }

        .space-y-clean-sm > * + * {
          margin-top: 0.5rem;
        }

        .space-y-clean-lg > * + * {
          margin-top: 1.5rem;
        }

        .space-x-clean > * + * {
          margin-left: 1rem;
        }

        .space-x-clean-sm > * + * {
          margin-left: 0.5rem;
        }

        .space-x-clean-lg > * + * {
          margin-left: 1.5rem;
        }

        /* Professional Color Bleeding Prevention */
        .prevent-bleed {
          isolation: isolate;
          contain: layout style paint;
          position: relative;
        }

        .prevent-bleed::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: hsl(var(--background));
          z-index: -1;
          border-radius: inherit;
        }

        /* Professional Animation Cleanup */
        .animation-clean {
          will-change: auto;
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }

        /* Clean Focus States */
        .focus-clean:focus-visible {
          outline: 2px solid hsl(var(--ring));
          outline-offset: 2px;
          border-radius: var(--radius);
        }

        /* Remove Strange Characters and Symbols */
        .text-no-symbols {
          font-variant-ligatures: none;
          font-feature-settings: 'liga' 0, 'clig' 0, 'dlig' 0, 'hlig' 0;
        }

        /* Professional RTL Support */
        [dir="rtl"] .space-x-clean > * + * {
          margin-left: 0;
          margin-right: 1rem;
        }

        [dir="rtl"] .space-x-clean-sm > * + * {
          margin-left: 0;
          margin-right: 0.5rem;
        }

        [dir="rtl"] .space-x-clean-lg > * + * {
          margin-left: 0;
          margin-right: 1.5rem;
        }

        /* Dark Mode Enhancements */
        .dark .shadow-clean {
          box-shadow: 
            0 1px 3px 0 rgba(0, 0, 0, 0.3),
            0 1px 2px 0 rgba(0, 0, 0, 0.2);
        }

        .dark .shadow-clean-md {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }

        .dark .shadow-clean-lg {
          box-shadow: 
            0 10px 15px -3px rgba(0, 0, 0, 0.3),
            0 4px 6px -2px rgba(0, 0, 0, 0.2);
        }

        /* Professional Print Styles */
        @media print {
          .shadow-clean,
          .shadow-clean-md,
          .shadow-clean-lg {
            box-shadow: none !important;
          }

          .card-clean,
          .card-elevated {
            border: 1px solid #ccc !important;
            box-shadow: none !important;
          }

          .btn-clean {
            border: 1px solid #333 !important;
            color: #333 !important;
            background: white !important;
          }

          .prevent-bleed::before {
            display: none !important;
          }
        }

        /* High Contrast Mode Support */
        @media (prefers-contrast: high) {
          .border-clean,
          .border-professional {
            border-width: 2px;
          }

          .btn-clean {
            border-width: 2px;
          }

          .input-clean {
            border-width: 2px;
          }

          .card-clean,
          .card-elevated {
            border-width: 2px;
          }
        }

        /* Reduced Motion Support */
        @media (prefers-reduced-motion: reduce) {
          .card-elevated,
          .btn-clean,
          .input-clean {
            transition: none !important;
          }

          .card-elevated:hover {
            transform: none !important;
          }

          .btn-primary:hover {
            transform: none !important;
          }

          .animation-clean {
            animation: none !important;
            transform: none !important;
          }
        }

        /* Performance Optimizations */
        .will-change-auto {
          will-change: auto;
        }

        .gpu-accelerated {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Content Security */
        .secure-content {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          pointer-events: none;
        }

        .secure-content.interactive {
          user-select: auto;
          -webkit-user-select: auto;
          -moz-user-select: auto;
          -ms-user-select: auto;
          pointer-events: auto;
        }
      `}</style>
    </div>
  );
}
