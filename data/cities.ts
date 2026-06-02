// Path: data\cities.ts

export type City = {
  name: string;
  slug: string;
  emoji: string;
  state: string;
  carsAvailable: number;
  heroImage: string;
  popularRoutes: string[];
  phone: string;
};

export const cities: City[] = [
  {
    name: 'Mumbai',
    slug: 'mumbai',
    emoji: '🌆',
    state: 'Maharashtra',
    carsAvailable: 20,
    heroImage: '',
    popularRoutes: ['Mumbai → Pune', 'Mumbai → Goa', 'Mumbai → Nashik'],
    phone: '+91 98765 43210',
  },
  {
    name: 'Delhi',
    slug: 'delhi',
    emoji: '🏛️',
    state: 'Delhi NCR',
    carsAvailable: 25,
    heroImage: '',
    popularRoutes: ['Delhi → Agra', 'Delhi → Jaipur', 'Delhi → Chandigarh'],
    phone: '+91 98765 43211',
  },
  {
    name: 'Bangalore',
    slug: 'bangalore',
    emoji: '🌿',
    state: 'Karnataka',
    carsAvailable: 18,
    heroImage: '',
    popularRoutes: [
      'Bangalore → Mysore',
      'Bangalore → Coorg',
      'Bangalore → Ooty',
    ],
    phone: '+91 98765 43212',
  },
  {
    name: 'Chennai',
    slug: 'chennai',
    emoji: '🌊',
    state: 'Tamil Nadu',
    carsAvailable: 12,
    heroImage: '',
    popularRoutes: [
      'Chennai → Pondicherry',
      'Chennai → Mahabalipuram',
      'Chennai → Vellore',
    ],
    phone: '+91 98765 43213',
  },
  {
    name: 'Hyderabad',
    slug: 'hyderabad',
    emoji: '🕌',
    state: 'Telangana',
    carsAvailable: 15,
    heroImage: '',
    popularRoutes: ['Hyderabad → Warangal', 'Hyderabad → Nagarjunasagar'],
    phone: '+91 98765 43214',
  },
  {
    name: 'Pune',
    slug: 'pune',
    emoji: '🌸',
    state: 'Maharashtra',
    carsAvailable: 10,
    heroImage: '',
    popularRoutes: ['Pune → Mumbai', 'Pune → Lonavala', 'Pune → Mahabaleshwar'],
    phone: '+91 98765 43215',
  },
  {
    name: 'Jaipur',
    slug: 'jaipur',
    emoji: '🏰',
    state: 'Rajasthan',
    carsAvailable: 8,
    heroImage: '',
    popularRoutes: ['Jaipur → Agra', 'Jaipur → Jodhpur', 'Jaipur → Udaipur'],
    phone: '+91 98765 43216',
  },
  {
    name: 'Goa',
    slug: 'goa',
    emoji: '🏖️',
    state: 'Goa',
    carsAvailable: 6,
    heroImage: '',
    popularRoutes: ['North Goa → South Goa', 'Goa → Hampi'],
    phone: '+91 98765 43217',
  },
  {
    name: 'Kolkata',
    slug: 'kolkata',
    emoji: '🎭',
    state: 'West Bengal',
    carsAvailable: 8,
    heroImage: '',
    popularRoutes: [
      'Kolkata → Digha',
      'Kolkata → Shantiniketan',
      'Kolkata → Siliguri',
    ],
    phone: '+91 98765 43218',
  },
  {
    name: 'Ahmedabad',
    slug: 'ahmedabad',
    emoji: '🎡',
    state: 'Gujarat',
    carsAvailable: 7,
    heroImage: '',
    popularRoutes: [
      'Ahmedabad → Surat',
      'Ahmedabad → Vadodara',
      'Ahmedabad → Rann of Kutch',
    ],
    phone: '+91 98765 43219',
  },
];
