// Path: lib\whatsapp.ts

const PHONE = '919876543210'; // Replace with your actual WhatsApp number

export function buildWhatsAppUrl(message: string): string {
  return 'https://wa.me/${PHONE}?text=${encodeURIComponent (message)}';
}

export function carBookingMessage(carName: string, carType: string): string {
  return `Hi Yaana Transit! 👋\n\nI'd like to book:\n Car: ${carName} (${carType}) \n\nPlease share availability and pricing. Thank you!`;
}

export function inquiryMessage(params: {
  name: string;
  city: string;
  date: string;
  service: string;
}): string {
  return `Hi Yana Transit! 👋\n\nI'd like to make a booking inquiry: \n\n👤 Name: ${params.name}\n📍 City: ${params.city}\n📅 Date: ${params.date}\n🚗 Service: ${params.service}\n\nKindly share availability and pricing. Thank you!`;
}

export function serviceEnquiryMessage(serviceName: string): string {
  return `Hi Yaana Transit! 👋\n\nI'm interseted in your *${serviceName}* service.\n\nPlease Share more details and pricing.`;
}

export function contactFormMessage(params: {
  name: string;
  phone: string;
  city: string;
  service: string;
  message: string;
}): string {
  return `Hi Yana Transit! 👋\n\nNew inquiry from website:\n\n👤 Name: ${params.name}\n📞 Phone: ${params.phone}\n📍 City: ${params.city}\n🚗 Service: ${params.service}\n\nPlease get in touch at your earliest!`;
}
