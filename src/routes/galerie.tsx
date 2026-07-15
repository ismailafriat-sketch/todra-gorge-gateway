import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

const groups = [
  {
    title: "La maison",
    items: [
      { src: pool.url, alt: "Piscine en pierre face au ksar" },
      { src: terrace.url, alt: "Terrasse ouverte sur la gorge" },
      { src: valley.url, alt: "Vue sur la palmeraie de Tinghir" },
      { src: g25.url, alt: "Terrasse mosaïque avec vue sur la gorge et la piscine" },
      { src: nightKsar.url, alt: "L'auberge illuminée sous les étoiles" },
      { src: nightPool.url, alt: "Piscine éclairée à la tombée de la nuit" },
    ],
  },
  {
    title: "La table & les salons",
    items: [
      { src: diningRoom.url, alt: "Salle à manger en pierre" },
      { src: dining.url, alt: "Dîner aux chandelles dans la salle voûtée" },
      { src: salon.url, alt: "Salon berbère avec coussins et tables sculptées" },
      { src: lounge.url, alt: "Salon commun avec guitare et tambours" },
      { src: g26.url, alt: "Dîner aux chandelles, entrée dressée" },
      { src: g21.url, alt: "Tajine de courgettes gratinées" },
      { src: g27.url, alt: "Tajine de légumes et gratin d'aubergines" },
      { src: g28.url, alt: "Petit-déjeuner marocain avec confitures et huiles" },
      { src: g29.url, alt: "Soupe marocaine servie chaude" },
      { src: g24.url, alt: "Harira maison avec pain frais" },
    ],
  },
  {
    title: "Les chambres",
    items: [
      { src: room2.url, alt: "Chambre Rouge Berbère" },
      { src: room5.url, alt: "Chambre Troglodyte" },
      { src: room6.url, alt: "Chambre Familiale Zellige" },
      { src: g22.url, alt: "Chambre troglodyte aux draps rouges" },
      { src: g23.url, alt: "Salon-chambre en pierre avec fenêtres jumelées" },
      { src: room7.url, alt: "Chambre Pierre" },
      { src: room7b.url, alt: "Chambre aux couvre-lits rayés" },
      { src: room8.url, alt: "Chambre Vallée" },
      { src: room8b.url, alt: "Chambre en enfilade avec arche" },
      { src: room12.url, alt: "Chambre Twin Voûtée" },
      { src: room16.url, alt: "Chambre Twin Pierre" },
      { src: room16b.url, alt: "Chambre jumeaux sous plafond de roche" },
      { src: room17.url, alt: "Chambre Safran" },
      { src: room17b.url, alt: "Chambre à applique en laiton" },
      { src: room18.url, alt: "Chambre Atlas" },
      { src: room18b.url, alt: "Chambre en pierre avec rideaux orangés" },
    ],
  },
  {
    title: "Salles de bain",
    items: [
      { src: room11.url, alt: "Salle de bain en tadelakt rose" },
      { src: g30.url, alt: "Salle de bain en tadelakt avec baignoire bleue" },
      { src: bathWc.url, alt: "WC séparés en pierre" },
      { src: bathShower.url, alt: "Douche voûtée aux murs jaunes" },
    ],
  },
];

function Galerie() {
  const [lightbox, setLightbox] = useState<string | null>(null);

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
            Chambres, terrasse, piscine, table et paysages des Gorges du Todra.
          </p>
        </div>
      </section>

      <div className="container-x py-16 space-y-20">
        {groups.map((g) => (
          <section key={g.title}>
            <p className="eyebrow">{g.title}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {g.items.map((img) => (
                <button
                  key={img.src}
                  onClick={() => setLightbox(img.src)}
                  className="aspect-[4/5] overflow-hidden rounded-sm group"
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
          </section>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-h-full max-w-full object-contain rounded-sm" />
          <button
            className="absolute top-6 right-6 text-primary-foreground text-3xl"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
