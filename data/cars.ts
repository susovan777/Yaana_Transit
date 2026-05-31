export type Car = {
  id: number;
  name: string;
  type: string;
  category: 'hatchback' | 'sedan' | 'suv' | 'luxury';
  seats: number;
  fuel: string;
  transmission: string;
  pricePerDay: number;
  badge?: string;
  image: string;
  description: string;
};

export const cars: Car[] = [
  {
    id: 1,
    name: 'Maruti Shift',
    type: 'Hatchback',
    category: 'hatchback',
    seats: 5,
    fuel: 'petrol',
    transmission: 'Manual',
    pricePerDay: 1200,
    badge: 'Best value',
    image:
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80',
    description:
      'Perfect for city trips. Fuel-efficient and easy to manoeuvre through busy streets.',
  },
  {
    id: 2,

    name: 'Honda City',
    type: 'Sedan',
    category: 'sedan',
    seats: 5,

    fuel: 'Petrol',
    transmission: 'Automatic',

    pricePerDay: 1800,
    badge: 'Popular',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
    description:
      'Comfortable sedan with premium interiors. Ideal for business travel and city commutes.',
  },
  {
    id: 3,
    name: 'Toyota Innova Crysta',
    type: 'Premium MPV',
    category: 'suv',
    seats: 7,

    fuel: 'Diesel',
    transmission: 'Manual',
    pricePerDay: 2800,
    badge: 'Family Favourite',
    image:
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80',
    description:
      "India's most trusted MPV. Spacious, reliable, and perfect for family outstation trips.",
  },
  {
    id: 4,
    name: 'Hyundai Creta',
    type: 'Compact SUV',
    category: 'suv',
    seats: 5,
    fuel: 'Diesel',
    transmission: 'Automatic',
    pricePerDay: 2200,
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80',
    description:
      'Stylish SUV with great road presence. Comfortable for both city and highway driving.',
  },
  {
    id: 5,
    name: 'Mercedes E-Class',
    type: 'Luxury Sedan',
    category: 'luxury',
    seats: 4,

    fuel: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 6500,
    badge: 'Premium',
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80',
    description:
      'The pinnacle of automotive luxury. For executives, weddings, and high-profile events.',
  },
  {
    id: 6,
    name: 'Toyota Fortuner',
    type: 'Full-size SUV',
    category: 'suv',
    seats: 7,
    fuel: 'Diesel',
    transmission: 'Automatic',
    pricePerDay: 3500,
    image:
      'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=600&q=80',
    description:
      'The king of Indian roads. Powerful, spacious and commanding on any terrain.',
  },
  {
    id: 7,

    name: 'Tata Nexon',
    type: 'Compact SUV',
    category: 'suv',
    seats: 5,
    fuel: 'Petrol',
    transmission: 'Manual',

    pricePerDay: 1600,
    image:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80',
    description:
      '5-star safety rated and feature-packed. Great value compact SUV for all trips.',
  },
  {
    id: 8,
    name: 'BMW 5 Series',
    type: 'Luxury Sedan',
    category: 'luxury',
    seats: 4,

    fuel: 'Petrol',
    transmission: 'Automatic',
    pricePerDay: 8000,
    badge: 'Signature',
    image:
      'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=600&q=80',
    description:
      'The ultimate driving machine. Unmatched performance and prestige for every occasion.',
  },
];
