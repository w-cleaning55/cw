import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  moveSpeed: number;
}

export default function DarkModeBackground() {
  const { theme } = useTheme();
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  // Only show in dark mode
  const isDarkMode = theme === "dark";

  useEffect(() => {
    setMounted(true);

    // Generate stars with improved distribution and properties
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = 300; // Increased star count for better coverage

      for (let i = 0; i < starCount; i++) {
        // Create different star clusters for more realistic distribution
        const starType = Math.random();
        let x, y, size, opacity, twinkleSpeed;

        if (starType < 0.7) {
          // Regular stars - most common
          x = Math.random() * 100;
          y = Math.random() * 100;
          size = Math.random() * 2 + 0.5;
          opacity = Math.random() * 0.6 + 0.3;
          twinkleSpeed = Math.random() * 4 + 2;
        } else if (starType < 0.9) {
          // Bright stars - medium rarity
          x = Math.random() * 100;
          y = Math.random() * 100;
          size = Math.random() * 3 + 2;
          opacity = Math.random() * 0.4 + 0.6;
          twinkleSpeed = Math.random() * 2 + 1;
        } else {
          // Very bright stars - rare
          x = Math.random() * 100;
          y = Math.random() * 100;
          size = Math.random() * 2 + 3;
          opacity = Math.random() * 0.3 + 0.7;
          twinkleSpeed = Math.random() * 1.5 + 0.5;
        }

        newStars.push({
          id: i,
          x,
          y,
          size,
          opacity,
          twinkleSpeed,
          moveSpeed: Math.random() * 0.3 + 0.1, // Slower movement for more realistic effect
        });
      }

      setStars(newStars);
    };

    generateStars();
  }, []);

  // Don't render on server
  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 transition-opacity duration-1000 pointer-events-none z-0 ${
        isDarkMode ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #1e3a8a 50%, #312e81 75%, #4c1d95 100%)"
          : "transparent",
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: isDarkMode
            ? "radial-gradient(ellipse at center, transparent 0%, rgba(15, 23, 42, 0.4) 70%, rgba(15, 23, 42, 0.8) 100%)"
            : "transparent",
        }}
      />

      {/* Stars Container */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => {
          // Calculate enhanced glow and twinkle effects
          const glowIntensity = star.size > 2 ? star.size * 3 : star.size * 2;
          const twinkleVariation = `twinkle-${Math.floor(star.twinkleSpeed)}`;

          return (
            <div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animation: isDarkMode
                  ? `enhanced-twinkle ${star.twinkleSpeed}s ease-in-out infinite alternate, gentle-float ${star.moveSpeed * 15}s ease-in-out infinite alternate, pulse ${star.twinkleSpeed * 1.5}s ease-in-out infinite`
                  : "none",
                boxShadow: isDarkMode
                  ? `0 0 ${glowIntensity}px rgba(255, 255, 255, ${star.opacity * 0.8}), 0 0 ${glowIntensity * 2}px rgba(200, 220, 255, ${star.opacity * 0.3}), 0 0 ${glowIntensity * 3}px rgba(150, 180, 255, ${star.opacity * 0.1})`
                  : "none",
                filter: isDarkMode
                  ? `brightness(${1 + star.opacity * 0.5}) saturate(1.2)`
                  : "none",
                transform: typeof window !== 'undefined'
                  ? `scale(${1 + Math.sin(Date.now() * 0.001 * star.twinkleSpeed) * 0.1})`
                  : 'scale(1)',
              }}
            />
          );
        })}
      </div>

      {/* Enhanced Shooting Stars */}
      {isDarkMode && (
        <>
          {/* Multiple shooting stars with different trajectories */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`shooting-star-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-white via-blue-200 to-transparent"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animation: `enhanced-shooting-star ${Math.random() * 3 + 4}s ease-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
                boxShadow:
                  "0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px rgba(200, 220, 255, 0.4)",
              }}
            />
          ))}

          {/* Rare bright shooting stars */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`bright-shooting-star-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-white via-yellow-200 to-transparent"
              style={{
                width: "3px",
                height: "3px",
                top: `${Math.random() * 60 + 20}%`,
                left: `${Math.random() * 60 + 20}%`,
                animation: `bright-shooting-star ${Math.random() * 2 + 6}s ease-out infinite`,
                animationDelay: `${Math.random() * 15}s`,
                boxShadow:
                  "0 0 10px rgba(255, 255, 255, 1), 0 0 20px rgba(255, 220, 100, 0.6), 0 0 30px rgba(255, 200, 50, 0.3)",
              }}
            />
          ))}
        </>
      )}

      {/* Enhanced Nebula Effects */}
      {isDarkMode && (
        <div className="absolute inset-0">
          {/* Main nebula clouds */}
          <div
            className="absolute rounded-full mix-blend-screen opacity-25"
            style={{
              top: "10%",
              left: "20%",
              width: "400px",
              height: "250px",
              background:
                "radial-gradient(ellipse, rgba(76, 29, 149, 0.8) 0%, rgba(99, 102, 241, 0.4) 40%, transparent 70%)",
              animation:
                "enhanced-nebula-drift 25s ease-in-out infinite alternate",
              filter: "blur(2px)",
            }}
          />
          <div
            className="absolute rounded-full mix-blend-screen opacity-20"
            style={{
              top: "60%",
              right: "10%",
              width: "350px",
              height: "220px",
              background:
                "radial-gradient(ellipse, rgba(30, 58, 138, 0.7) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 80%)",
              animation:
                "enhanced-nebula-drift 35s ease-in-out infinite alternate-reverse",
              filter: "blur(3px)",
            }}
          />
          <div
            className="absolute rounded-full mix-blend-screen opacity-15"
            style={{
              bottom: "20%",
              left: "45%",
              width: "500px",
              height: "180px",
              background:
                "radial-gradient(ellipse, rgba(49, 46, 129, 0.6) 0%, rgba(147, 51, 234, 0.2) 60%, transparent 90%)",
              animation:
                "enhanced-nebula-drift 40s ease-in-out infinite alternate",
              filter: "blur(4px)",
            }}
          />

          {/* Additional smaller nebula patches */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`nebula-patch-${i}`}
              className="absolute rounded-full mix-blend-screen"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                width: `${Math.random() * 150 + 100}px`,
                height: `${Math.random() * 100 + 80}px`,
                background: `radial-gradient(ellipse, rgba(${Math.random() * 100 + 50}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 200}, 0.3) 0%, transparent 70%)`,
                animation: `micro-nebula-drift ${Math.random() * 20 + 30}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 10}s`,
                opacity: Math.random() * 0.1 + 0.05,
                filter: "blur(2px)",
              }}
            />
          ))}
        </div>
      )}

      {/* Enhanced Cosmic Dust and Light Trails */}
      {isDarkMode && (
        <div className="absolute inset-0">
          {/* Cosmic dust particles */}
          {Array.from({ length: 80 }).map((_, i) => {
            const size = Math.random() * 3 + 0.5;
            const opacity = Math.random() * 0.15 + 0.05;

            return (
              <div
                key={`dust-${i}`}
                className="absolute rounded-full bg-gradient-to-br from-white via-blue-100 to-purple-100"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity,
                  animation: `enhanced-dust-float ${Math.random() * 15 + 15}s linear infinite`,
                  animationDelay: `${Math.random() * 10}s`,
                  boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.5})`,
                  filter: "blur(0.5px)",
                }}
              />
            );
          })}

          {/* Light trails/rays */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`light-ray-${i}`}
              className="absolute opacity-5"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                width: `${Math.random() * 200 + 100}px`,
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%)",
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `light-ray-pulse ${Math.random() * 8 + 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}

          {/* Distant galaxies (small spiral effects) */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`galaxy-${i}`}
              className="absolute rounded-full opacity-5"
              style={{
                top: `${Math.random() * 60 + 20}%`,
                left: `${Math.random() * 60 + 20}%`,
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 30 + 20}px`,
                background:
                  "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(200, 220, 255, 0.1) 40%, transparent 70%)",
                animation: `galaxy-rotation ${Math.random() * 50 + 100}s linear infinite`,
                animationDelay: `${Math.random() * 20}s`,
                filter: "blur(1px)",
              }}
            />
          ))}
        </div>
      )}

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes enhanced-twinkle {
          0% {
            opacity: 0.3;
            transform: scale(0.8);
            filter: brightness(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
            filter: brightness(1.5);
          }
          100% {
            opacity: 0.6;
            transform: scale(1);
            filter: brightness(1.2);
          }
        }

        @keyframes gentle-float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-5px) translateX(3px) rotate(1deg); }
          50% { transform: translateY(-8px) translateX(6px) rotate(0deg); }
          75% { transform: translateY(-3px) translateX(4px) rotate(-1deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(200, 220, 255, 0.4); }
          100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
        }

        @keyframes enhanced-shooting-star {
          0% {
            transform: translateX(-150px) translateY(-150px) scale(0);
            opacity: 0;
            box-shadow: 0 0 0px rgba(255, 255, 255, 0);
          }
          5% {
            transform: translateX(-120px) translateY(-120px) scale(0.5);
            opacity: 1;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          }
          15% {
            transform: translateX(-80px) translateY(-80px) scale(1);
            opacity: 1;
            box-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 25px rgba(200, 220, 255, 0.6);
          }
          85% {
            transform: translateX(80px) translateY(80px) scale(1);
            opacity: 0.8;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(200, 220, 255, 0.3);
          }
          95% {
            transform: translateX(120px) translateY(120px) scale(0.5);
            opacity: 0.3;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
          }
          100% {
            transform: translateX(150px) translateY(150px) scale(0);
            opacity: 0;
            box-shadow: 0 0 0px rgba(255, 255, 255, 0);
          }
        }

        @keyframes bright-shooting-star {
          0% {
            transform: translateX(-200px) translateY(-200px) scale(0);
            opacity: 0;
          }
          5% {
            transform: translateX(-160px) translateY(-160px) scale(0.8);
            opacity: 1;
          }
          10% {
            transform: translateX(-120px) translateY(-120px) scale(1.2);
            opacity: 1;
          }
          90% {
            transform: translateX(120px) translateY(120px) scale(1.2);
            opacity: 0.9;
          }
          95% {
            transform: translateX(160px) translateY(160px) scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: translateX(200px) translateY(200px) scale(0);
            opacity: 0;
          }
        }

        @keyframes enhanced-nebula-drift {
          0% {
            transform: translateX(-30px) translateY(-15px) scale(0.9) rotate(0deg);
            filter: blur(2px) hue-rotate(0deg);
          }
          25% {
            transform: translateX(15px) translateY(20px) scale(1.1) rotate(90deg);
            filter: blur(3px) hue-rotate(30deg);
          }
          50% {
            transform: translateX(35px) translateY(15px) scale(1.2) rotate(180deg);
            filter: blur(4px) hue-rotate(60deg);
          }
          75% {
            transform: translateX(-5px) translateY(-25px) scale(1) rotate(270deg);
            filter: blur(3px) hue-rotate(30deg);
          }
          100% {
            transform: translateX(-15px) translateY(-8px) scale(0.95) rotate(360deg);
            filter: blur(2px) hue-rotate(0deg);
          }
        }

        @keyframes micro-nebula-drift {
          0% { transform: translateX(-10px) translateY(-5px) scale(1); }
          50% { transform: translateX(10px) translateY(8px) scale(1.1); }
          100% { transform: translateX(-5px) translateY(-3px) scale(0.9); }
        }

        @keyframes enhanced-dust-float {
          0% {
            transform: translateY(100vh) translateX(0) scale(0.5);
            opacity: 0;
          }
          5% {
            opacity: 0.1;
            transform: translateY(95vh) translateX(5px) scale(0.7);
          }
          15% {
            opacity: 0.15;
            transform: translateY(85vh) translateX(15px) scale(1);
          }
          85% {
            opacity: 0.1;
            transform: translateY(15vh) translateX(85px) scale(1);
          }
          95% {
            opacity: 0.05;
            transform: translateY(5vh) translateX(95px) scale(0.7);
          }
          100% {
            transform: translateY(-5vh) translateX(100px) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes light-ray-pulse {
          0% {
            opacity: 0.02;
            transform: scale(1) rotate(var(--rotation, 0deg));
          }
          50% {
            opacity: 0.08;
            transform: scale(1.2) rotate(var(--rotation, 0deg));
          }
          100% {
            opacity: 0.02;
            transform: scale(1) rotate(var(--rotation, 0deg));
          }
        }

        @keyframes galaxy-rotation {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.03;
          }
          50% {
            transform: rotate(180deg) scale(1.1);
            opacity: 0.07;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 0.03;
          }
        }
      `}</style>
    </div>
  );
}
