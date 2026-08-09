// Path: apps\web\lib\data\fleet.ts

// ─────────────────────────────────────────
// FLEET DATA — YAANA Transit
// Add your cars here. Images go in:
// /public/images/cars/<id>.jpg
// All white-coloured vehicles only.
// No pricing displayed (B2B corporate only).
// ─────────────────────────────────────────

export type CarCategory =
  | 'sedan'
  | 'muv'
  | 'suv'
  | 'premium-suv'
  | 'premium'
  | 'luxury'
  | 'traveller';

export type BadgeStyle = 'blue' | 'navy' | 'green';

export type Car = {
  id: string;
  name: string;
  category: CarCategory;
  typeLabel: string;
  seats: number;
  transmission: string;
  badge?: string;
  badgeStyle?: BadgeStyle;
};

export const FLEET: Car[] = [
  // ── SEDAN ──
  {
    id: 'maruti-dzire',
    name: 'Maruti Suzuki Dzire',
    category: 'sedan',
    typeLabel: 'Sedan',
    seats: 4,
    transmission: 'Manual / Automatic',
    badge: 'Sedan',
    badgeStyle: 'blue',
  },

  // ── MUV ──
  {
    id: 'maruti-ertiga',
    name: 'Maruti Suzuki Ertiga',
    category: 'muv',
    typeLabel: 'MUV · 7-Seater',
    seats: 7,
    transmission: 'Manual / Automatic',
    badge: 'MUV',
    badgeStyle: 'blue',
  },
  {
    id: 'toyota-rumion',
    name: 'Toyota Rumion',
    category: 'muv',
    typeLabel: 'MUV · 7-Seater',
    seats: 7,
    transmission: 'Automatic',
    badge: 'MUV',
    badgeStyle: 'blue',
  },

  // ── SUV ──
  {
    id: 'innova-crysta',
    name: 'Toyota Innova Crysta',
    category: 'suv',
    typeLabel: 'SUV · 7-Seater',
    seats: 7,
    transmission: 'Automatic',
    badge: 'SUV',
    badgeStyle: 'navy',
  },

  // ── PREMIUM SUV ──
  {
    id: 'innova-hycross',
    name: 'Toyota Innova HyCross',
    category: 'premium-suv',
    typeLabel: 'Premium SUV · Hybrid',
    seats: 7,
    transmission: 'e-CVT (Hybrid)',
    badge: 'Premium SUV',
    badgeStyle: 'navy',
  },

  // ── PREMIUM ──
  {
    id: 'kia-carnival',
    name: 'Kia Carnival',
    category: 'premium',
    typeLabel: 'Premium · 8-Seater',
    seats: 8,
    transmission: 'Automatic',
    badge: 'Premium',
    badgeStyle: 'green',
  },

  // ── LUXURY ──
  {
    id: 'mercedes-e-class',
    name: 'Mercedes-Benz E-Class',
    category: 'luxury',
    typeLabel: 'Luxury · Executive Sedan',
    seats: 4,
    transmission: 'Automatic',
    badge: 'Luxury',
    badgeStyle: 'blue',
  },
  {
    id: 'bmw-5-series',
    name: 'BMW 5 Series',
    category: 'luxury',
    typeLabel: 'Luxury · Executive Sedan',
    seats: 4,
    transmission: 'Automatic',
    badge: 'Luxury',
    badgeStyle: 'blue',
  },
  
  // ── TRAVELLER / VAN ──
  {
    id: 'force-urbania',
    name: 'Force Urbania',
    category: 'traveller',
    typeLabel: 'Executive Van · 16-Seater',
    seats: 16,
    transmission: 'Manual',
    badge: 'Executive Van',
    badgeStyle: 'navy',
  },
];

export type FleetCategory = {
  value: CarCategory | 'all';
  label: string;
};

export const FLEET_CATEGORIES: FleetCategory[] = [
  { value: 'all', label: 'All Vehicles' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'muv', label: 'MUV' },
  { value: 'suv', label: 'SUV' },
  { value: 'premium-suv', label: 'Premium SUV' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'traveller', label: 'Traveller' },
];

export function filterFleet(category: CarCategory | 'all'): Car[] {
  if (category === 'all') return FLEET;
  return FLEET.filter((c) => c.category === category);
}