import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import room2 from "@/assets/rooms/room_2.jpg.asset.json";
import room5 from "@/assets/rooms/room_5.jpg.asset.json";
import room6 from "@/assets/rooms/room_6.jpg.asset.json";
import room7 from "@/assets/rooms/room_7.jpg.asset.json";
import room8 from "@/assets/rooms/room_8.jpg.asset.json";
import room11 from "@/assets/rooms/room_11.jpg.asset.json";
import room12 from "@/assets/rooms/room_12.jpg.asset.json";
import room16 from "@/assets/rooms/room_16.jpg.asset.json";
import room17 from "@/assets/rooms/room_17.jpg.asset.json";
import room18 from "@/assets/rooms/room_18.jpg.asset.json";
import pool from "@/assets/gallery/pool.jpg.asset.json";
import terrace from "@/assets/gallery/terrace.jpg.asset.json";
import valley from "@/assets/gallery/valley.jpg.asset.json";
import dining from "@/assets/dining/dining_candlelit.jpg.asset.json";
import salon from "@/assets/common/salon.jpg.asset.json";
import diningRoom from "@/assets/common/dining_room.jpg.asset.json";
import nightKsar from "@/assets/gallery/night_ksar.jpg.asset.json";
import nightPool from "@/assets/gallery/night_pool.jpg.asset.json";
import lounge from "@/assets/gallery/lounge.jpg.asset.json";
import room7b from "@/assets/rooms/room_7b.jpg.asset.json";
import room8b from "@/assets/rooms/room_8b.jpg.asset.json";
import room16b from "@/assets/rooms/room_16b.jpg.asset.json";
import room17b from "@/assets/rooms/room_17b.jpg.asset.json";
import room18b from "@/assets/rooms/room_18b.jpg.asset.json";
import bathWc from "@/assets/rooms/bath_wc.jpg.asset.json";
import bathShower from "@/assets/rooms/bath_shower.jpg.asset.json";
import g21 from "@/assets/gallery2/unnamed_21.jpg.asset.json";
import g22 from "@/assets/gallery2/unnamed_22.jpg.asset.json";
import g23 from "@/assets/gallery2/unnamed_23.jpg.asset.json";
import g24 from "@/assets/gallery2/unnamed_24.jpg.asset.json";
import g25 from "@/assets/gallery2/unnamed_25.jpg.asset.json";
import g27 from "@/assets/gallery2/unnamed_27.jpg.asset.json";
import g28 from "@/assets/gallery2/unnamed_28.jpg.asset.json";
import g29 from "@/assets/gallery2/unnamed_29.jpg.asset.json";
import g30 from "@/assets/gallery2/unnamed_30.jpg.asset.json";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie — Auberge Le Festival, Todra" },
      { name: "description", content: "Photos de l'Auberge Le Festival : chambres, terrasse, piscine et vues sur les Gorges du Todra." },
      { property: "og:title", content: "Galerie — Auberge Le Festival" },
      { property: "og:description", content: "L'auberge en images." },
      { property: "og:image", content: pool.url },
    ],
  }),
  component: Galerie,
});

/* ────────────────────────────────────────────────────────────────────
   🖼️  GALERIE — pour ajouter une image, ajoute simplement une ligne
   { src: ..., alt: "...", category: "maison" | "table" | "chambres" | "bains" }
   ──────────────────────────────────────────────────────────────────── */
type Category = "maison" | "table" | "chambres" | "bains";

const CATEGORIES: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "maison", label: "La maison" },
  { key: "table", label: "La table & les salons" },
  { key: "chambres", label: "Les chambres" },
  { key: "bains", label: "Salles de bain" },
];

