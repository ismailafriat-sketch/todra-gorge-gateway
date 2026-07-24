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
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  image_url: string;
  caption: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  room_id: string | null;
  message: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}
