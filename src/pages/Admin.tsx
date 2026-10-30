import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useData } from "../lib/data-context";
import { ImageUploader } from "../components/admin/image-uploader";
import { ListEditor } from "../components/admin/list-editor";
import { toast } from "sonner";
import {
  Lock,
  LogOut,
  CalendarCheck,
  Mail,
  BedDouble,
  Camera,
  Compass,
  Settings,
  Check,
  X,
  Trash2,
  Inbox,
  Pencil,
  Plus,
  Save,
} from "lucide-react";
import type { Booking } from "../types";

type Tab = "bookings" | "messages" | "rooms" | "gallery" | "excursions" | "settings";

interface RoomRow {
  id: string;
  title: string;
  room_type: string;
  price_mad: number;
  description: string;
  images: string[];
  amenities: string[];
  capacity: number;
  is_available: boolean;
  slug: string | null;
  long_description: string | null;
  beds: string | null;
  size: number | null;
  featured: boolean | null;
}

interface ExcursionRow {
  id: string;
  title: string;
  price_mad: number;
  duration: string;
  description: string;
  details: string[];
  images: string[];
  is_available: boolean;
  sort_order: number;
}

interface GalleryRow {
  id: string;
  title: string;
  category: string;
  image_url: string;
  caption: string;
  sort_order: number;
}

const emptyRoom: RoomRow = {
  id: "",
  title: "",
  room_type: "double",
  price_mad: 0,
  description: "",
  images: [],
  amenities: [],
  capacity: 2,
  is_available: true,
  slug: null,
  long_description: "",
  beds: "",
  size: 0,
  featured: true,
};

const emptyExcursion: ExcursionRow = {
  id: "",
  title: "",
  price_mad: 0,
  duration: "",
  description: "",
  details: [],
  images: [],
  is_available: true,
  sort_order: 99,
};

const GALLERY_CATEGORIES = ["La maison", "Les chambres", "La table & salons", "Salles de bain", "Paysages"];

