import type { Metadata, Viewport } from "next";
import { Inter, Tajawal } from "next/font/google";
import "./globals.css";
import ClientProviders from "../components/ClientProviders";
import { ThemeProvider } from "../hooks/useTheme";
import PerformanceOptimizer from "../components/PerformanceOptimizer";
import { SEO_CONFIG, APP_CONFIG } from "../lib/constants";
import { generateCleaningServiceStructuredData } from "../lib/seo";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: SEO_CONFIG.defaultTitle,
  description: SEO_CONFIG.description,
  keywords: [...SEO_CONFIG.keywords],
  authors: [{ name: APP_CONFIG.name, url: APP_CONFIG.domain }],
  creator: APP_CONFIG.name,
  publisher: APP_CONFIG.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(APP_CONFIG.domain),
  alternates: {
    canonical: "/",
    languages: {
      "ar-SA": "/ar",
      "en-US": "/en",
    },
  },
  openGraph: {
    ...SEO_CONFIG.openGraph,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.description,
  },
  twitter: {
    ...SEO_CONFIG.twitter,
    title: SEO_CONFIG.defaultTitle,
    description: SEO_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification",
    yandex: "your-yandex-verification",
    yahoo: "your-yahoo-verification",
  },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${inter.variable} ${tajawal.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_CONFIG.name} />
        <meta name="application-name" content={APP_CONFIG.name} />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${inter.className} ${tajawal.className} font-sans antialiased min-h-screen transition-colors duration-300`}
        suppressHydrationWarning={true}
      >
        <PerformanceOptimizer>
          <ThemeProvider>
            <ClientProviders>{children}</ClientProviders>
          </ThemeProvider>
        </PerformanceOptimizer>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateCleaningServiceStructuredData()),
          }}
        />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
