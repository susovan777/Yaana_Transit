// Path: lib\fleet.ts

// ─────────────────────────────────────────
// FLEET DATA — Yana Transite
// Add your cars here. Images go in:
// /public/images/cars/<id>.jpg
// ─────────────────────────────────────────

export type CarCategory = 'economy' | 'sedan' | 'suv' | 'luxury';

export type BadgeStyle = 'blue' | 'navy' | 'green';

export type Car = {
  id: string;
  name: string;
  category: CarCategory;
  typeLabel: string;
  seats: number;
  transmission: string;
  pricePerDay: number;
  badge?: string;
  badgeStyle?: BadgeStyle;
};

export const FLEET: Car[] = [
  {
    id: 'maruti-swift',
    name: 'Maruti Swift',
    category: 'economy',
    typeLabel: 'Hatchback · Economy',
    seats: 4,
    transmission: 'Manual / Auto',
    pricePerDay: 1200,
    badge: 'Best Value',
    badgeStyle: 'blue',
  },
  {
    id: 'honda-city',
    name: 'Honda City',
    category: 'sedan',
    typeLabel: 'Sedan · Mid-Range',
    seats: 5,
    transmission: 'Automatic',
    pricePerDay: 2100,
    badge: 'Popular',
    badgeStyle: 'navy',
  },
  {
    id: 'innova-crysta',
    name: 'Innova Crysta',
    category: 'suv',
    typeLabel: 'MPV · 7-Seater',
    seats: 7,
    transmission: 'Automatic',
    pricePerDay: 3500,
    badge: 'Family Fav',
    badgeStyle: 'green',
  },
  {
    id: 'toyota-fortuner',
    name: 'Toyota Fortuner',
    category: 'suv',
    typeLabel: 'SUV · Full-Size',
    seats: 7,
    transmission: 'Automatic',
    pricePerDay: 5500,
    badge: 'Premium',
    badgeStyle: 'navy',
  },
  {
    id: 'mercedes-e-class',
    name: 'Mercedes E-Class',
    category: 'luxury',
    typeLabel: 'Luxury · Executive',
    seats: 4,
    transmission: 'Automatic',
    pricePerDay: 9500,
    badge: 'Luxury',
    badgeStyle: 'blue',
  },
  {
    id: 'dzire-tour',
    name: 'Maruti Dzire',
    category: 'sedan',
    typeLabel: 'Sedan · Economy',
    seats: 4,
    transmission: 'Manual / Auto',
    pricePerDay: 1500,
  },
];
