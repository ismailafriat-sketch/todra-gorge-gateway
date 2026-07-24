import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, Users, Send, CheckCircle, BedDouble } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Room } from "../types";
import { images } from "../lib/images";

export default function Reservation() {
  const location = useLocation();
  const preselectedRoom = (location.state as { roomId?: string; roomName?: string }) || {};

  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    check_in: "",
    check_out: "",
    guests: 2,
    room_id: preselectedRoom.roomId || "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRooms() {
      const { data } = await supabase.from("rooms").select("*").order("price_per_night", { ascending: true });
      setRooms(data || []);
    }
    loadRooms();
  }, []);

  useEffect(() => {
    if (preselectedRoom.roomId) {
      setForm((prev) => ({ ...prev, room_id: preselectedRoom.roomId! }));
    }
  }, [preselectedRoom.roomId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === "guests" ? parseInt(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const today = new Date().toISOString().split("T")[0];
    if (form.check_in < today) {
      setError("La date d'arrivée ne peut pas être dans le passé.");
      return;
    }
    if (form.check_out <= form.check_in) {
      setError("La date de départ doit être après la date d'arrivée.");
      return;
    }

    const { error: dbError } = await supabase.from("reservations").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      check_in: form.check_in,
      check_out: form.check_out,
      guests: form.guests,
      room_id: form.room_id || null,
      message: form.message,
      status: "pending",
    });

    if (dbError) {
      setError("Une erreur s'est produite. Veuillez réessayer ou nous contacter par téléphone.");
      return;
    }

    setSubmitted(true);
  };

  const selectedRoom = rooms.find((r) => r.id === form.room_id);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative h-[350px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.roomTerrace})` }}
        />
        <div className="absolute inset-0 bg-night-900/50" />
        <div className="relative z-10 text-center px-6">
          <p className="text-sand-200 text-sm uppercase tracking-[0.3em] mb-3">Réservation</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">
            Réservez votre séjour
          </h1>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-6 bg-sand-50">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            <div className="bg-white p-12 rounded-sm shadow-sm border border-sand-200 text-center">
              <CheckCircle size={64} className="text-oasis-500 mx-auto mb-6" />
              <h2 className="font-serif text-3xl text-night-900 mb-4">Demande envoyée !</h2>
              <p className="text-night-500 text-lg mb-2">
                Merci {form.name.split(" ")[0]}, votre demande de réservation
                a bien été reçue.
              </p>
              <p className="text-night-400 mb-8">
                Nous vous contacterons sous 24h pour confirmer votre séjour.
              </p>
              <div className="bg-sand-50 rounded-sm p-6 text-left mb-8 inline-block">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div><span className="text-night-400">Arrivée :</span> <span className="text-night-700 font-medium">{form.check_in}</span></div>
                  <div><span className="text-night-400">Départ :</span> <span className="text-night-700 font-medium">{form.check_out}</span></div>
                  <div><span className="text-night-400">Voyageurs :</span> <span className="text-night-700 font-medium">{form.guests}</span></div>
                  {selectedRoom && (
                    <div><span className="text-night-400">Chambre :</span> <span className="text-night-700 font-medium">{selectedRoom.name}</span></div>
                  )}
                </div>
              </div>
              <button onClick={() => setSubmitted(false)} className="btn-secondary block mx-auto">
                Nouvelle réservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-sm shadow-sm border border-sand-200 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">
                    Nom complet
                  </label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">
                    Email
                  </label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="votre@email.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-night-700 mb-1.5">
                  Téléphone
                </label>
                <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="input-field" placeholder="+212 6 00 00 00 00" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">
                    <Calendar size={14} className="inline mr-1" /> Arrivée
                  </label>
                  <input type="date" name="check_in" required value={form.check_in} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">
                    <Calendar size={14} className="inline mr-1" /> Départ
                  </label>
                  <input type="date" name="check_out" required value={form.check_out} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">
                    <Users size={14} className="inline mr-1" /> Voyageurs
                  </label>
                  <select name="guests" value={form.guests} onChange={handleChange} className="input-field">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "personne" : "personnes"}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-night-700 mb-1.5">
                  <BedDouble size={14} className="inline mr-1" /> Chambre souhaitée
                </label>
                <select name="room_id" value={form.room_id} onChange={handleChange} className="input-field">
                  <option value="">Indifférent</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} — {room.price_per_night} €/nuit
                    </option>
                  ))}
                </select>
                {selectedRoom && (
                  <p className="text-sm text-night-400 mt-2">
                    {selectedRoom.capacity} personnes max · {selectedRoom.size} m² · {selectedRoom.beds}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-night-700 mb-1.5">
                  Message (optionnel)
                </label>
                <textarea name="message" rows={4} value={form.message} onChange={handleChange} className="input-field resize-none" placeholder="Demandes particulières, heure d'arrivée, etc." />
              </div>

              {error && (
                <p className="text-terracotta-600 text-sm bg-terracotta-50 p-3 rounded-sm">{error}</p>
              )}

              <button type="submit" className="btn-primary w-full text-base">
                <Send size={18} className="mr-2" />
                Envoyer ma demande
              </button>

              <p className="text-xs text-night-400 text-center">
                La réservation sera confirmée par email sous 24h. Aucun paiement
                n'est requis à ce stade.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
