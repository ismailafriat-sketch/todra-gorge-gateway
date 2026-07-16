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

/* ────────────────────────────────────────────────────────────────────────────
   ⚙️  BOOKING CONFIG — édite ici pour mettre à jour la disponibilité
   ──────────────────────────────────────────────────────────────────────────── */
const BOOKING_CONFIG: {
  openFrom: string;
  openUntil: string;
  minNights: number;
  maxNights: number;
  blockedDates: string[];
} = {
  // Première date où l'auberge accepte des réservations (YYYY-MM-DD)
  openFrom: "2026-07-15",
  // Dernière date de départ acceptée
  openUntil: "2027-12-31",
  // Durée du séjour
  minNights: 1,
  maxNights: 21,
  // Dates complètes / indisponibles — YYYY-MM-DD
  blockedDates: [
    // "2026-08-14",
  ],
};

type PaymentMethod = "card" | "paypal";
/* ──────────────────────────────────────────────────────────────────────────── */


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
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};
const parseISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const nightsBetween = (a: string, b: string) =>
  Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / 86400000);
const dateLabel = (s: string) =>
  parseISO(s).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

type Step = "select" | "checkout" | "receipt";

function Reservation() {
  const today = useMemo(() => {
    const t = new Date();
    const openFrom = parseISO(BOOKING_CONFIG.openFrom);
    return iso(t < openFrom ? openFrom : t);
  }, []);
  const defaultOut = useMemo(() => iso(addDays(parseISO(today), 1)), [today]);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(defaultOut);
  const [filter, setFilter] = useState<"tous" | "chambres" | "appartements">("tous");
  const [sel, setSel] = useState<Record<string, number>>({});
  const [step, setStep] = useState<Step>("select");

  // Guest / payment
  const [guest, setGuest] = useState({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [confirmation, setConfirmation] = useState<null | {
    ref: string;
    when: string;
  }>(null);


  const nights = Math.max(0, nightsBetween(checkIn, checkOut));
  const isBlocked = BOOKING_CONFIG.blockedDates.includes(checkIn);
  const validDates =
    checkOut > checkIn &&
    nights >= BOOKING_CONFIG.minNights &&
    nights <= BOOKING_CONFIG.maxNights &&
    !isBlocked;

  const setQty = (key: string, qty: number) => setSel((s) => ({ ...s, [key]: qty }));

  const visible = rooms.filter((r) => {
    if (filter === "tous") return true;
    if (filter === "appartements") return r.id.startsWith("appartement");
    return !r.id.startsWith("appartement");
  });

  const perNight = rooms.reduce((sum, r) => {
    r.options.forEach((o, i) => {
      sum += (sel[`${r.id}:${i}`] ?? 0) * o.price;
    });
    return sum;
  }, 0);
  const total = perNight * nights;
  const totalRooms = Object.values(sel).reduce((a, b) => a + b, 0);

  const selectedLines = rooms.flatMap((r) =>
    r.options
      .map((o, i) => ({ r, o, i, qty: sel[`${r.id}:${i}`] ?? 0 }))
      .filter((l) => l.qty > 0),
  );

  const cardValid =
    card.number.replace(/\s/g, "").length >= 13 &&
    card.name.trim().length > 1 &&
    /^\d{2}\/\d{2}$/.test(card.expiry) &&
    /^\d{3,4}$/.test(card.cvc);

  const canConfirm =
    validDates &&
    totalRooms > 0 &&
    !!guest.firstName.trim() &&
    !!guest.lastName.trim() &&
    !!guest.email.trim() &&
    !!guest.phone.trim() &&
    (payment === "paypal" || cardValid);


  const goCheckout = () => {
    if (!validDates || totalRooms === 0) return;
    setStep("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const confirmBooking = () => {
    if (!canConfirm) return;
    const ref = "AF-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setConfirmation({ ref, when: new Date().toLocaleString("fr-FR") });
    setStep("receipt");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const resetAll = () => {
    setSel({});
    setConfirmation(null);
    setStep("select");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ═══════════════════════════ RECEIPT ═══════════════════════════ */
  if (step === "receipt" && confirmation) {
    const paymentLabel =
      payment === "paypal"
        ? "PayPal"
        : `Carte bancaire •••• ${card.number.replace(/\s/g, "").slice(-4)}`;

    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <section className="bg-ink pt-32 pb-10 text-primary-foreground">
          <div className="container-x">
            <p className="eyebrow text-accent">Confirmation</p>
            <h1 className="mt-3 font-display text-4xl md:text-6xl">Merci, votre demande est enregistrée</h1>
            <p className="mt-3 text-sm text-primary-foreground/70">
              Un email de confirmation sera envoyé à {guest.email}.
            </p>
          </div>
        </section>

        <section className="container-x py-14">
          <div className="mx-auto max-w-3xl border border-border rounded-sm bg-card p-8 print:border-0 print:p-0">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="font-display text-2xl">Auberge Le Festival</p>
                <p className="text-xs text-muted-foreground">Gorges du Todra · Tinghir, Maroc</p>
                <p className="text-xs text-muted-foreground">+212 673 45 43 07</p>
              </div>
              <div className="text-right text-sm">
                <p className="eyebrow">Reçu</p>
                <p className="font-mono">{confirmation.ref}</p>
                <p className="text-xs text-muted-foreground">{confirmation.when}</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 py-6 border-b border-border">
              <div>
                <p className="eyebrow">Client</p>
                <p className="mt-2 text-sm">{guest.firstName} {guest.lastName}</p>
                <p className="text-sm text-muted-foreground">{guest.email}</p>
                <p className="text-sm text-muted-foreground">{guest.phone}</p>
              </div>
              <div>
                <p className="eyebrow">Séjour</p>
                <p className="mt-2 text-sm">Arrivée · {dateLabel(checkIn)}</p>
                <p className="text-sm">Départ · {dateLabel(checkOut)}</p>
                <p className="text-sm text-muted-foreground">{nights} nuit{nights > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="py-6 border-b border-border">
              <p className="eyebrow">Détail</p>
              <table className="mt-3 w-full text-sm">
                <thead className="text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="py-2">Hébergement</th>
                    <th>Qté</th>
                    <th>Nuits</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLines.map((l) => (
                    <tr key={`${l.r.id}:${l.i}`} className="border-t border-border">
                      <td className="py-2">
                        <p>{l.r.name}</p>
                        <p className="text-xs text-muted-foreground">{l.o.label}</p>
                      </td>
                      <td>{l.qty}</td>
                      <td>{nights}</td>
                      <td className="text-right">{fmt(l.qty * l.o.price * nights)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border">
                    <td colSpan={3} className="pt-3 text-right text-sm">Total (taxes comprises)</td>
                    <td className="pt-3 text-right font-display text-2xl text-clay">{fmt(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="py-6">
              <p className="eyebrow">Paiement</p>
              <p className="mt-2 text-sm">{paymentLabel}</p>
              {guest.notes && (
                <>
                  <p className="eyebrow mt-6">Notes</p>
                  <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{guest.notes}</p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm hover:bg-primary/90"
              >
                Imprimer / PDF
              </button>
              <button
                onClick={resetAll}
                className="rounded-full border border-input px-6 py-3 text-sm hover:bg-accent/40"
              >
                Nouvelle réservation
              </button>
              <Link to="/" className="rounded-full border border-input px-6 py-3 text-sm hover:bg-accent/40">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </section>
        <SiteFooter />
      </div>
    );
  }

  /* ═══════════════════════════ CHECKOUT ═══════════════════════════ */
  if (step === "checkout") {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <section className="bg-ink pt-32 pb-10 text-primary-foreground">
          <div className="container-x">
            <p className="eyebrow text-accent">Étape 2 / 2</p>
            <h1 className="mt-3 font-display text-4xl md:text-6xl">Vos informations & paiement</h1>
          </div>
        </section>

        <section className="container-x py-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7 space-y-8">
            <div>
              <p className="eyebrow">Coordonnées</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Prénom" value={guest.firstName} onChange={(v) => setGuest({ ...guest, firstName: v })} />
                <Field label="Nom" value={guest.lastName} onChange={(v) => setGuest({ ...guest, lastName: v })} />
                <Field label="Email" type="email" value={guest.email} onChange={(v) => setGuest({ ...guest, email: v })} />
                <Field label="Téléphone" type="tel" value={guest.phone} onChange={(v) => setGuest({ ...guest, phone: v })} />
              </div>
              <div className="mt-4">
                <label className="block text-xs text-muted-foreground mb-1">Notes (optionnel)</label>
                <textarea
                  value={guest.notes}
                  onChange={(e) => setGuest({ ...guest, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Heure d'arrivée approximative, demandes particulières…"
                />
              </div>
            </div>

            <div>
              <p className="eyebrow">Moyen de paiement</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPayment("card")}
                  className={`flex items-center justify-between rounded-sm border p-4 text-left transition ${
                    payment === "card" ? "border-clay bg-clay/5" : "border-border hover:bg-accent/30"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">Carte bancaire</p>
                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                  </div>
                  <div className="flex gap-1 text-[10px] font-semibold">
                    <span className="rounded bg-[#1a1f71] text-white px-1.5 py-0.5">VISA</span>
                    <span className="rounded bg-[#eb001b] text-white px-1.5 py-0.5">MC</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPayment("paypal")}
                  className={`flex items-center justify-between rounded-sm border p-4 text-left transition ${
                    payment === "paypal" ? "border-clay bg-clay/5" : "border-border hover:bg-accent/30"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium">PayPal</p>
                    <p className="text-xs text-muted-foreground">Payez avec votre compte PayPal</p>
                  </div>
                  <span className="rounded bg-[#003087] text-white px-2 py-0.5 text-[11px] font-bold">
                    Pay<span className="text-[#009cde]">Pal</span>
                  </span>
                </button>
              </div>

              {payment === "card" && (
                <div className="mt-4 grid gap-4 rounded-sm border border-border p-4 bg-muted/30">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Numéro de carte</label>
                    <input
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 19);
                        const spaced = digits.replace(/(.{4})/g, "$1 ").trim();
                        setCard({ ...card, number: spaced });
                      }}
                      className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Nom sur la carte</label>
                    <input
                      autoComplete="cc-name"
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                      className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Expiration (MM/AA)</label>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/AA"
                        value={card.expiry}
                        onChange={(e) => {
                          const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                          const v = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
                          setCard({ ...card, expiry: v });
                        }}
                        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">CVC</label>
                      <input
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        value={card.cvc}
                        onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    🔒 Vos informations sont transmises de manière sécurisée. Aucun débit avant votre arrivée sauf tarif non-remboursable.
                  </p>
                </div>
              )}

              {payment === "paypal" && (
                <div className="mt-4 rounded-sm border border-border p-4 bg-muted/30 text-sm">
                  <p>Vous serez redirigé vers PayPal pour finaliser le paiement en toute sécurité après avoir cliqué sur « Confirmer ».</p>
                </div>
              )}
            </div>


            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStep("select")}
                className="rounded-full border border-input px-6 py-3 text-sm hover:bg-accent/40"
              >
                ← Modifier la sélection
              </button>
              <button
                onClick={confirmBooking}
                disabled={!canConfirm}
                className={`rounded-full px-6 py-3 text-sm font-medium transition ${
                  canConfirm
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Confirmer la réservation · {fmt(total)}
              </button>
            </div>
          </div>

          <aside className="md:col-span-5">
            <div className="sticky top-24 rounded-sm border border-border bg-card p-6">
              <p className="eyebrow">Récapitulatif</p>
              <p className="mt-3 text-sm">
                {dateLabel(checkIn)} → {dateLabel(checkOut)}
              </p>
              <p className="text-xs text-muted-foreground">
                {nights} nuit{nights > 1 ? "s" : ""} · {totalRooms} chambre{totalRooms > 1 ? "s" : ""}
              </p>
              <ul className="mt-4 divide-y divide-border text-sm">
                {selectedLines.map((l) => (
                  <li key={`${l.r.id}:${l.i}`} className="py-3 flex justify-between gap-3">
                    <div>
                      <p>{l.r.name} × {l.qty}</p>
                      <p className="text-xs text-muted-foreground">{l.o.label}</p>
                    </div>
                    <p className="whitespace-nowrap">{fmt(l.qty * l.o.price * nights)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="text-sm">Total</span>
                <span className="font-display text-2xl text-clay">{fmt(total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Taxes et frais compris</p>
            </div>
          </aside>
        </section>
        <SiteFooter />
      </div>
    );
  }

  /* ═══════════════════════════ SELECT ═══════════════════════════ */
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="bg-ink pt-32 pb-10 text-primary-foreground">
        <div className="container-x">
          <p className="eyebrow text-accent">Étape 1 / 2 · Disponibilité</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">Choisissez vos dates & vos chambres</h1>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Tarifs en MAD · Taxes et frais compris · Minimum {BOOKING_CONFIG.minNights} nuit
          </p>
        </div>
      </section>

      {/* DATE PICKER */}
      <section className="border-b border-border bg-muted/40">
        <div className="container-x grid gap-4 py-6 md:grid-cols-4 items-end">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Arrivée</label>
            <input
              type="date"
              value={checkIn}
              min={BOOKING_CONFIG.openFrom}
              max={BOOKING_CONFIG.openUntil}
              onChange={(e) => {
                const v = e.target.value;
                setCheckIn(v);
                if (parseISO(checkOut) <= parseISO(v)) setCheckOut(iso(addDays(parseISO(v), 1)));
              }}
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Départ</label>
            <input
              type="date"
              value={checkOut}
              min={iso(addDays(parseISO(checkIn), BOOKING_CONFIG.minNights))}
              max={BOOKING_CONFIG.openUntil}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="text-sm">
            <p className="text-xs text-muted-foreground">Durée</p>
            <p className="font-display text-2xl mt-0.5">
              {nights} nuit{nights > 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-sm">
            {isBlocked && <p className="text-clay">Cette date d'arrivée n'est pas disponible.</p>}
            {!isBlocked && nights < BOOKING_CONFIG.minNights && (
              <p className="text-clay">Minimum {BOOKING_CONFIG.minNights} nuit.</p>
            )}
            {!isBlocked && nights > BOOKING_CONFIG.maxNights && (
              <p className="text-clay">Maximum {BOOKING_CONFIG.maxNights} nuits.</p>
            )}
            {validDates && <p className="text-muted-foreground">2 adultes · 0 enfant</p>}
          </div>
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
                const lineTotal = qty * o.price * Math.max(1, nights);
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
                      <p className="mt-1 text-xs text-muted-foreground">par nuit · taxes comprises</p>
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
                            {n} {n > 0 ? `(${fmt(n * o.price * Math.max(1, nights))} / ${Math.max(1, nights)} n)` : ""}
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
              {totalRooms} chambre{totalRooms > 1 ? "s" : ""} · {nights} nuit{nights > 1 ? "s" : ""} · taxes comprises
            </p>
            <p className="font-display text-2xl text-clay">{fmt(total)}</p>
          </div>
          <button
            onClick={goCheckout}
            disabled={!validDates || totalRooms === 0}
            className={`ml-auto rounded-full px-6 py-3 text-sm font-medium transition ${
              validDates && totalRooms > 0
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Continuer vers le paiement
          </button>
          <Link
            to="/contact"
            className="rounded-full border border-input px-6 py-3 text-sm hover:bg-accent/40"
          >
            Écrire
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
