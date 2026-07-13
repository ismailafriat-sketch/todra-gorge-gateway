import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import room2 from "@/assets/rooms/room_2.jpg.asset.json";
import room5 from "@/assets/rooms/room_5.jpg.asset.json";
import room6 from "@/assets/rooms/room_6.jpg.asset.json";
import room8 from "@/assets/rooms/room_8.jpg.asset.json";
import room18 from "@/assets/rooms/room_18.jpg.asset.json";
import poolImg from "@/assets/gallery/pool.jpg.asset.json";

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Réservation — Auberge Le Festival, Todra" },
      { name: "description", content: "Vérifiez la disponibilité et réservez votre chambre à l'Auberge Le Festival, Gorges du Todra." },
      { property: "og:title", content: "Réservation — Auberge Le Festival" },
      { property: "og:description", content: "Disponibilité et tarifs en direct." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Reservation,
});

type Option = {
  label: string;
  original: number;
  price: number;
  perks: string[];
  maxAvailable: number;
  maxGuests: number;
  soloOnly?: boolean;
};

type RoomType = {
  id: string;
  name: string;
  img: string;
  beds: string;
  size?: string;
  features: string[];
  remaining: string;
  options: Option[];
};

const rooms: RoomType[] = [
  {
    id: "double-standard",
    name: "Chambre Double Standard",
    img: room2.url,
    beds: "1 lit double",
    features: ["Balcon", "Vue sur un lieu d'intérêt", "Salle de bains privative", "Terrasse", "Chauffage"],
    remaining: "Il nous reste 4 options",
    options: [
      { label: "Non remboursable", original: 855, price: 714, perks: ["Payez en ligne", "Réduction Genius 10 %"], maxAvailable: 4, maxGuests: 2 },
      { label: "Petit-déjeuner + parking", original: 950, price: 793, perks: ["Petit-déjeuner compris", "1 place de parking", "Non remboursable"], maxAvailable: 4, maxGuests: 2 },
      { label: "Tarif solo", original: 855, price: 714, perks: ["Petit-déjeuner compris", "1 place de parking", "Non remboursable"], maxAvailable: 4, maxGuests: 1, soloOnly: true },
    ],
  },
  {
    id: "double-grotte",
    name: "Chambre Double Grotte",
    img: room5.url,
    beds: "1 lit double",
    size: "15 m²",
    features: ["Vue sur un lieu d'intérêt", "Salle de bains privative", "Terrasse"],
    remaining: "Il nous reste 3 options",
    options: [
      { label: "Non remboursable", original: 951, price: 794, perks: ["Payez en ligne", "Réduction Genius 10 %"], maxAvailable: 3, maxGuests: 2 },
      { label: "Petit-déjeuner + parking", original: 1057, price: 882, perks: ["Petit-déjeuner compris", "1 place de parking", "Non remboursable"], maxAvailable: 3, maxGuests: 2 },
    ],
  },
  {
    id: "double",
    name: "Chambre Double",
    img: room8.url,
    beds: "1 lit simple et 1 grand lit double",
    features: ["Salle de bains privative", "Terrasse"],
    remaining: "Il nous reste 1 option",
    options: [
      { label: "Petit-déjeuner + parking", original: 1601, price: 1485, perks: ["Petit-déjeuner compris", "1 place de parking", "Non remboursable"], maxAvailable: 1, maxGuests: 2 },
    ],
  },
  {
    id: "quadruple-tour",
    name: "Chambre Quadruple Tour",
    img: room6.url,
    beds: "2 lits doubles",
    size: "15 m²",
    features: ["Balcon", "Vue sur un lieu d'intérêt", "Salle de bains privative", "Terrasse"],
    remaining: "Il nous reste 1 option",
    options: [
      { label: "Non remboursable", original: 1249, price: 1042, perks: ["Payez en ligne", "Réduction Genius 10 %"], maxAvailable: 1, maxGuests: 2 },
      { label: "Petit-déjeuner + parking", original: 1388, price: 1158, perks: ["Petit-déjeuner compris", "1 place de parking", "Non remboursable"], maxAvailable: 1, maxGuests: 2 },
    ],
  },
  {
    id: "appartement-piscine",
    name: "Appartement — Vue sur Piscine",
    img: poolImg.url,
    beds: "Chambre 1 : 1 grand lit double · Chambre 2 : 2 lits simples",
    size: "50 m²",
    features: ["Balcon", "Vue sur un lieu d'intérêt", "Terrasse"],
    remaining: "Il nous reste 1 option",
    options: [
      { label: "Non remboursable", original: 1441, price: 1336, perks: ["Payez en ligne"], maxAvailable: 1, maxGuests: 2 },
      { label: "Petit-déjeuner + parking", original: 1601, price: 1485, perks: ["Petit-déjeuner compris", "1 place de parking", "Non remboursable"], maxAvailable: 1, maxGuests: 2 },
    ],
  },
];

