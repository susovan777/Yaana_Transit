// Path: data\cities.ts

// ─────────────────────────────────────────
// CITIES DATA — Yana Transite
//
// City photos go in /public/images/cities/
// named exactly as <id>.jpg
// e.g. /public/images/cities/mumbai.jpg
//
// gradient is shown as fallback if no photo.
// ─────────────────────────────────────────

export type City = {
  id: string;
  name: string;
  state: string;
  carCount: string;
  gradient: string; // CSS fallback gradient
};

export const CITIES: City[] = [
  // ─ index 0 — large card (col-span-2, row-span-2)
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    carCount: '18+ Cars',
    gradient: 'linear-gradient(145deg, #1e3a1a, #122510)',
  },
  // ─ index 1-6 — regular 1×1 cards
  {
    id: 'new-delhi',
    name: 'New Delhi',
    state: 'National Capital',
    carCount: '15+ Cars',
    gradient: 'linear-gradient(145deg, #2a1a4e, #1a0f34)',
  },
  {
    id: 'goa',
    name: 'Goa',
    state: 'Coastal Paradise',
    carCount: '12+ Cars',
    gradient: 'linear-gradient(145deg, #1a4a3e, #0f2e26)',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    carCount: '10+ Cars',
    gradient: 'linear-gradient(145deg, #5c2e0e, #3a1c08)',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    carCount: '20+ Cars Available',
    gradient: 'linear-gradient(145deg, #1a3a6e, #0d2a52)',
  },
  // {
  //   id: 'hyderabad',
  //   name: 'Hyderabad',
  //   state: 'Telangana',
  //   carCount: '14+ Cars',
  //   gradient: 'linear-gradient(145deg, #3a2010, #261508)',
  // },
  // {
  //   id: 'chennai',
  //   name: 'Chennai',
  //   state: 'Tamil Nadu',
  //   carCount: '10+ Cars',
  //   gradient: 'linear-gradient(145deg, #0f3048, #081e30)',
  // },
];
