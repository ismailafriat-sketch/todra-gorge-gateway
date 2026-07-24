import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Maximize, BedDouble, Check, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Room } from "../types";
import { images } from "../lib/images";

const fallbackRooms: Room[] = [
  {
    id: "1",
    name: "Chambre Standard",
    slug: "chambre-standard",
    description: "Une chambre confortable avec vue sur la palmeraie, idéale pour les voyageurs.",
    long_description:
      "Notre chambre standard offre tout le confort nécessaire pour un séjour reposant. Avec ses murs en terre crue, ses tapis berbères et sa fenêtre ouverte sur la palmeraie, elle incarne l'authenticité de l'architecture marocaine. Climatisée et équipée d'une salle de bain privative.",
    price_per_night: 35,
    capacity: 2,
    size: 18,
    beds: "1 lit double",
    amenities: ["Climatisation", "Salle de bain privée", "Wi-Fi", "Vue palmeraie"],
    image_url: images.roomStandard,
    gallery_urls: [images.roomStandard, images.roomStandard2],
    featured: true,
  },
  {
    id: "2",
    name: "Chambre Deluxe",
    slug: "chambre-deluxe",
    description: "Plus spacieuse, avec un coin salon et une terrasse privée face aux falaises.",
    long_description:
      "La chambre deluxe propose un espace généreux avec un coin salon traditionnel, des draps en coton bio et une terrasse privée d'où vous admirerez les falaises du Todra au lever du soleil. La salle de bain en tadelakt apporte une touche d'élégance naturelle.",
    price_per_night: 55,
    capacity: 3,
    size: 28,
    beds: "1 lit double + 1 canapé-lit",
    amenities: ["Climatisation", "Salle de bain en tadelakt", "Terrasse privée", "Wi-Fi", "Vue falaises", "Coin salon"],
    image_url: images.roomDeluxe,
    gallery_urls: [images.roomDeluxe, images.roomDeluxe2],
    featured: true,
  },
  {
    id: "3",
    name: "Suite Berbère",
    slug: "suite-berbere",
    description: "Notre plus belle chambre, avec terrasse panoramique et décor traditionnel.",
    long_description:
      "La Suite Berbère est notre joie. Un espace de 40 m² au décor soigné, mêlant artisanat local et confort moderne. La terrasse panoramique offre une vue imprenable sur les gorges et la palmeraie. Parfaite pour un séjour romantique ou une escapade en famille.",
    price_per_night: 85,
    capacity: 4,
    size: 40,
    beds: "1 lit double + 2 lits simples",
    amenities: ["Climatisation", "Salle de bain en tadelakt", "Terrasse panoramique", "Wi-Fi", "Vue gorges", "Coin salon", "Petit-déjeuner inclus"],
    image_url: images.roomSuite,
    gallery_urls: [images.roomSuite, images.roomSuite2],
    featured: true,
  },
];

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRooms() {
      const { data } = await supabase.from("rooms").select("*").order("price_per_night", { ascending: true });
      if (data && data.length > 0) {
        setRooms(data);
      } else {
        setRooms(fallbackRooms);
      }
      setLoading(false);
    }
    loadRooms();
  }, []);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.roomDeluxe})` }}
        />
        <div className="absolute inset-0 bg-night-900/50" />
        <div className="relative z-10 text-center px-6">
          <p className="text-sand-200 text-sm uppercase tracking-[0.3em] mb-3">Hébergement</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">
            Nos chambres
          </h1>
        </div>
      </section>

      {/* Rooms list */}
      <section className="py-20 px-6 bg-sand-50">
        <div className="max-w-6xl mx-auto space-y-16">
          {loading ? (
            <p className="text-center text-night-400">Chargement…</p>
          ) : (
            rooms.map((room, index) => (
              <div
                key={room.id}
                id={room.slug}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center scroll-mt-24 ${
                  index % 2 === 1 ? "md:grid-flow-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                  <div className="relative h-80 md:h-96 overflow-hidden rounded-sm group">
                    <img
                      src={room.image_url}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className={index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
                  <p className="section-subtitle">{room.beds}</p>
                  <h2 className="font-serif text-3xl md:text-4xl text-night-900 font-light mb-4">
                    {room.name}
                  </h2>
                  <p className="text-night-600 leading-relaxed mb-6">
                    {room.long_description}
                  </p>

                  <div className="flex flex-wrap gap-6 mb-6 text-sm text-night-600">
                    <span className="flex items-center gap-2">
                      <Users size={18} className="text-terracotta-500" />
                      {room.capacity} personnes
                    </span>
                    <span className="flex items-center gap-2">
                      <Maximize size={18} className="text-terracotta-500" />
                      {room.size} m²
                    </span>
                    <span className="flex items-center gap-2">
                      <BedDouble size={18} className="text-terracotta-500" />
                      {room.beds}
                    </span>
                  </div>

                  <ul className="grid grid-cols-2 gap-2 mb-8">
                    {room.amenities.map((amenity) => (
                      <li key={amenity} className="flex items-center gap-2 text-sm text-night-600">
                        <Check size={16} className="text-oasis-500" />
                        {amenity}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between border-t border-sand-200 pt-6">
                    <div>
                      <span className="font-serif text-3xl text-terracotta-600">
                        {room.price_per_night} €
                      </span>
                      <span className="text-night-400 text-sm"> / nuit</span>
                    </div>
                    <Link
                      to="/reserver"
                      state={{ roomId: room.id, roomName: room.name }}
                      className="btn-primary"
                    >
                      Réserver <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
