import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Save, Trash2, Plus, Home, Mountain, Settings as SettingsIcon, CalendarDays, ExternalLink } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { ListEditor } from "@/components/admin/list-editor";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Auberge Le Festival" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "bookings" | "rooms" | "excursions" | "settings";

type Room = {
  id: string;
  title: string;
  room_type: string;
  price_mad: number;
  capacity: number;
  description: string | null;
  amenities: string[];
  images: string[];
  is_available: boolean;
  sort_order: number;
};

type Excursion = {
  id: string;
  title: string;
  price_mad: number;
  duration: string | null;
  description: string | null;
  details: string[];
  images: string[];
  is_available: boolean;
  sort_order: number;
};

type Booking = {
  id: string;
  reference: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  whatsapp: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  room_selections: unknown;
  total_mad: number;
  payment_method: string;
  payment_status: string;
  status: string;
  notes: string | null;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("bookings");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "bookings", label: "Réservations", icon: <CalendarDays className="w-4 h-4" /> },
    { key: "rooms", label: "Chambres", icon: <Home className="w-4 h-4" /> },
    { key: "excursions", label: "Excursions", icon: <Mountain className="w-4 h-4" /> },
    { key: "settings", label: "Contact & Paramètres", icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container-x flex items-center justify-between py-4">
          <div>
            <p className="eyebrow">Admin</p>
            <p className="font-display text-xl text-foreground">Auberge Le Festival</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              Voir le site <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-xs text-muted-foreground hidden sm:inline">{email}</span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-input px-3 py-1.5 text-xs hover:bg-accent/40"
            >
              <LogOut className="w-3.5 h-3.5" /> Déconnexion
            </button>
          </div>
        </div>
        <div className="container-x flex gap-1 overflow-x-auto pb-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm whitespace-nowrap ${
                tab === t.key
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="container-x py-8">
        {tab === "bookings" && <BookingsTab />}
        {tab === "rooms" && <RoomsTab />}
        {tab === "excursions" && <ExcursionsTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

/* ─────────── Bookings ─────────── */

function BookingsTab() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as Booking[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("bookings-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [load]);

  async function updateBooking(id: string, patch: { status?: string; payment_status?: string }) {
    const { error } = await supabase.from("bookings").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Mis à jour");
  }

  async function del(id: string) {
    if (!confirm("Supprimer cette réservation ?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Supprimé");
  }

  if (loading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-2xl">Réservations</h2>
        <p className="text-sm text-muted-foreground">{rows.length} au total</p>
      </div>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
          Aucune réservation pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{b.reference}</p>
                  <p className="font-medium">{b.guest_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.guest_email}
                    {b.guest_phone && ` · ${b.guest_phone}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl">{b.total_mad} MAD</p>
                  <p className="text-xs text-muted-foreground">
                    {b.check_in} → {b.check_out} · {b.nights} nuit(s)
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={b.status}
                  onChange={(e) => updateBooking(b.id, { status: e.target.value })}
                  className="rounded-md border border-input bg-background px-2 py-1"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="cancelled">Annulée</option>
                  <option value="completed">Terminée</option>
                </select>
                <select
                  value={b.payment_status}
                  onChange={(e) => updateBooking(b.id, { payment_status: e.target.value })}
                  className="rounded-md border border-input bg-background px-2 py-1"
                >
                  <option value="pending">Paiement en attente</option>
                  <option value="paid">Payé</option>
                  <option value="refunded">Remboursé</option>
                  <option value="failed">Échec</option>
                </select>
                <span className="rounded-md bg-accent/60 px-2 py-1">
                  {b.payment_method === "card" ? "Carte" : "PayPal"}
                </span>
                {b.whatsapp && (
                  <a
                    href={`https://wa.me/${b.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-input px-2 py-1 hover:bg-accent/40"
                  >
                    WhatsApp
                  </a>
                )}
                <button
                  onClick={() => del(b.id)}
                  className="ml-auto rounded-md text-destructive hover:bg-destructive/10 px-2 py-1 inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
              {b.notes && <p className="mt-2 text-xs italic text-muted-foreground">« {b.notes} »</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────── Rooms ─────────── */

const EMPTY_ROOM: Omit<Room, "id"> = {
  title: "",
  room_type: "double",
  price_mad: 0,
  capacity: 2,
  description: "",
  amenities: [],
  images: [],
  is_available: true,
  sort_order: 0,
};

function RoomsTab() {
  const [rows, setRows] = useState<Room[]>([]);
  const [editing, setEditing] = useState<Room | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("rooms").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setRows((data ?? []) as Room[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(r: Room) {
    const { id, ...rest } = r;
    const payload = { ...rest, description: rest.description ?? "" };
    if (id) {
      const { error } = await supabase.from("rooms").update(payload).eq("id", id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("rooms").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success("Enregistré");
    setEditing(null);
    load();
  }

  async function del(id: string) {
    if (!confirm("Supprimer cette chambre ?")) return;
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Supprimée");
    load();
  }

  if (editing) {
    return (
      <RoomForm
        room={editing}
        onCancel={() => setEditing(null)}
        onSave={save}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-2xl">Chambres</h2>
        <button
          onClick={() => setEditing({ id: "", ...EMPTY_ROOM })}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Ajouter une chambre
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card overflow-hidden flex">
            <div className="w-32 h-32 bg-muted flex-shrink-0">
              {r.images[0] && <img src={r.images[0]} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.price_mad} MAD · {r.capacity} pers.</p>
                </div>
                <span className={`text-xs rounded-full px-2 py-0.5 ${r.is_available ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                  {r.is_available ? "Actif" : "Off"}
                </span>
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <button onClick={() => setEditing(r)} className="rounded-md border border-input px-2 py-1 hover:bg-accent/40">Modifier</button>
                <button onClick={() => del(r.id)} className="rounded-md text-destructive hover:bg-destructive/10 px-2 py-1 inline-flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Suppr.
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoomForm({ room, onCancel, onSave }: { room: Room; onCancel: () => void; onSave: (r: Room) => void }) {
  const [r, setR] = useState<Room>(room);
  return (
    <div className="max-w-3xl">
      <button onClick={onCancel} className="mb-4 text-sm text-muted-foreground hover:text-foreground">← Retour</button>
      <h2 className="font-display text-2xl mb-6">{room.id ? "Modifier" : "Nouvelle"} chambre</h2>
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <Field label="Titre">
          <input value={r.title} onChange={(e) => setR({ ...r, title: e.target.value })} className="input" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Type">
            <input value={r.room_type} onChange={(e) => setR({ ...r, room_type: e.target.value })} className="input" placeholder="double, familiale…" />
          </Field>
          <Field label="Prix / nuit (MAD)">
            <input type="number" value={r.price_mad} onChange={(e) => setR({ ...r, price_mad: Number(e.target.value) })} className="input" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Capacité">
            <input type="number" value={r.capacity} onChange={(e) => setR({ ...r, capacity: Number(e.target.value) })} className="input" />
          </Field>
          <Field label="Ordre d'affichage">
            <input type="number" value={r.sort_order} onChange={(e) => setR({ ...r, sort_order: Number(e.target.value) })} className="input" />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={r.description ?? ""} onChange={(e) => setR({ ...r, description: e.target.value })} className="input min-h-24" />
        </Field>
        <Field label="Équipements">
          <ListEditor value={r.amenities} onChange={(amenities) => setR({ ...r, amenities })} placeholder="Wi-Fi, Climatisation…" />
        </Field>
        <Field label="Photos">
          <ImageUploader value={r.images} onChange={(images) => setR({ ...r, images })} folder="rooms" />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={r.is_available} onChange={(e) => setR({ ...r, is_available: e.target.checked })} />
          Disponible / afficher sur le site
        </label>
        <div className="flex gap-3">
          <button onClick={() => onSave(r)} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90">
            <Save className="w-4 h-4" /> Enregistrer
          </button>
          <button onClick={onCancel} className="rounded-full border border-input px-5 py-2 text-sm hover:bg-accent/40">Annuler</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Excursions ─────────── */

const EMPTY_EXC: Omit<Excursion, "id"> = {
  title: "",
  price_mad: 0,
  duration: "",
  description: "",
  details: [],
  images: [],
  is_available: true,
  sort_order: 0,
};

function ExcursionsTab() {
  const [rows, setRows] = useState<Excursion[]>([]);
  const [editing, setEditing] = useState<Excursion | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("excursions").select("*").order("sort_order");
    if (error) toast.error(error.message);
    setRows((data ?? []) as Excursion[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(x: Excursion) {
    const { id, ...rest } = x;
    const payload = { ...rest, description: rest.description ?? "", duration: rest.duration ?? "" };
    if (id) {
      const { error } = await supabase.from("excursions").update(payload).eq("id", id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("excursions").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success("Enregistré");
    setEditing(null);
    load();
  }

  async function del(id: string) {
    if (!confirm("Supprimer cette excursion ?")) return;
    const { error } = await supabase.from("excursions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  if (editing) {
    return (
      <div className="max-w-3xl">
        <button onClick={() => setEditing(null)} className="mb-4 text-sm text-muted-foreground hover:text-foreground">← Retour</button>
        <h2 className="font-display text-2xl mb-6">{editing.id ? "Modifier" : "Nouvelle"} excursion</h2>
        <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
          <Field label="Titre">
            <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prix (MAD)">
              <input type="number" value={editing.price_mad} onChange={(e) => setEditing({ ...editing, price_mad: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Durée">
              <input value={editing.duration ?? ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} className="input" placeholder="Demi-journée, 2h…" />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="input min-h-24" />
          </Field>
          <Field label="Programme / Détails">
            <ListEditor value={editing.details} onChange={(details) => setEditing({ ...editing, details })} placeholder="Ex : Départ 9h de l'auberge…" />
          </Field>
          <Field label="Photos">
            <ImageUploader value={editing.images} onChange={(images) => setEditing({ ...editing, images })} folder="excursions" />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.is_available} onChange={(e) => setEditing({ ...editing, is_available: e.target.checked })} />
            Disponible / afficher sur le site
          </label>
          <Field label="Ordre">
            <input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className="input w-24" />
          </Field>
          <div className="flex gap-3">
            <button onClick={() => save(editing)} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90">
              <Save className="w-4 h-4" /> Enregistrer
            </button>
            <button onClick={() => setEditing(null)} className="rounded-full border border-input px-5 py-2 text-sm hover:bg-accent/40">Annuler</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-2xl">Excursions</h2>
        <button
          onClick={() => setEditing({ id: "", ...EMPTY_EXC })}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card overflow-hidden flex">
            <div className="w-32 h-32 bg-muted flex-shrink-0">
              {r.images[0] && <img src={r.images[0]} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.price_mad} MAD · {r.duration}</p>
                </div>
                <span className={`text-xs rounded-full px-2 py-0.5 ${r.is_available ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"}`}>
                  {r.is_available ? "Actif" : "Off"}
                </span>
              </div>
              <div className="mt-3 flex gap-2 text-xs">
                <button onClick={() => setEditing(r)} className="rounded-md border border-input px-2 py-1 hover:bg-accent/40">Modifier</button>
                <button onClick={() => del(r.id)} className="rounded-md text-destructive hover:bg-destructive/10 px-2 py-1 inline-flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Suppr.
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Settings ─────────── */

type Settings = {
  id?: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  tripadvisor_url: string;
  booking_url: string;
  intro_text: string;
};

function SettingsTab() {
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        const empty: Settings = {
          whatsapp: "",
          phone: "",
          email: "",
          address: "",
          instagram_url: "",
          facebook_url: "",
          tripadvisor_url: "",
          booking_url: "",
          intro_text: "",
        };
        if (data) {
          const cleaned = Object.fromEntries(
            Object.entries(data).map(([k, v]) => [k, v ?? ""]),
          ) as Partial<Settings> & { id?: string };
          setS({ ...empty, ...cleaned });
        } else {
          setS(empty);
        }
      });
  }, []);

  async function save() {
    if (!s) return;
    const { id, ...rest } = s;
    if (id) {
      const { error } = await supabase.from("site_settings").update(rest).eq("id", id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("site_settings").insert(rest);
      if (error) return toast.error(error.message);
    }
    toast.success("Paramètres enregistrés");
  }

  if (!s) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-2xl mb-6">Contact & Paramètres</h2>
      <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
        <Field label="WhatsApp (avec indicatif)"><input value={s.whatsapp} onChange={(e) => setS({ ...s, whatsapp: e.target.value })} className="input" placeholder="+212661234567" /></Field>
        <Field label="Téléphone"><input value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} className="input" /></Field>
        <Field label="Email de réservation"><input value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} className="input" /></Field>
        <Field label="Adresse"><input value={s.address} onChange={(e) => setS({ ...s, address: e.target.value })} className="input" /></Field>
        <Field label="Instagram"><input value={s.instagram_url} onChange={(e) => setS({ ...s, instagram_url: e.target.value })} className="input" placeholder="https://…" /></Field>
        <Field label="Facebook"><input value={s.facebook_url} onChange={(e) => setS({ ...s, facebook_url: e.target.value })} className="input" placeholder="https://…" /></Field>
        <Field label="TripAdvisor"><input value={s.tripadvisor_url} onChange={(e) => setS({ ...s, tripadvisor_url: e.target.value })} className="input" placeholder="https://…" /></Field>
        <Field label="Booking.com"><input value={s.booking_url} onChange={(e) => setS({ ...s, booking_url: e.target.value })} className="input" placeholder="https://…" /></Field>
        <Field label="Message d'introduction (accueil)">
          <textarea value={s.intro_text} onChange={(e) => setS({ ...s, intro_text: e.target.value })} className="input min-h-24" />
        </Field>
        <button onClick={save} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90">
          <Save className="w-4 h-4" /> Enregistrer
        </button>
      </div>
    </div>
  );
}

/* ─────────── UI helpers ─────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}
