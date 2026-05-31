// Path: data\testimonials.ts

export type Testimonials = {
  id: number;
  text: string;
  author: string;
  location: string;
  initials: string;
  rating: number;
  service: string;
};

export const testimonials: Testimonials[] = [
  {
    id: 1,
    text: 'Booked an Innova Crysta for our family trip from Mumbai to Goa. The driver was professional, the car spotless. WhatsApp booking took under 2 minutes.',
    author: 'Priya Mehta',
    location: 'Mumbai',
    initials: 'PM',
    rating: 5,
    service: 'Outstation Trip',
  },
  {
    id: 2,
    text: 'Used Yana Transit for our corporate team offsite. Coordinated 4 vehicles seamlessly. The account manager was on call throughout. Exceptional service.',
    author: 'Arjun Kapoor',
    location: 'Bangalore',
    initials: 'AK',
    rating: 5,
    service: 'Corporate Rental',
  },
  {
    id: 3,
    text: 'Airport transfers to Jaipur every month. Never once been late. The drivers know the routes, keep the car clean, and are always courteous. 10/10.',
    author: 'Sneha Reddy',
    location: 'Delhi',
    initials: 'SR',
    rating: 5,
    service: 'Airport Transfer',
  },
];
