import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/chambres")({
  head: () => ({
    meta: [
      { title: "Chambres — Auberge Le Festival, Todra" },
      { name: "description", content: "Chambres traditionnelles avec vue sur les Gorges du Todra. À partir de 793 MAD la nuit, petit-déjeuner et Wi-Fi inclus." },
      { property: "og:title", content: "Chambres — Auberge Le Festival" },
      { property: "og:description", content: "Vingt-trois chambres au pied des falaises du Todra." },
      { property: "og:image", content: room2.url },
      { property: "og:url", content: "/chambres" },
    ],
    links: [{ rel: "canonical", href: "/chambres" }],
  }),
  component: Chambres,
});

const rooms = [
  {
    name: "Chambre Rouge Berbère",
    price: "793",
    beds: "1 lit double",
    body: "Voûte en tadelakt ocre, textiles rouges tissés à la main, lanternes en fer forgé. L'âme du Sud marocain dans une pièce.",
    img: room2.url,
  },
  {
    name: "Chambre Troglodyte",
    price: "990",
    beds: "1 lit double",
    body: "Creusée dans la roche même de la gorge. Parois de pierre brute, lumière tamisée, silence absolu.",
    img: room5.url,
  },
  {
    name: "Chambre Familiale Zellige",
    price: "1 050",
    beds: "1 lit double + 1 lit simple",
    body: "Arche mauresque, sols en zellige traditionnel, tapis kilim. Deux couchages pour familles ou amis.",
    img: room6.url,
  },
  {
    name: "Chambre Pierre",
    price: "820",
    beds: "1 lit double",
    body: "Murs de pierre apparente, couvre-lit rayé du Haut Atlas. Sobre, chaleureuse, honnête.",
    img: room7.url,
  },
  {
    name: "Chambre Vallée",
    price: "890",
    beds: "1 lit double",
    body: "Fenêtre ouverte sur la vallée, rideaux tissés, murs en tadelakt rose. Passage vers une seconde pièce.",
    img: room8.url,
  },
  {
    name: "Chambre Twin Voûtée",
    price: "860",
    beds: "2 lits simples",
    body: "Plafond en pierre, lanterne en osier, deux lits confortables. Idéale pour deux voyageurs.",
    img: room12.url,
  },
  {
    name: "Chambre Twin Pierre",
    price: "860",
    beds: "2 lits simples",
    body: "Plafond de roche naturelle, fenêtre en arc bleu, sol carrelé. Une chambre qui raconte la montagne.",
    img: room16.url,
  },
  {
    name: "Chambre Safran",
    price: "810",
    beds: "1 lit double",
    body: "Murs jaune safran patiné, applique en laiton, textiles orange et rouge. Chaude comme un soir d'été à Todra.",
    img: room17.url,
  },
  {
    name: "Chambre Atlas",
    price: "870",
    beds: "1 lit double",
    body: "Textiles violets et roses, arche donnant sur un petit salon, pierre brute. Le luxe modeste de la montagne.",
    img: room18.url,
  },
];

function Chambres() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HEADER */}
      <section className="relative bg-ink pt-40 pb-24 text-primary-foreground">
        <div className="container-x">
          <p className="eyebrow text-accent">Séjour</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl max-w-3xl">
            Vingt-trois chambres, une seule vue.
          </h1>
          <p className="mt-6 max-w-xl text-primary-foreground/70">
            Les chambres de l'Auberge Le Festival sont simples et honnêtes.
            Toutes disposent d'une salle de bain privative, du Wi-Fi et du
            petit-déjeuner inclus.
          </p>
        </div>
      </section>

      {/* ROOMS */}
      <section className="container-x py-24">
        <div className="space-y-24">
          {rooms.map((r, i) => (
            <article key={r.name} className="grid gap-10 md:grid-cols-12 md:items-center">
              <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                <div className="aspect-[4/3] overflow-hidden rounded-sm">
                  <img src={r.img} alt={r.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 font-display text-3xl md:text-4xl">{r.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{r.beds}</p>
                <p className="mt-5 leading-relaxed text-foreground">{r.body}</p>
                <div className="mt-8 flex items-end justify-between border-t border-border pt-6">
                  <div>
                    <p className="eyebrow">À partir de</p>
                    <p className="mt-1 font-display text-4xl text-clay">
                      {r.price} <span className="text-lg text-muted-foreground">MAD</span>
                    </p>
                  </div>
                  <a
                    href="tel:+212673454307"
                    className="rounded-full bg-primary px-5 py-3 text-sm text-primary-foreground hover:bg-primary/90"
                  >
                    Réserver
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* BATHROOM / DETAILS */}
      <section className="border-t border-border bg-muted/30">
        <div className="container-x py-20 grid gap-10 md:grid-cols-2 md:items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-sm">
            <img src={room11.url} alt="Salle de bain en tadelakt rose" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="eyebrow">Salles de bain</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Tadelakt, cuivre, terre.</h2>
            <p className="mt-6 leading-relaxed text-foreground">
              Chaque chambre dispose de sa propre salle de bain, façonnée à la
              main dans le tadelakt traditionnel. Vasques en cuivre martelé,
              carrelage terre cuite, miroirs sculptés — le confort d'un hôtel,
              le caractère d'une maison berbère.
            </p>
          </div>
        </div>
      </section>

      {/* INCLUDES */}
      <section className="border-t border-border bg-muted/50">
        <div className="container-x py-20">
          <p className="eyebrow">Inclus pour chaque nuit</p>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {[
              "Petit-déjeuner berbère",
              "Wi-Fi gratuit",
              "Accès terrasse & cour",
              "Parking sur place",
            ].map((x) => (
              <div key={x} className="border-t border-border pt-4">
                <p className="font-display text-lg">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
