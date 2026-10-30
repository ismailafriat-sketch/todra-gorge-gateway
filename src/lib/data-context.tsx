import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "../integrations/supabase/client";
import { images } from "./images";
import type {
  Room,
  Excursion,
  GalleryPhoto,
  SiteSettings,
  Booking,
  ContactMessage,
} from "../types";

// ============ Single source of truth for all site data ============
// Public pages AND the admin portal read from this context.
// Initial load comes from the database, then a Supabase Realtime
// subscription keeps every connected page in sync: when the admin
// edits a room, gallery photo or setting, the public site updates
// instantly without a refresh.

const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp: "+212661267213",
  phone: "+212524895666",
  email: "contact@aubergelefestival.com",
  address: "Gorges du Todra, Tinghir, Maroc",
  instagram_url: "",
  facebook_url: "",
  tripadvisor_url: "",
  booking_url: "",
  intro_text: "",
};

// Shown only if the database has no rooms yet.
const fallbackRooms: Room[] = [
  {
    id: "1",
    name: "Chambre Standard",
    slug: "chambre-standard",
    description: "Une chambre confortable avec vue sur la palmeraie, idéale pour les voyageurs.",
    long_description:
      "Notre chambre standard offre tout le confort nécessaire pour un séjour reposant. Avec ses murs en terre crue, ses tapis berbères et sa fenêtre ouverte sur la palmeraie, elle incarne l'authenticité de l'architecture marocaine. Climatisée et équipée d'une salle de bain privative.",
    price_per_night: 350,
    capacity: 2,
    size: 18,
    beds: "1 lit double",
    amenities: ["Climatisation", "Salle de bain privée", "Wi-Fi", "Vue palmeraie"],
    image_url: images.roomStandard,
    gallery_urls: [images.roomStandard, images.roomStandard2],
    featured: true,
    is_available: true,
  },
  {
    id: "2",
    name: "Chambre Deluxe",
    slug: "chambre-deluxe",
    description: "Plus spacieuse, avec un coin salon et une terrasse privée face aux falaises.",
    long_description:
      "La chambre deluxe propose un espace généreux avec un coin salon traditionnel, des draps en coton bio et une terrasse privée d'où vous admirerez les falaises du Todra au lever du soleil. La salle de bain en tadelakt apporte une touche d'élégance naturelle.",
    price_per_night: 550,
    capacity: 3,
    size: 28,
    beds: "1 lit double + 1 canapé-lit",
    amenities: ["Climatisation", "Salle de bain en tadelakt", "Terrasse privée", "Wi-Fi", "Vue falaises", "Coin salon"],
    image_url: images.roomDeluxe,
    gallery_urls: [images.roomDeluxe, images.roomDeluxe2],
    featured: true,
    is_available: true,
  },
  {
    id: "3",
    name: "Suite Berbère",
    slug: "suite-berbere",
    description: "Notre plus belle chambre, avec terrasse panoramique et décor traditionnel.",
    long_description:
      "La Suite Berbère est notre joie. Un espace de 40 m² au décor soigné, mêlant artisanat local et confort moderne. La terrasse panoramique offre une vue imprenable sur les gorges et la palmeraie. Parfaite pour un séjour romantique ou une escapade en famille.",
    price_per_night: 850,
    capacity: 4,
    size: 40,
    beds: "1 lit double + 2 lits simples",
    amenities: ["Climatisation", "Salle de bain en tadelakt", "Terrasse panoramique", "Wi-Fi", "Vue gorges", "Coin salon", "Petit-déjeuner inclus"],
    image_url: images.roomSuite,
    gallery_urls: [images.roomSuite, images.roomSuite2],
    featured: true,
    is_available: true,
  },
];

// Shown only if the database has no gallery photos yet.
const fallbackGallery: GalleryPhoto[] = [
  { id: "1", title: "Gorges du Todra", category: "Paysages", image_url: images.gallery1, caption: "Les falaises spectaculaires du Todra", sort_order: 1 },
  { id: "2", title: "Falaises", category: "Paysages", image_url: images.gallery2, caption: "Parois de 300 mètres de hauteur", sort_order: 2 },
  { id: "3", title: "Dunes du désert", category: "Paysages", image_url: images.gallery3, caption: "Le Sahara à quelques heures de l'auberge", sort_order: 3 },
  { id: "4", title: "Rivière du Todra", category: "Paysages", image_url: images.gallery4, caption: "L'eau qui traverse la gorge", sort_order: 4 },
  { id: "5", title: "Palmeraie", category: "Paysages", image_url: images.gallery5, caption: "La palmeraie de Tinghir", sort_order: 5 },
  { id: "6", title: "Chambre Standard", category: "Chambres", image_url: images.gallery6, caption: "Confort et authenticité", sort_order: 6 },
  { id: "7", title: "Chambre Deluxe", category: "Chambres", image_url: images.gallery7, caption: "Espace et élégance", sort_order: 7 },
  { id: "8", title: "Suite Berbère", category: "Chambres", image_url: images.gallery8, caption: "Notre plus belle chambre", sort_order: 8 },
  { id: "9", title: "Terrasse", category: "La maison", image_url: images.gallery9, caption: "Vue panoramique", sort_order: 9 },
  { id: "10", title: "Salon traditionnel", category: "La maison", image_url: images.gallery10, caption: "Coin salon berbère", sort_order: 10 },
  { id: "11", title: "Décor marocain", category: "La maison", image_url: images.gallery11, caption: "Artisanat local", sort_order: 11 },
  { id: "12", title: "Kasbah", category: "Paysages", image_url: images.gallery12, caption: "Architecture de terre crue", sort_order: 12 },
];

