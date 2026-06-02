// Path: lib\seo.ts

import type { Metadata } from 'next';

const siteUrl = 'https://yanatransit.co.in';
const siteName = 'Yana Transit';
const defaultDescription =
  "India's trusted car rental service. Chauffeur-driven, self-drive, airport transfers and outstation trips across 20+ cities.";

export function generateMetadata(params: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const url = `${siteUrl}${params.path ?? ''}`;
  return {
    title: `${params.title} — ${siteName}`,
    description: params.description ?? defaultDescription,
    openGraph: {
      title: `${params.title} — ${siteName}`,
      description: params.description ?? defaultDescription,
      url,
      siteName,
      type: 'website',
    },
    alternates: { canonical: url },
  };
}
