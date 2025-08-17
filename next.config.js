/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features
  experimental: {
    webpackBuildWorker: false, // Disable for faster dev builds
    optimizePackageImports: ["lucide-react"],
  },

  // Allow Builder.io cross-origin requests
  allowedDevOrigins: [
    "5968d79e40fa414b92f4d6f4055d93ed-22bd19dd88ee46419b6784aea.fly.dev",
    "5968d79e40fa414b92f4d6f4055d93ed-22bd19dd88ee46419b6784aea.projects.builder.codes",
    "builder.io",
    "*.builder.io",
    "*.builder.codes",
  ],

  // Webpack configuration - optimized for development speed
  webpack: (config, { dev, isServer }) => {
    // Basic fallbacks only
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false,
    };

    // Disable webpack build worker in development for faster compilation
    if (dev) {
      config.cache = false;
    }

    return config;
  },

  // Image optimization
  images: {
    domains: ["localhost", "cdn.builder.io"],
    formats: ["image/webp", "image/avif"],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
