import { createFileRoute } from "@tanstack/react-router";
import roomImg from "@/assets/room.jpg";
import courtyardImg from "@/assets/courtyard.jpg";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/chambres")({
  head: () => ({
    meta: [
      { title: "Chambres — Auberge Le Festival, Todra" },
      { name: "description", content: "Chambres traditionnelles avec vue sur les Gorges du Todra. À partir de 793 MAD la nuit, petit-déjeuner et Wi-Fi inclus." },
      { property: "og:title", content: "Chambres — Auberge Le Festival" },
      { property: "og:description", content: "Vingt-trois chambres au pied des falaises du Todra." },
      { property: "og:url", content: "/chambres" },
    ],
    links: [{ rel: "canonical", href: "/chambres" }],
  }),
  component: Chambres,
});

const rooms = [
  {
    name: "Chambre Berbère",
    price: "793",
    beds: "1 lit double",
    body: "Murs de chaux, tapis tissé, fenêtre en arc donnant sur la gorge. Salle de bain privative.",
    img: roomImg,
  },
  {
    name: "Chambre Familiale",
    price: "1 050",
    beds: "1 lit double + 2 lits simples",
    body: "Deux pièces communicantes, idéale pour les familles. Vue sur la cour intérieure.",
    img: courtyardImg,
  },
  {
    name: "Chambre Terrasse",
    price: "890",
    beds: "1 lit double",
    body: "Accès direct au toit-terrasse. Parfaite pour dormir à la belle étoile en été.",
    img: roomImg,
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
                  <img src={r.img} alt={r.name} width={1400} height={1050} loading="lazy" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <p className="eyebrow">0{i + 1}</p>
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
