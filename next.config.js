/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Allow Builder.io cross-origin requests
  allowedDevOrigins: [
    "5968d79e40fa414b92f4d6f4055d93ed-22bd19dd88ee46419b6784aea.fly.dev",
    "builder.io",
    "*.builder.io",
  ],

  // Webpack configuration - simplified to prevent chunk loading issues
  webpack: (config, { dev, isServer }) => {
    // Basic fallbacks only
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false,
    };

    // Fix chunk loading issues
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: "all",
              name: "framework",
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
      };
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
