// Path: data\services.ts

export type Service = {
  id: number;
  icon: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  priceFrom: string;
  tags: string[];
};

export const services: Service[] = [
  {
    id: 1,
    icon: '🎩',
    name: 'Chauffeur-driven',
    slug: 'chauffeur-driven',
    description:
      'Professional, uniformed drivers for business travel, events, or leisure.',
    longDescription:
      'Our chauffeur service pairs you with a trained, background-verified driver who knows the city inside out. Available for hourly, half-day, and full-day bookings across all our cities. Your comfort and punctuality are our top priorities.',
    priceFrom: '₹1,800/day',
    tags: ['Business', 'Events', 'Leisure', 'Corporate'],
  },

  {
    id: 2,
    icon: '🔑',
    name: 'Self-drive',
    slug: 'self-drive',
    description:
      'Take the wheel yourself with flexible plans and comprehensive insurance.',
    longDescription:
      'Freedom to explore at your own pace. Our self-drive fleet is fully insured, GPS-equipped, and immaculately maintained. Choose from daily, weekly, or monthly rental plans. Valid driving licence required.',
    priceFrom: '₹1,200/day',
    tags: ['Flexible', 'Weekend', 'Getaway', 'Daily'],
  },
  {
    id: 3,
    icon: 'X',
    name: 'Airport Transfers',
    slug: 'airport-transfers',
    description:
      'Reliable, flight-tracked pickups and drops to all major airports.',
    longDescription:
      'Never miss a flight again. We track your flight in real time and adjust pickup time automatically. Our drivers arrive 15 minutes early, hold a name placard, and assist with luggage. Available 24/7, 365 days.',
    priceFrom: '₹800/trip',
    tags: ['Airport', 'On-time', '24/7', 'All Airports'],
  },
  {
    id: 4,
    icon: '🗺️',
    name: 'Outstation Trips',
    slug: 'outstation-trips',
    description:
      'Multi-day road trips anywhere in India with experienced outstation drivers.',
    longDescription:
      'From a weekend in the hills to a cross-country road trip, our outstation service covers it all. We provide experienced drivers who know inter-state routes, handle tolls, and ensure your journey is smooth and safe.',
    priceFrom: '₹2,500/day',
    tags: ['Road Trip', 'Multi-day', 'Pan India', 'Hills'],
  },
  {
    id: 5,
    icon: '@',
    name: 'Corporate Rentals',
    slug: 'corporate-rentals',
    description:
      'Monthly or annual fleet arrangements with a dedicated account manager.',
    longDescription:
      "Streamline your company's travel needs with our corporate plans. Get a dedicated account manager, consolidated monthly invoicing, GST-compliant receipts, and priority booking. Trusted by 200+ companies.",
    priceFrom: 'Custom',
    tags: ['B2B', 'Monthly', 'Priority', 'GST Invoice'],
  },
  {
    id: 6,
    icon: '🎊',
    name: 'Event Transport',
    slug: 'event-transport',
    description:
      'Coordinated multi-vehicle bookings for weddings, conferences, and group outings.',
    longDescription:
      'From intimate gatherings to large-scale conferences, we coordinate multi-vehicle logistics seamlessly. Decorated cars for weddings, shuttle services for conferences, and group outings managed with a single point of contact.',
    priceFrom: '₹2,000/vehicle',
    tags: ['Weddings', 'Groups', 'Events', 'Conferences'],
  },
];
