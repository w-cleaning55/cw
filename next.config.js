/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // optimizeCss: true, // Temporarily disabled - requires critters package
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Allow iframe embedding and fix headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
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

  // السماح بالـ origins المسموحة
  allowedDevOrigins: [
    "first-advancement.name",
    "6ae19b7dd61d460c809607ef9d750ad1-a891f081bb364a1a99d890ded.fly.dev",
    "localhost:3000",
    "127.0.0.1:3000",
  ],

  // تحسين الصور
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },

  // تحسين الـ Webpack
  webpack: (config, { dev, isServer }) => {
    // تحسين bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
          },
        },
      };
    }

    return config;
  },

  // تحسين الأداء
  poweredByHeader: false,
  compress: true,

  // Environment variables
  env: {
    CUSTOM_KEY: "cleaning-world-app",
  },

  // تحسين الأداء إضافي
  productionBrowserSourceMaps: false,
};

export default nextConfig;