const IMAGES: { src: string; alt: string; category: Category }[] = [
  // La maison
  { src: pool.url, alt: "Piscine en pierre face au ksar", category: "maison" },
  { src: terrace.url, alt: "Terrasse ouverte sur la gorge", category: "maison" },
  { src: valley.url, alt: "Vue sur la palmeraie de Tinghir", category: "maison" },
  { src: g25.url, alt: "Terrasse mosaïque avec vue sur la gorge et la piscine", category: "maison" },
  { src: nightKsar.url, alt: "L'auberge illuminée sous les étoiles", category: "maison" },
  { src: nightPool.url, alt: "Piscine éclairée à la tombée de la nuit", category: "maison" },

  // La table & les salons
  { src: diningRoom.url, alt: "Salle à manger en pierre", category: "table" },
  { src: dining.url, alt: "Dîner aux chandelles dans la salle voûtée", category: "table" },
  { src: salon.url, alt: "Salon berbère avec coussins et tables sculptées", category: "table" },
  { src: lounge.url, alt: "Salon commun avec guitare et tambours", category: "table" },
  { src: g21.url, alt: "Tajine de courgettes gratinées", category: "table" },
  { src: g27.url, alt: "Tajine de légumes et gratin d'aubergines", category: "table" },
  { src: g28.url, alt: "Petit-déjeuner marocain avec confitures et huiles", category: "table" },
  { src: g29.url, alt: "Soupe marocaine servie chaude", category: "table" },
  { src: g24.url, alt: "Harira maison avec pain frais", category: "table" },

  // Les chambres
  { src: room2.url, alt: "Chambre Rouge Berbère", category: "chambres" },
  { src: room5.url, alt: "Chambre Troglodyte", category: "chambres" },
  { src: room6.url, alt: "Chambre Familiale Zellige", category: "chambres" },
  { src: g22.url, alt: "Chambre troglodyte aux draps rouges", category: "chambres" },
  { src: g23.url, alt: "Salon-chambre en pierre avec fenêtres jumelées", category: "chambres" },
  { src: room7.url, alt: "Chambre Pierre", category: "chambres" },
  { src: room7b.url, alt: "Chambre aux couvre-lits rayés", category: "chambres" },
  { src: room8.url, alt: "Chambre Vallée", category: "chambres" },
  { src: room8b.url, alt: "Chambre en enfilade avec arche", category: "chambres" },
  { src: room12.url, alt: "Chambre Twin Voûtée", category: "chambres" },
  { src: room16.url, alt: "Chambre Twin Pierre", category: "chambres" },
  { src: room16b.url, alt: "Chambre jumeaux sous plafond de roche", category: "chambres" },
  { src: room17.url, alt: "Chambre Safran", category: "chambres" },
  { src: room17b.url, alt: "Chambre à applique en laiton", category: "chambres" },
  { src: room18.url, alt: "Chambre Atlas", category: "chambres" },
  { src: room18b.url, alt: "Chambre en pierre avec rideaux orangés", category: "chambres" },

  // Salles de bain
  { src: room11.url, alt: "Salle de bain en tadelakt rose", category: "bains" },
  { src: g30.url, alt: "Salle de bain en tadelakt avec baignoire bleue", category: "bains" },
  { src: bathWc.url, alt: "WC séparés en pierre", category: "bains" },
  { src: bathShower.url, alt: "Douche voûtée aux murs jaunes", category: "bains" },
];

function Galerie() {
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const items = IMAGES.filter((i) => filter === "all" || i.category === filter);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Keyboard nav in lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, items.length]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="bg-ink pt-32 pb-16 text-primary-foreground">
        <div className="container-x">
          <p className="eyebrow text-accent">Galerie</p>
          <h1 className="mt-3 font-display text-5xl md:text-7xl max-w-3xl">
            L'auberge, en images.
          </h1>
          <p className="mt-4 max-w-xl text-primary-foreground/70">
            Faites défiler à gauche ou à droite. Cliquez sur une photo pour l'agrandir.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="container-x pt-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={`rounded-full px-4 py-1.5 text-xs border transition ${
                filter === c.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Slider */}
      <section className="container-x py-10">
        <div className="relative">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Précédent"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full bg-ink text-primary-foreground shadow-lg hover:bg-ink/90"
          >
            ‹
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Suivant"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center rounded-full bg-ink text-primary-foreground shadow-lg hover:bg-ink/90"
          >
            ›
          </button>

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {items.map((img, i) => (
              <button
                key={img.src}
                onClick={() => setLightbox(i)}
                className="snap-start shrink-0 w-[85%] sm:w-[55%] md:w-[42%] lg:w-[32%] aspect-[4/5] overflow-hidden rounded-sm group"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>

          {/* Mobile arrows */}
          <div className="md:hidden flex justify-center gap-3 pt-2">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Précédent"
              className="h-10 w-10 rounded-full bg-ink text-primary-foreground"
            >
              ‹
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Suivant"
              className="h-10 w-10 rounded-full bg-ink text-primary-foreground"
            >
              ›
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground text-center">
          {items.length} photos · utilisez ← → pour naviguer dans le zoom
        </p>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i - 1 + items.length) % items.length));
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-primary-foreground/10 text-primary-foreground text-2xl hover:bg-primary-foreground/20"
            aria-label="Précédent"
          >
            ‹
          </button>
          <img
            src={items[lightbox].src}
            alt={items[lightbox].alt}
            className="max-h-full max-w-full object-contain rounded-sm"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i === null ? null : (i + 1) % items.length));
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-primary-foreground/10 text-primary-foreground text-2xl hover:bg-primary-foreground/20"
            aria-label="Suivant"
          >
            ›
          </button>
          <button
            className="absolute top-6 right-6 text-primary-foreground text-3xl"
            aria-label="Fermer"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-primary-foreground/70">
            {lightbox + 1} / {items.length}
          </p>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
