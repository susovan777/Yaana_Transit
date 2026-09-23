// Path: apps/web/app/sitemap.ts

import { MetadataRoute } from 'next';

const BASE_URL = 'https://yaanatransit.com';

// Last meaningful content update date
const LAST_UPDATED = '2026-09-23';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core pages ──────────────────────────────────────────────────
    {
      url: BASE_URL,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 1.0, // highest — this is the homepage
    },
    {
      url: `${BASE_URL}/fleet`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly', // update when vehicles change
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cities`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/why`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly', // rarely changes
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.7,
    },

    // ── Legal & support pages ────────────────────────────────────────
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/common-questions`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
