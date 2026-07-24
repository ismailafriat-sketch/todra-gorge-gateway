import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CircleCheck as CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { images } from "../lib/images";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });

    if (dbError) {
      setError("Une erreur s'est produite. Veuillez réessayer ou nous contacter par téléphone.");
      return;
    }

    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative h-[350px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.kasbah})` }}
        />
        <div className="absolute inset-0 bg-night-900/50" />
        <div className="relative z-10 text-center px-6">
          <p className="text-sand-200 text-sm uppercase tracking-[0.3em] mb-3">Écrivez-nous</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">
            Contact
          </h1>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="py-20 px-6 bg-sand-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <p className="section-subtitle">Informations</p>
            <h2 className="font-serif text-3xl text-night-900 font-light mb-8">
              Nous sommes à votre écoute
            </h2>
            <div className="space-y-6">
              {[
                { icon: MapPin, label: "Adresse", value: "Tinghir, Gorges du Todra, Région de Drâa-Tafilalet, Maroc" },
                { icon: Phone, label: "Téléphone", value: "+212 6 12 34 56 78" },
                { icon: Mail, label: "Email", value: "contact@aubergelefestival.ma" },
                { icon: Clock, label: "Réception", value: "Ouverte tous les jours, 7h — 22h" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sand-100 text-terracotta-600 flex items-center justify-center">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider text-night-400 mb-1">{item.label}</p>
                    <p className="text-night-700">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white rounded-sm border border-sand-200">
              <p className="text-sm text-night-500 leading-relaxed">
                <span className="font-medium text-night-700">Comment venir :</span> Les
                gorges du Todra se trouvent à environ 4h de route de Marrakech
                et 2h de Ouarzazate. Des bus quotidiens relient Tinghir aux
                principales villes. Nous pouvons également organiser un
                transfert privé depuis l'aéroport.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-sm shadow-sm border border-sand-200">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <CheckCircle size={64} className="text-oasis-500 mb-6" />
                <h3 className="font-serif text-2xl text-night-900 mb-3">Message envoyé !</h3>
                <p className="text-night-500 mb-8">
                  Merci pour votre message. Nous vous répondrons dans les
                  plus brefs délais.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">
                    Sujet
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Objet de votre message"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-night-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Votre message…"
                  />
                </div>

                {error && (
                  <p className="text-terracotta-600 text-sm bg-terracotta-50 p-3 rounded-sm">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-primary w-full">
                  <Send size={18} className="mr-2" />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
