import { useState } from "react";
import { X } from "lucide-react";
import { images } from "../lib/images";

const galleryItems = [
  { id: 1, title: "Gorges du Todra", category: "Paysages", image: images.gallery1, caption: "Les falaises spectaculaires du Todra" },
  { id: 2, title: "Falaises", category: "Paysages", image: images.gallery2, caption: "Parois de 300 mètres de hauteur" },
  { id: 3, title: "Dunes du désert", category: "Paysages", image: images.gallery3, caption: "Le Sahara à quelques heures de l'auberge" },
  { id: 4, title: "Rivière du Todra", category: "Paysages", image: images.gallery4, caption: "L'eau qui traverse la gorge" },
  { id: 5, title: "Palmeraie", category: "Paysages", image: images.gallery5, caption: "La palmeraie de Tinghir" },
  { id: 6, title: "Chambre Standard", category: "Chambres", image: images.gallery6, caption: "Confort et authenticité" },
  { id: 7, title: "Chambre Deluxe", category: "Chambres", image: images.gallery7, caption: "Espace et élégance" },
  { id: 8, title: "Suite Berbère", category: "Chambres", image: images.gallery8, caption: "Notre plus belle chambre" },
  { id: 9, title: "Terrasse", category: "Chambres", image: images.gallery9, caption: "Vue panoramique" },
  { id: 10, title: "Salon traditionnel", category: "Chambres", image: images.gallery10, caption: "Coin salon berbère" },
  { id: 11, title: "Décor marocain", category: "Détails", image: images.gallery11, caption: "Artisanat local" },
  { id: 12, title: "Kasbah", category: "Paysages", image: images.gallery12, caption: "Architecture de terre crue" },
];

const categories = ["Tous", "Paysages", "Chambres", "Détails"];

export default function Gallery() {
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "Tous"
    ? galleryItems
    : galleryItems.filter((item) => item.category === filter);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="relative h-[350px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images.gallery2})` }}
        />
        <div className="absolute inset-0 bg-night-900/50" />
        <div className="relative z-10 text-center px-6">
          <p className="text-sand-200 text-sm uppercase tracking-[0.3em] mb-3">Album</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-light">
            Galerie
          </h1>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 bg-sand-50 border-b border-sand-200">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-sm font-medium tracking-wide rounded-sm transition-all duration-300 ${
                filter === cat
                  ? "bg-terracotta-600 text-white"
                  : "bg-white text-night-600 border border-sand-300 hover:border-terracotta-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 bg-sand-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setLightbox(item.id)}
              className="group relative h-64 overflow-hidden rounded-sm cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-night-900/0 group-hover:bg-night-900/40 transition-all duration-300 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100">
                <p className="text-white font-serif text-xl">{item.title}</p>
                <p className="text-sand-200 text-sm">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-night-950/90 flex items-center justify-center p-6 animate-fadeIn"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-terracotta-400 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryItems.find((i) => i.id === lightbox)?.image}
              alt={galleryItems.find((i) => i.id === lightbox)?.title}
              className="max-w-full max-h-[80vh] object-contain rounded-sm"
            />
            <p className="text-center text-white mt-4 font-serif text-xl">
              {galleryItems.find((i) => i.id === lightbox)?.title}
            </p>
            <p className="text-center text-sand-300 text-sm mt-1">
              {galleryItems.find((i) => i.id === lightbox)?.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