// Map database rows onto the shapes the public pages render.
function mapRoom(row: any): Room {
  const imgs: string[] = Array.isArray(row.images) ? row.images : [];
  return {
    id: row.id,
    name: row.title,
    slug: row.slug || String(row.title).toLowerCase().replace(/\s+/g, "-"),
    description: row.description || "",
    long_description: row.long_description || row.description || "",
    price_per_night: row.price_mad ?? 0,
    capacity: row.capacity ?? 2,
    size: row.size ?? 0,
    beds: row.beds || "",
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    image_url: imgs[0] || images.roomStandard,
    gallery_urls: imgs.length ? imgs : [images.roomStandard],
    featured: row.featured ?? true,
    is_available: row.is_available ?? true,
  };
}

function mapExcursion(row: any): Excursion {
  return {
    id: row.id,
    title: row.title,
    description: row.description || "",
    price_mad: row.price_mad ?? 0,
    duration: row.duration || "",
    images: Array.isArray(row.images) ? row.images : [],
    details: Array.isArray(row.details) ? row.details : [],
    is_available: row.is_available ?? true,
    sort_order: row.sort_order ?? 0,
  };
}

function mapGallery(row: any): GalleryPhoto {
  return {
    id: row.id,
    title: row.title,
    category: row.category || "La maison",
    image_url: row.image_url,
    caption: row.caption || "",
    sort_order: row.sort_order ?? 0,
  };
}

function mapBooking(row: any): Booking {
  return {
    id: row.id,
    reference: row.reference || "",
    guest_name: row.guest_name,
    guest_email: row.guest_email,
    guest_phone: row.guest_phone || "",
    whatsapp: row.whatsapp || "",
    check_in: row.check_in,
    check_out: row.check_out,
    nights: row.nights ?? 1,
    room_selections: Array.isArray(row.room_selections) ? row.room_selections : [],
    total_mad: row.total_mad ?? 0,
    payment_method: row.payment_method || "",
    payment_status: row.payment_status || "",
    notes: row.notes || "",
    status: row.status || "new",
    created_at: row.created_at,
  };
}

type TableKey =
  | "rooms"
  | "excursions"
  | "gallery_photos"
  | "site_settings"
  | "bookings"
  | "contact_messages";

interface DataContextValue {
  rooms: Room[];
  excursions: Excursion[];
  galleryPhotos: GalleryPhoto[];
  siteSettings: SiteSettings;
  bookings: Booking[];
  contactMessages: ContactMessage[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

const PUBLIC_TABLES: TableKey[] = [
  "rooms",
  "excursions",
  "gallery_photos",
  "site_settings",
];

const ALL_TABLES: TableKey[] = [
  ...PUBLIC_TABLES,
  "bookings",
  "contact_messages",
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(fallbackGallery);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async (table: TableKey) => {
    // Private tables are only readable with an admin session.
    if (table === "bookings" || table === "contact_messages") {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) return;
    }

    if (table === "rooms") {
      const { data } = await supabase.from("rooms").select("*").order("sort_order");
      const mapped = (data || []).map(mapRoom);
      if (mapped.length) setRooms(mapped);
    } else if (table === "excursions") {
      const { data } = await supabase.from("excursions").select("*").order("sort_order");
      setExcursions((data || []).map(mapExcursion));
    } else if (table === "gallery_photos") {
      const { data } = await supabase.from("gallery_photos").select("*").order("sort_order");
      const mapped = (data || []).map(mapGallery);
      if (mapped.length) setGalleryPhotos(mapped);
    } else if (table === "site_settings") {
      const { data } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (data) setSiteSettings({ ...DEFAULT_SETTINGS, ...data } as SiteSettings);
    } else if (table === "bookings") {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      setBookings((data || []).map(mapBooking));
    } else if (table === "contact_messages") {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      setContactMessages((data || []) as ContactMessage[]);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all(ALL_TABLES.map((t) => reload(t)));
  }, [reload]);

  // Initial load from the database.
  useEffect(() => {
    let mounted = true;
    (async () => {
      await refresh();
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refresh]);

  // Live sync: any admin edit in the database updates every open page.
  useEffect(() => {
    const channel = supabase.channel("db-changes");
    ALL_TABLES.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          reload(table);
        },
      );
    });
    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [reload]);

  return (
    <DataContext.Provider
      value={{
        rooms,
        excursions,
        galleryPhotos,
        siteSettings,
        bookings,
        contactMessages,
        loading,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}

export function whatsappHref(
  number: string,
  msg = "Bonjour, je souhaite réserver à l'Auberge Le Festival.",
) {
  const clean = (number || "").replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
}
