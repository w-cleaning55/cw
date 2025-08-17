/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Simplified webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Basic fallbacks
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      net: false,
      tls: false,
      firebase: false,
      'firebase/app': false,
      'firebase/firestore': false,
      mongodb: false,
      '@supabase/supabase-js': false,
      'serverless-http': false,
      cors: false,
      '@testing-library/react': false,
      '@testing-library/user-event': false,
      '@vitejs/plugin-react': false,
      openai: false,
      '@google/generative-ai': false,
    };

    // Development optimizations
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.next', '**/dist'],
      };
    }

    return config;
  },

  // Basic headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: "cleaning-world-app",
  },
};

export default nextConfig;
