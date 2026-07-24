import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Reservation, ContactMessage } from "../types";
import { images } from "../lib/images";
import {
  Lock,
  LogOut,
  CalendarCheck,
  Mail,
  BedDouble,
  TrendingUp,
  Check,
  X,
  Clock,
  Trash2,
  Inbox,
} from "lucide-react";

export default function Admin() {
  const [session, setSession] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [tab, setTab] = useState<"reservations" | "messages">("reservations");
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setSession(true);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError("Email ou mot de passe incorrect.");
      setLoginLoading(false);
    } else {
      setSession(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(false);
    setEmail("");
    setPassword("");
  };

  const loadData = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const [{ data: resData }, { data: msgData }] = await Promise.all([
      supabase.from("reservations").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    setReservations(resData || []);
    setMessages(msgData || []);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateReservationStatus = async (id: string, status: "confirmed" | "cancelled" | "pending") => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await supabase.from("reservations").update({ status }).eq("id", id);
  };

  const deleteReservation = async (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
    await supabase.from("reservations").delete().eq("id", id);
  };

  const deleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase.from("contact_messages").delete().eq("id", id);
  };

  if (!session) {
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

  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;

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
            { icon: CalendarCheck, label: "Réservations", value: reservations.length, color: "text-terracotta-600" },
            { icon: Clock, label: "En attente", value: pendingCount, color: "text-oasis-600" },
            { icon: Check, label: "Confirmées", value: confirmedCount, color: "text-oasis-500" },
            { icon: Mail, label: "Messages", value: messages.length, color: "text-sand-600" },
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
        <div className="flex gap-2 mb-6 border-b border-sand-200">
          <button
            onClick={() => setTab("reservations")}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "reservations" ? "border-terracotta-600 text-terracotta-600" : "border-transparent text-night-400 hover:text-night-700"
            }`}
          >
            Réservations ({reservations.length})
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "messages" ? "border-terracotta-600 text-terracotta-600" : "border-transparent text-night-400 hover:text-night-700"
            }`}
          >
            Messages ({messages.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-night-400 py-12">Chargement…</p>
        ) : tab === "reservations" ? (
          reservations.length === 0 ? (
            <div className="text-center py-16">
              <Inbox size={48} className="text-night-300 mx-auto mb-4" />
              <p className="text-night-400">Aucune réservation pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div key={res.id} className="bg-white p-6 rounded-sm border border-sand-200">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-serif text-xl text-night-900">{res.name}</h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            res.status === "confirmed"
                              ? "bg-oasis-100 text-oasis-700"
                              : res.status === "cancelled"
                              ? "bg-terracotta-100 text-terracotta-700"
                              : "bg-sand-200 text-night-600"
                          }`}
                        >
                          {res.status === "confirmed" ? "Confirmée" : res.status === "cancelled" ? "Annulée" : "En attente"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-night-500 mt-3">
                        <div>
                          <span className="text-night-400 block">Arrivée</span>
                          <span className="text-night-700 font-medium">{res.check_in}</span>
                        </div>
                        <div>
                          <span className="text-night-400 block">Départ</span>
                          <span className="text-night-700 font-medium">{res.check_out}</span>
                        </div>
                        <div>
                          <span className="text-night-400 block">Voyageurs</span>
                          <span className="text-night-700 font-medium">{res.guests}</span>
                        </div>
                        <div>
                          <span className="text-night-400 block">Contact</span>
                          <span className="text-night-700 font-medium">{res.email}</span>
                        </div>
                      </div>
                      {res.phone && (
                        <p className="text-sm text-night-500 mt-2">Tél : {res.phone}</p>
                      )}
                      {res.message && (
                        <p className="text-sm text-night-500 mt-3 bg-sand-50 p-3 rounded-sm">{res.message}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {res.status !== "confirmed" && (
                        <button
                          onClick={() => updateReservationStatus(res.id, "confirmed")}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-oasis-500 text-white rounded-sm hover:bg-oasis-600 transition-colors"
                        >
                          <Check size={16} className="mr-1.5" /> Confirmer
                        </button>
                      )}
                      {res.status !== "cancelled" && (
                        <button
                          onClick={() => updateReservationStatus(res.id, "cancelled")}
                          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-terracotta-100 text-terracotta-700 rounded-sm hover:bg-terracotta-200 transition-colors"
                        >
                          <X size={16} className="mr-1.5" /> Annuler
                        </button>
                      )}
                      <button
                        onClick={() => deleteReservation(res.id)}
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
        ) : (
          messages.length === 0 ? (
            <div className="text-center py-16">
              <Inbox size={48} className="text-night-300 mx-auto mb-4" />
              <p className="text-night-400">Aucun message pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
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
      </div>
    </div>
  );
}