const fmt = (n: number) => `MAD ${n.toLocaleString("fr-FR")}`;
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
};
const dateLabel = (d: Date) =>
  d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });

function Reservation() {
  const start = useMemo(() => new Date(), []);
  const end = useMemo(() => tomorrow(), []);
  const [filter, setFilter] = useState<"tous" | "chambres" | "appartements">("tous");
  // selections keyed by `${roomId}:${optionIndex}`
  const [sel, setSel] = useState<Record<string, number>>({});

  const setQty = (key: string, qty: number) =>
    setSel((s) => ({ ...s, [key]: qty }));

  const visible = rooms.filter((r) => {
    if (filter === "tous") return true;
    if (filter === "appartements") return r.id.startsWith("appartement");
    return !r.id.startsWith("appartement");
  });

  const total = rooms.reduce((sum, r) => {
    r.options.forEach((o, i) => {
      const q = sel[`${r.id}:${i}`] ?? 0;
      sum += q * o.price;
    });
    return sum;
  }, 0);

  const totalRooms = Object.values(sel).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HEADER */}
      <section className="bg-ink pt-32 pb-10 text-primary-foreground">
        <div className="container-x">
          <p className="eyebrow text-accent">Disponibilité</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">
            Nous ajustons nos tarifs
          </h1>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Tarifs convertis en MAD · Taxes et frais compris
          </p>
        </div>
      </section>

      {/* SEARCH SUMMARY */}
      <section className="border-b border-border bg-muted/40">
        <div className="container-x flex flex-wrap items-center gap-4 py-5 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg">
              {dateLabel(start)} — {dateLabel(end)}
            </span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span>2 adultes · 0 enfant · 1 chambre</span>
          <button className="ml-auto rounded-full border border-input px-4 py-1.5 text-xs hover:bg-accent/40">
            Modifier la recherche
          </button>
        </div>
      </section>

      {/* FILTERS */}
      <section className="container-x pt-10">
        <p className="eyebrow">Filtrer par</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(
            [
              { k: "tous", label: "Tous" },
              { k: "chambres", label: "Chambres" },
              { k: "appartements", label: "Appartements" },
            ] as const
          ).map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`rounded-full px-4 py-1.5 text-xs border transition ${
                filter === f.k
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Sélectionnez le type et le nombre d'hébergements que vous souhaitez réserver.
        </p>
      </section>

      {/* ROOMS TABLE */}
      <section className="container-x py-10 space-y-14">
        {visible.map((r) => (
          <article key={r.id} className="border border-border rounded-sm overflow-hidden bg-card">
            <div className="grid gap-6 md:grid-cols-12 p-6 border-b border-border">
              <div className="md:col-span-4 aspect-[4/3] overflow-hidden rounded-sm">
                <img src={r.img} alt={r.name} className="h-full w-full object-cover" />
              </div>
              <div className="md:col-span-8">
                <h2 className="font-display text-2xl md:text-3xl">{r.name}</h2>
                <p className="mt-1 text-sm text-clay">{r.remaining}</p>
                <p className="mt-3 text-sm">{r.beds}</p>
                {r.size && <p className="text-sm text-muted-foreground">{r.size}</p>}
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {r.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="divide-y divide-border">
              {r.options.map((o, i) => {
                const key = `${r.id}:${i}`;
                const qty = sel[key] ?? 0;
                const discount = Math.round((1 - o.price / o.original) * 100);
                return (
                  <div key={i} className="grid gap-6 md:grid-cols-12 p-6 items-start">
                    <div className="md:col-span-4">
                      <p className="text-sm font-medium">
                        Personnes max. : {o.maxGuests}
                        {o.soloOnly && <span className="ml-2 text-xs text-muted-foreground">Pour 1 seule personne</span>}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{o.label}</p>
                    </div>
                    <div className="md:col-span-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-sm text-muted-foreground line-through">{fmt(o.original)}</span>
                        <span className="font-display text-2xl text-clay">{fmt(o.price)}</span>
                        <span className="rounded-sm bg-clay/10 px-1.5 py-0.5 text-xs text-clay">-{discount} %</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Taxes et frais compris</p>
                      <ul className="mt-3 space-y-1 text-xs">
                        {o.perks.map((p) => (
                          <li key={p}>· {p}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs text-muted-foreground mb-1">
                        Sélectionner des chambres
                      </label>
                      <select
                        value={qty}
                        onChange={(e) => setQty(key, Number(e.target.value))}
                        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                      >
                        {Array.from({ length: o.maxAvailable + 1 }, (_, n) => (
                          <option key={n} value={n}>
                            {n} {n > 0 ? `(${fmt(n * o.price)})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>

      {/* SUMMARY BAR */}
      <section className="sticky bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
        <div className="container-x flex flex-wrap items-center gap-4 py-4">
          <div>
            <p className="text-xs text-muted-foreground">
              {totalRooms} chambre{totalRooms > 1 ? "s" : ""} · Taxes et frais compris
            </p>
            <p className="font-display text-2xl text-clay">{fmt(total)}</p>
          </div>
          <a
            href="tel:+212673454307"
            className={`ml-auto rounded-full px-6 py-3 text-sm font-medium transition ${
              total > 0
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground pointer-events-none"
            }`}
          >
            Réserver — Appeler l'auberge
          </a>
          <Link
            to="/contact"
            className="rounded-full border border-input px-6 py-3 text-sm hover:bg-accent/40"
          >
            Écrire
          </Link>
        </div>
      </section>

      {/* REVIEWS SNIPPET */}
      <section className="border-t border-border bg-muted/40">
        <div className="container-x py-16 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Commentaires clients</p>
            <div className="mt-4 flex items-end gap-3">
              <span className="font-display text-5xl text-clay">9,3</span>
              <div className="text-sm">
                <p className="font-medium">Fabuleux</p>
                <p className="text-muted-foreground">1 385 expériences vécues</p>
              </div>
            </div>
            <ul className="mt-6 space-y-2 text-sm">
              {[
                ["Personnel", "9,5"],
                ["Équipements", "9,2"],
                ["Propreté", "9,3"],
                ["Confort", "9,3"],
                ["Rapport qualité/prix", "9,1"],
                ["Situation géographique", "9,8"],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between border-b border-border pb-1">
                  <span>{k}</span>
                  <span className="text-clay">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-8 grid gap-4 md:grid-cols-2">
            {[
              { n: "Régis · Suisse", t: "Belle découverte, chambre troglodyte, cadre magnifique." },
              { n: "Hervé · Madagascar", t: "Le personnel est extrêmement serviable. La situation est magnifique, elle permet de merveilleuses randonnées." },
              { n: "Sylvie · France", t: "Une grotte qui donne sur la terrasse… si insolite et romantique. Un séjour inoubliable." },
              { n: "François · France", t: "Expérience dans un lieu unique, assez haut de gamme. Équipe très sympa et très bon repas." },
            ].map((c) => (
              <blockquote key={c.n} className="rounded-sm border border-border bg-background p-5 text-sm">
                <p className="italic">« {c.t} »</p>
                <footer className="mt-3 text-xs text-muted-foreground">— {c.n}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="container-x py-16">
        <p className="eyebrow">Équipements — note 9,2</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl">Ses points forts</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4 text-sm">
          {[
            "Piscine extérieure",
            "Chambres non-fumeurs",
            "Wi-Fi gratuit",
            "Parking gratuit",
            "Chambres familiales",
            "Restaurant",
            "Service d'étage",
            "Petit-déjeuner exceptionnel",
            "Terrasse & jardin",
            "Location de vélos",
            "Randonnée & cyclisme",
            "Bureau d'excursions",
          ].map((x) => (
            <div key={x} className="border-t border-border pt-3">
              <p>{x}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEARBY */}
      <section className="border-t border-border bg-muted/40">
        <div className="container-x py-16">
          <p className="eyebrow">Environs</p>
          <h2 className="mt-3 font-display text-3xl">Excellent emplacement</h2>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex justify-between border-b border-border pb-2">
              <span>Restaurant La Petite Gorge — Todra Gorges, Tinghir</span>
              <span className="text-muted-foreground">2,4 km</span>
            </li>
            <li className="flex justify-between border-b border-border pb-2">
              <span>Café Agdal</span>
              <span className="text-muted-foreground">12 km</span>
            </li>
          </ul>
          <img src={room18.url} alt="" className="mt-10 h-64 w-full object-cover rounded-sm" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
