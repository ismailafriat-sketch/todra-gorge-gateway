import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Bed, Mountain, UtensilsCrossed, Calendar } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Room } from "../types";
import { images } from "../lib/images";

export default function Home() {
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRooms() {
      const { data } = await supabase.from("rooms").select("*").eq("featured", true).limit(3);
      setFeaturedRooms(data || []);
      setLoading(false);
    }
    loadRooms();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slowZoom"
          style={{ backgroundImage: `url(${images.heroTodra})` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <p className="text-sand-200 text-sm uppercase tracking-[0.3em] mb-4 animate-fadeIn" style={{ animationDelay: "0.1s", opacity: 0 }}>
            Bienvenue au cœur du Todra
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-white font-light text-balance animate-fadeInUp" style={{ animationDelay: "0.3s", opacity: 0 }}>
            Auberge Le Festival
          </h1>
          <p className="text-sand-100 text-lg md:text-xl mt-6 max-w-2xl mx-auto font-light leading-relaxed animate-fadeInUp" style={{ animationDelay: "0.6s", opacity: 0 }}>
            Une oasis d'hospitalité marocaine nichée entre les falaises
            spectaculaires des gorges du Todra.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fadeInUp" style={{ animationDelay: "0.9s", opacity: 0 }}>
            <Link to="/reserver" className="btn-primary">
              <Calendar size={18} className="mr-2" />
              Réserver votre séjour
            </Link>
            <Link to="/chambres" className="btn-secondary !text-white !border-white/60 hover:!bg-white hover:!text-night-900">
              Découvrir les chambres
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fadeIn" style={{ animationDelay: "1.2s", opacity: 0 }}>
          <div className="w-px h-16 bg-white/40" />
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 px-6 bg-sand-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-subtitle">Notre histoire</p>
          <h2 className="section-title mb-6">
            L'esprit de l'hospitalité marocaine
          </h2>
          <p className="text-night-600 text-lg leading-relaxed font-light max-w-3xl mx-auto">
            Au cœur de la palmeraie de Tinghir, l'Auberge Le Festival vous
            accueille dans un cadre authentique et chaleureux. Notre maison
            familiale combine le confort moderne avec la tradition berbère,
            offrant une expérience unique au pied des gorges du Todra.
          </p>
          <p className="text-night-500 text-base leading-relaxed font-light max-w-2xl mx-auto mt-4">
            Que vous soyez randonneur, grimpeur, ou voyageur en quête de
            dépaysement, nous vous accueillons comme des amis.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Bed, title: "Chambres confortables", desc: "Des chambres climatisées avec vue sur les falaises ou la palmeraie." },
            { icon: UtensilsCrossed, title: "Cuisine traditionnelle", desc: "Tagines, couscous et thé à la menthe préparés avec des produits locaux." },
            { icon: Mountain, title: "Excursions & randonnées", desc: "Guides locaux pour explorer les gorges, le désert et les villages berbères." },
          ].map((item) => (
            <div key={item.title} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sand-100 text-terracotta-600 mb-5 transition-all duration-300 group-hover:bg-terracotta-600 group-hover:text-white">
                <item.icon size={28} />
              </div>
              <h3 className="font-serif text-2xl text-night-900 mb-3">{item.title}</h3>
              <p className="text-night-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 px-6 bg-sand-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-subtitle">Hébergement</p>
            <h2 className="section-title">Nos chambres d'exception</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              <p className="col-span-full text-center text-night-400">Chargement des chambres…</p>
            ) : featuredRooms.length > 0 ? (
              featuredRooms.map((room) => (
                <Link
                  key={room.id}
                  to={`/chambres#${room.slug}`}
                  className="card group block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.image_url}
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-night-900/80 to-transparent p-4">
                      <p className="text-white font-serif text-xl">{room.name}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-night-500 text-sm leading-relaxed line-clamp-2 mb-4">
                      {room.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-terracotta-600 font-serif text-2xl">
                        {room.price_per_night} €
                        <span className="text-sm text-night-400 font-sans"> / nuit</span>
                      </span>
                      <span className="text-terracotta-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Voir <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-center text-night-400">
                Les chambres seront bientôt disponibles.
              </p>
            )}
          </div>
          <div className="text-center mt-12">
            <Link to="/chambres" className="btn-secondary">
              Toutes les chambres <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Gorge Teaser */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.todraCliffs})` }}
        />
        <div className="absolute inset-0 bg-night-900/50" />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <p className="text-sand-200 text-sm uppercase tracking-[0.3em] mb-4">À découvrir</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white font-light mb-6">
            Les gorges du Todra
          </h2>
          <p className="text-sand-100 text-lg font-light leading-relaxed mb-8">
            Des falaises de 300 mètres de haut, une rivière cristalline et une
            palmeraie luxuriante. Un paysage à couper le souffle, directement
            accessible depuis l'auberge.
          </p>
          <Link to="/todra" className="btn-primary">
            Explorer les gorges <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-terracotta-400 font-serif text-6xl leading-none mb-4">"</div>
          <blockquote className="font-serif text-2xl md:text-3xl text-night-800 font-light italic leading-relaxed">
            Un séjour inoubliable. L'accueil chaleureux de Hassan et sa
            famille, la délicieuse cuisine maison et la beauté spectaculaire
            des gorges. Nous reviendrons sans hésiter.
          </blockquote>
          <p className="text-night-400 mt-6 text-sm uppercase tracking-[0.2em]">
            — Sophie & Marc, Lyon
          </p>
        </div>
      </section>
    </div>
  );
}
