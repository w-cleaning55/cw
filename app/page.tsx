import React from "react";
import type { Metadata } from "next";
import HomeClient from "@/components/pages/HomeClient";
import { DEFAULT_SEO, generateCleaningServiceStructuredData, generateFAQStructuredData } from "@/lib/seo";

export const metadata: Metadata = {
  title: DEFAULT_SEO.title,
  description: DEFAULT_SEO.description,
  openGraph: {
    title: DEFAULT_SEO.openGraph?.title || DEFAULT_SEO.title,
    description: DEFAULT_SEO.openGraph?.description || DEFAULT_SEO.description,
    url: DEFAULT_SEO.openGraph?.url,
    images: DEFAULT_SEO.openGraph?.image ? [{ url: DEFAULT_SEO.openGraph.image }] : undefined,
    type: "website",
  },
  twitter: {
    card: DEFAULT_SEO.twitter?.card as any,
    site: DEFAULT_SEO.twitter?.site,
    creator: DEFAULT_SEO.twitter?.creator,
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
  },
  alternates: {
    canonical: "https://m-clean.net",
  },
};

export default function Page() {
  const business = generateCleaningServiceStructuredData();
  const faq = generateFAQStructuredData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <HomeClient />
    </>
  );
}
