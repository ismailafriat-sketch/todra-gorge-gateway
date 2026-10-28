export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  price_per_night: number;
  capacity: number;
  size: number;
  beds: string;
  amenities: string[];
  image_url: string;
  gallery_urls: string[];
  featured: boolean;
  is_available: boolean;
}

export interface Excursion {
  id: string;
  title: string;
  description: string;
  price_mad: number;
  duration: string;
  images: string[];
  details: string[];
  is_available: boolean;
  sort_order: number;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  image_url: string;
  caption: string;
  sort_order: number;
}

export interface Booking {
  id: string;
  reference: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  whatsapp: string;
  check_in: string;
  check_out: string;
  nights: number;
  room_selections: { room_id?: string; title: string; qty: number; price: number }[];
  total_mad: number;
  payment_method: string;
  payment_status: string;
  notes: string;
  status: string;
  created_at: string;
}

export interface SiteSettings {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  tripadvisor_url: string;
  booking_url: string;
  intro_text: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}