export default function Admin() {
  const { bookings, contactMessages, refresh, siteSettings } = useData();

  const [session, setSession] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("bookings");

  // Content state (raw DB rows for editing)
  const [roomRows, setRoomRows] = useState<RoomRow[]>([]);
  const [excursionRows, setExcursionRows] = useState<ExcursionRow[]>([]);
  const [galleryRows, setGalleryRows] = useState<GalleryRow[]>([]);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [settingsForm, setSettingsForm] = useState(siteSettings);

  const [editingRoom, setEditingRoom] = useState<RoomRow | null>(null);
  const [editingRoomIsNew, setEditingRoomIsNew] = useState(false);
  const [editingExcursion, setEditingExcursion] = useState<ExcursionRow | null>(null);
  const [editingExcursionIsNew, setEditingExcursionIsNew] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    category: GALLERY_CATEGORIES[0],
    caption: "",
    image_url: "",
  });
  const [busy, setBusy] = useState(false);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const hasSession = Boolean(data.session);
    setSession(hasSession);
    if (hasSession) await refresh();
  }, [refresh]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  const loadContent = useCallback(async () => {
    const [roomsRes, excursionsRes, galleryRes, settingsRes] = await Promise.all([
      supabase.from("rooms").select("*").order("sort_order"),
      supabase.from("excursions").select("*").order("sort_order"),
      supabase.from("gallery_photos").select("*").order("sort_order"),
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    ]);
    setRoomRows((roomsRes.data || []) as RoomRow[]);
    setExcursionRows((excursionsRes.data || []) as ExcursionRow[]);
    setGalleryRows((galleryRes.data || []) as GalleryRow[]);
    if (settingsRes.data) {
      setSettingsId(settingsRes.data.id);
      const row = settingsRes.data as Record<string, unknown>;
      const cleaned = Object.fromEntries(
        Object.entries(row).filter(([, v]) => v != null),
      );
      setSettingsForm({ ...siteSettings, ...cleaned } as typeof siteSettings);
    }
  }, [siteSettings]);

  useEffect(() => {
    if (session) loadContent();
  }, [session, loadContent]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoginError("Email ou mot de passe incorrect.");
      setLoginLoading(false);
    } else {
      await checkSession();
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(false);
    setEmail("");
    setPassword("");
  };

  // ---------- Bookings ----------
  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error("Erreur lors de la mise à jour");
    else {
      toast.success("Réservation mise à jour");
      refresh();
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Supprimer cette réservation ?")) return;
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      toast.success("Réservation supprimée");
      refresh();
    }
  };

  // ---------- Messages ----------
  const deleteMessage = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      toast.success("Message supprimé");
      refresh();
    }
  };

  // ---------- Rooms ----------
  const saveRoom = async () => {
    if (!editingRoom) return;
    if (!editingRoom.title.trim() || !editingRoom.price_mad) {
      toast.error("Titre et prix requis");
      return;
    }
    setBusy(true);
    const payload = {
      title: editingRoom.title.trim(),
      room_type: editingRoom.room_type || "double",
      price_mad: Number(editingRoom.price_mad),
      description: editingRoom.description,
      long_description: editingRoom.long_description,
      beds: editingRoom.beds,
      size: Number(editingRoom.size) || null,
      capacity: Number(editingRoom.capacity) || 2,
      amenities: editingRoom.amenities,
      images: editingRoom.images,
      is_available: editingRoom.is_available,
      featured: editingRoom.featured ?? true,
      slug:
        editingRoom.slug ||
        editingRoom.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    const { error } = editingRoomIsNew
      ? await supabase.from("rooms").insert(payload)
      : await supabase.from("rooms").update(payload).eq("id", editingRoom.id);

    setBusy(false);
    if (error) {
      toast.error("Erreur d'enregistrement");
      return;
    }
    toast.success(editingRoomIsNew ? "Chambre ajoutée" : "Chambre enregistrée");
    setEditingRoom(null);
    setEditingRoomIsNew(false);
    loadContent();
    refresh();
  };

  const toggleRoomAvailability = async (row: RoomRow) => {
    const { error } = await supabase
      .from("rooms")
      .update({ is_available: !row.is_available })
      .eq("id", row.id);
    if (error) toast.error("Erreur");
    else {
      loadContent();
      refresh();
    }
  };

  const deleteRoom = async (id: string) => {
    if (!confirm("Supprimer cette chambre ?")) return;
    const { error } = await supabase.from("rooms").delete().eq("id", id);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      toast.success("Chambre supprimée");
      loadContent();
      refresh();
    }
  };

  // ---------- Excursions ----------
  const saveExcursion = async () => {
    if (!editingExcursion) return;
    if (!editingExcursion.title.trim()) {
      toast.error("Titre requis");
      return;
    }
    setBusy(true);
    const payload = {
      title: editingExcursion.title.trim(),
      price_mad: Number(editingExcursion.price_mad) || 0,
      duration: editingExcursion.duration,
      description: editingExcursion.description,
      details: editingExcursion.details,
      images: editingExcursion.images,
      is_available: editingExcursion.is_available,
      sort_order: Number(editingExcursion.sort_order) || 99,
    };
    const { error } = editingExcursionIsNew
      ? await supabase.from("excursions").insert(payload)
      : await supabase.from("excursions").update(payload).eq("id", editingExcursion.id);

    setBusy(false);
    if (error) {
      toast.error("Erreur d'enregistrement");
      return;
    }
    toast.success(editingExcursionIsNew ? "Excursion ajoutée" : "Excursion enregistrée");
    setEditingExcursion(null);
    setEditingExcursionIsNew(false);
    loadContent();
    refresh();
  };

  const deleteExcursion = async (id: string) => {
    if (!confirm("Supprimer cette excursion ?")) return;
    const { error } = await supabase.from("excursions").delete().eq("id", id);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      toast.success("Excursion supprimée");
      loadContent();
      refresh();
    }
  };

  // ---------- Gallery ----------
  const addPhoto = async () => {
    if (!newPhoto.title.trim() || !newPhoto.image_url) {
      toast.error("Titre et image requis");
      return;
    }
    setBusy(true);
    const sort_order =
      galleryRows.reduce((max, p) => Math.max(max, p.sort_order), 0) + 1;
    const { error } = await supabase.from("gallery_photos").insert({
      title: newPhoto.title.trim(),
      category: newPhoto.category,
      caption: newPhoto.caption,
      image_url: newPhoto.image_url,
      sort_order,
    });
    setBusy(false);
    if (error) {
      toast.error("Erreur lors de l'ajout");
      return;
    }
    toast.success("Photo ajoutée à la galerie");
    setNewPhoto({ title: "", category: GALLERY_CATEGORIES[0], caption: "", image_url: "" });
    loadContent();
    refresh();
  };

  const deletePhoto = async (id: string) => {
    if (!confirm("Supprimer cette photo ?")) return;
    const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
    if (error) toast.error("Erreur lors de la suppression");
    else {
      toast.success("Photo supprimée");
      loadContent();
      refresh();
    }
  };

  // ---------- Settings ----------
  const saveSettings = async () => {
    setBusy(true);
    const payload = { ...settingsForm, updated_at: new Date().toISOString() };
    let error;
    if (settingsId) {
      ({ error } = await supabase.from("site_settings").update(payload).eq("id", settingsId));
    } else {
      const { data, error: insertError } = await supabase
        .from("site_settings")
        .insert(payload)
        .select()
        .single();
      error = insertError;
      if (data) setSettingsId(data.id);
    }
    setBusy(false);
    if (error) {
      toast.error("Erreur d'enregistrement");
      return;
    }
    toast.success("Paramètres enregistrés");
    refresh();
  };

  // ---------- Login screen ----------
  if (session === false) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-6 bg-sand-50">
        <div className="max-w-md w-full">
          <div className="bg-white p-10 rounded-sm shadow-sm border border-sand-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sand-100 text-terracotta-600 mb-4">
                <Lock size={28} />
              </div>
              <h1 className="font-serif text-2xl text-night-900">Espace administration</h1>
              <p className="text-night-400 text-sm mt-2">Auberge Le Festival</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-night-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@aubergelefestival.ma"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-night-700 mb-1.5">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <p className="text-terracotta-600 text-sm bg-terracotta-50 p-3 rounded-sm">{loginError}</p>
              )}

              <button type="submit" disabled={loginLoading} className="btn-primary w-full disabled:opacity-50">
                {loginLoading ? "Connexion…" : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (session === null) {
    return <div className="pt-20 min-h-screen bg-sand-50" />;
  }

  const newBookings = bookings.filter((b) => b.status === "new").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;

  const tabs: { key: Tab; label: string; icon: typeof BedDouble }[] = [
    { key: "bookings", label: "Réservations", icon: CalendarCheck },
    { key: "messages", label: "Messages", icon: Mail },
    { key: "rooms", label: "Chambres", icon: BedDouble },
    { key: "gallery", label: "Galerie", icon: Camera },
    { key: "excursions", label: "Excursions", icon: Compass },
    { key: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="pt-20 min-h-screen bg-sand-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl text-night-900">Tableau de bord</h1>
            <p className="text-night-400 text-sm mt-1">Auberge Le Festival — Administration</p>
          </div>
          <button onClick={handleLogout} className="btn-ghost text-sm">
            <LogOut size={16} className="mr-2" /> Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: CalendarCheck, label: "Réservations", value: bookings.length, color: "text-terracotta-600" },
            { icon: Plus, label: "Nouvelles", value: newBookings, color: "text-oasis-600" },
            { icon: Check, label: "Confirmées", value: confirmedBookings, color: "text-oasis-500" },
            { icon: Mail, label: "Messages", value: contactMessages.length, color: "text-sand-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-5 rounded-sm border border-sand-200">
              <div className="flex items-center justify-between">
                <stat.icon size={22} className={stat.color} />
                <span className="font-serif text-3xl text-night-900">{stat.value}</span>
              </div>
              <p className="text-night-400 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-sand-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-terracotta-600 text-terracotta-600"
                  : "border-transparent text-night-400 hover:text-night-700"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* ============ BOOKINGS ============ */}
        {tab === "bookings" && (
          bookings.length === 0 ? (
            <div className="text-center py-16">
              <Inbox size={48} className="text-night-300 mx-auto mb-4" />
              <p className="text-night-400">Aucune réservation pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((res: Booking) => (
                <div key={res.id} className="bg-white p-6 rounded-sm border border-sand-200">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-serif text-xl text-night-900">{res.guest_name}</h3>
                        <span className="text-xs text-night-400 font-mono">{res.reference}</span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            res.status === "confirmed"
                              ? "bg-oasis-100 text-oasis-700"
                              : res.status === "cancelled"
                              ? "bg-terracotta-100 text-terracotta-700"
                              : "bg-sand-200 text-night-600"
                          }`}
                        >
                          {res.status === "confirmed" ? "Confirmée" : res.status === "cancelled" ? "Annulée" : "Nouvelle"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-night-500 mt-3">
                        <div>
                          <span className="text-night-400 block">Arrivée</span>
                          <span className="text-night-700 font-medium">{res.check_in}</span>
                        </div>
                        <div>
                          <span className="text-night-400 block">Départ ({res.nights} nuits)</span>
                          <span className="text-night-700 font-medium">{res.check_out}</span>
                        </div>
                        <div>
                          <span className="text-night-400 block">Chambre(s)</span>
                          <span className="text-night-700 font-medium">
                            {res.room_selections.map((s) => `${s.title}${s.qty > 1 ? ` ×${s.qty}` : ""}`).join(", ") || "Indifférent"}
                          </span>
                        </div>
                        <div>
                          <span className="text-night-400 block">Total</span>
                          <span className="text-night-700 font-medium">{res.total_mad} MAD</span>
                        </div>
                      </div>
                      <p className="text-sm text-night-500 mt-2">
                        {res.guest_email}
                        {res.guest_phone ? ` · ${res.guest_phone}` : ""}
                        {res.whatsapp ? ` · WhatsApp : ${res.whatsapp}` : ""}
                      </p>
                      <p className="text-xs text-night-400 mt-1">
                        Paiement : {res.payment_method} — {res.payment_status}
                      </p>
                      {res.notes && (
                        <p className="text-sm text-night-500 mt-3 bg-sand-50 p-3 rounded-sm">{res.notes}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {res.status !== "confirmed" && (
                        <button
                          onClick={() => updateBookingStatus(res.id, "confirmed")}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-oasis-500 text-white rounded-sm hover:bg-oasis-600 transition-colors"
                        >
                          <Check size={16} className="mr-1.5" /> Confirmer
                        </button>
                      )}
                      {res.status !== "cancelled" && (
                        <button
                          onClick={() => updateBookingStatus(res.id, "cancelled")}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-terracotta-100 text-terracotta-700 rounded-sm hover:bg-terracotta-200 transition-colors"
                        >
                          <X size={16} className="mr-1.5" /> Annuler
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(res.id)}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-night-400 rounded-sm hover:bg-sand-100 transition-colors"
                      >
                        <Trash2 size={16} className="mr-1.5" /> Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ============ MESSAGES ============ */}
        {tab === "messages" && (
          contactMessages.length === 0 ? (
            <div className="text-center py-16">
              <Inbox size={48} className="text-night-300 mx-auto mb-4" />
              <p className="text-night-400">Aucun message pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contactMessages.map((msg) => (
                <div key={msg.id} className="bg-white p-6 rounded-sm border border-sand-200">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif text-lg text-night-900">{msg.subject}</h3>
                      <p className="text-sm text-night-400 mt-1">
                        De : <span className="text-night-600 font-medium">{msg.name}</span> · {msg.email}
                      </p>
                      <p className="text-night-600 text-sm mt-3 leading-relaxed">{msg.message}</p>
                      <p className="text-xs text-night-300 mt-3">
                        {new Date(msg.created_at).toLocaleString("fr-FR")}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="flex-shrink-0 text-night-400 hover:text-terracotta-600 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ============ ROOMS ============ */}
        {tab === "rooms" && (
          <div>
            {editingRoom ? (
              <div className="bg-white p-8 rounded-sm border border-sand-200 space-y-5">
                <h3 className="font-serif text-xl text-night-900">
                  {editingRoomIsNew ? "Nouvelle chambre" : `Modifier : ${editingRoom.title}`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-night-700 mb-1.5">Titre</label>
                    <input className="input-field" value={editingRoom.title} onChange={(e) => setEditingRoom({ ...editingRoom, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-night-700 mb-1.5">Prix (MAD / nuit)</label>
                    <input type="number" className="input-field" value={editingRoom.price_mad} onChange={(e) => setEditingRoom({ ...editingRoom, price_mad: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-night-700 mb-1.5">Lits</label>
                    <input className="input-field" value={editingRoom.beds || ""} onChange={(e) => setEditingRoom({ ...editingRoom, beds: e.target.value })} placeholder="1 lit double" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-night-700 mb-1.5">Capacité (personnes)</label>
                    <input type="number" className="input-field" value={editingRoom.capacity} onChange={(e) => setEditingRoom({ ...editingRoom, capacity: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-night-700 mb-1.5">Superficie (m²)</label>
                    <input type="number" className="input-field" value={editingRoom.size || 0} onChange={(e) => setEditingRoom({ ...editingRoom, size: Number(e.target.value) })} />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 text-sm text-night-700">
                      <input
                        type="checkbox"
                        checked={editingRoom.is_available}
                        onChange={(e) => setEditingRoom({ ...editingRoom, is_available: e.target.checked })}
                      />
                      Disponible à la réservation
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Description courte</label>
                  <textarea rows={2} className="input-field" value={editingRoom.description} onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Description longue</label>
                  <textarea rows={4} className="input-field" value={editingRoom.long_description || ""} onChange={(e) => setEditingRoom({ ...editingRoom, long_description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Équipements</label>
                  <ListEditor value={editingRoom.amenities} onChange={(v) => setEditingRoom({ ...editingRoom, amenities: v })} placeholder="Ex : Climatisation" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Photos</label>
                  <ImageUploader value={editingRoom.images} onChange={(urls) => setEditingRoom({ ...editingRoom, images: urls })} folder="rooms" />
                </div>
                <div className="flex gap-3">
                  <button onClick={saveRoom} disabled={busy} className="btn-primary disabled:opacity-50">
                    <Save size={16} className="mr-2" /> Enregistrer
                  </button>
                  <button onClick={() => { setEditingRoom(null); setEditingRoomIsNew(false); }} className="btn-ghost">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setEditingRoom({ ...emptyRoom }); setEditingRoomIsNew(true); }}
                  className="btn-primary mb-6"
                >
                  <Plus size={16} className="mr-2" /> Ajouter une chambre
                </button>
                <div className="space-y-4">
                  {roomRows.map((row) => (
                    <div key={row.id} className="bg-white p-5 rounded-sm border border-sand-200 flex flex-col md:flex-row items-start md:items-center gap-4">
                      {row.images?.[0] && (
                        <img src={row.images[0]} alt={row.title} className="w-24 h-16 object-cover rounded-sm" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-night-900">{row.title}</h3>
                        <p className="text-sm text-night-400">
                          {row.price_mad} MAD/nuit · {row.capacity} pers.{row.size ? ` · ${row.size} m²` : ""} · {row.amenities?.length || 0} équipements · {row.images?.length || 0} photo(s)
                        </p>
                      </div>
                      <label className="flex items-center gap-2 text-xs text-night-500">
                        <input
                          type="checkbox"
                          checked={row.is_available}
                          onChange={() => toggleRoomAvailability(row)}
                        />
                        Disponible
                      </label>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingRoom(row); setEditingRoomIsNew(false); }} className="p-2 text-night-400 hover:text-terracotta-600">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteRoom(row.id)} className="p-2 text-night-400 hover:text-terracotta-600">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ============ GALLERY ============ */}
        {tab === "gallery" && (
          <div>
            <div className="bg-white p-8 rounded-sm border border-sand-200 mb-8 space-y-5">
              <h3 className="font-serif text-xl text-night-900">Ajouter une photo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Titre</label>
                  <input className="input-field" value={newPhoto.title} onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Catégorie</label>
                  <select className="input-field" value={newPhoto.category} onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}>
                    {GALLERY_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Légende</label>
                  <input className="input-field" value={newPhoto.caption} onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-night-700 mb-1.5">Image</label>
                <ImageUploader
                  value={newPhoto.image_url ? [newPhoto.image_url] : []}
                  onChange={(urls) => setNewPhoto({ ...newPhoto, image_url: urls[urls.length - 1] || "" })}
                  folder="gallery"
                />
              </div>
              <button onClick={addPhoto} disabled={busy} className="btn-primary disabled:opacity-50">
                <Plus size={16} className="mr-2" /> Ajouter à la galerie
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryRows.map((photo) => (
                <div key={photo.id} className="bg-white rounded-sm border border-sand-200 overflow-hidden">
                  <div className="relative aspect-square">
                    <img src={photo.image_url} alt={photo.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="absolute top-2 right-2 rounded-full bg-white/90 p-2 text-night-500 hover:text-terracotta-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-night-900">{photo.title}</p>
                    <p className="text-xs text-night-400">{photo.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============ EXCURSIONS ============ */}
        {tab === "excursions" && (
          <div>
            {editingExcursion ? (
              <div className="bg-white p-8 rounded-sm border border-sand-200 space-y-5">
                <h3 className="font-serif text-xl text-night-900">
                  {editingExcursionIsNew ? "Nouvelle excursion" : `Modifier : ${editingExcursion.title}`}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-night-700 mb-1.5">Titre</label>
                    <input className="input-field" value={editingExcursion.title} onChange={(e) => setEditingExcursion({ ...editingExcursion, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-night-700 mb-1.5">Prix (MAD / personne)</label>
                    <input type="number" className="input-field" value={editingExcursion.price_mad} onChange={(e) => setEditingExcursion({ ...editingExcursion, price_mad: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-night-700 mb-1.5">Durée</label>
                    <input className="input-field" value={editingExcursion.duration} onChange={(e) => setEditingExcursion({ ...editingExcursion, duration: e.target.value })} placeholder="Demi-journée" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Description</label>
                  <textarea rows={3} className="input-field" value={editingExcursion.description} onChange={(e) => setEditingExcursion({ ...editingExcursion, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Détails / itinéraire</label>
                  <ListEditor value={editingExcursion.details} onChange={(v) => setEditingExcursion({ ...editingExcursion, details: v })} placeholder="Ex : Départ à 8h" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">Photos</label>
                  <ImageUploader value={editingExcursion.images} onChange={(urls) => setEditingExcursion({ ...editingExcursion, images: urls })} folder="excursions" />
                </div>
                <label className="flex items-center gap-2 text-sm text-night-700">
                  <input
                    type="checkbox"
                    checked={editingExcursion.is_available}
                    onChange={(e) => setEditingExcursion({ ...editingExcursion, is_available: e.target.checked })}
                  />
                  Proposée aux visiteurs
                </label>
                <div className="flex gap-3">
                  <button onClick={saveExcursion} disabled={busy} className="btn-primary disabled:opacity-50">
                    <Save size={16} className="mr-2" /> Enregistrer
                  </button>
                  <button onClick={() => { setEditingExcursion(null); setEditingExcursionIsNew(false); }} className="btn-ghost">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setEditingExcursion({ ...emptyExcursion }); setEditingExcursionIsNew(true); }}
                  className="btn-primary mb-6"
                >
                  <Plus size={16} className="mr-2" /> Ajouter une excursion
                </button>
                <div className="space-y-4">
                  {excursionRows.map((row) => (
                    <div key={row.id} className="bg-white p-5 rounded-sm border border-sand-200 flex flex-col md:flex-row items-start md:items-center gap-4">
                      {row.images?.[0] && (
                        <img src={row.images[0]} alt={row.title} className="w-24 h-16 object-cover rounded-sm" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-serif text-lg text-night-900">{row.title}</h3>
                        <p className="text-sm text-night-400">
                          {row.price_mad} MAD/personne{row.duration ? ` · ${row.duration}` : ""} · {row.details?.length || 0} étapes
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${row.is_available ? "bg-oasis-100 text-oasis-700" : "bg-sand-200 text-night-500"}`}>
                        {row.is_available ? "Proposée" : "Masquée"}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingExcursion(row); setEditingExcursionIsNew(false); }} className="p-2 text-night-400 hover:text-terracotta-600">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => deleteExcursion(row.id)} className="p-2 text-night-400 hover:text-terracotta-600">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ============ SETTINGS ============ */}
        {tab === "settings" && (
          <div className="bg-white p-8 rounded-sm border border-sand-200 space-y-5 max-w-2xl">
            <h3 className="font-serif text-xl text-night-900">Contact & réseaux sociaux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {([
                ["whatsapp", "Numéro WhatsApp"],
                ["phone", "Téléphone"],
                ["email", "Email"],
                ["address", "Adresse"],
                ["instagram_url", "Lien Instagram"],
                ["facebook_url", "Lien Facebook"],
                ["tripadvisor_url", "Lien TripAdvisor"],
              ] as const).map(([field, label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">{label}</label>
                  <input
                    className="input-field"
                    value={settingsForm[field] || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, [field]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-night-700 mb-1.5">Texte de présentation</label>
              <textarea
                rows={3}
                className="input-field"
                value={settingsForm.intro_text || ""}
                onChange={(e) => setSettingsForm({ ...settingsForm, intro_text: e.target.value })}
              />
            </div>
            <p className="text-xs text-night-400">
              Ces informations s'affichent instantanément sur les pages Contact, le pied de page et les boutons WhatsApp du site.
            </p>
            <button onClick={saveSettings} disabled={busy} className="btn-primary disabled:opacity-50">
              <Save size={16} className="mr-2" /> Enregistrer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
