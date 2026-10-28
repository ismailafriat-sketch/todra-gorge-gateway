import { Link } from "react-router-dom";
import { Mountain, Compass, Camera, Footprints, ArrowRight } from "lucide-react";
import { images } from "../lib/images";

const activities = [
  {
    icon: Footprints,
    title: "Randonnée",
    desc: "Parcourez les sentiers de la gorge et découvrez des points de vue uniques sur les falaises et la palmeraie.",
  },
  {
    icon: Mountain,
    title: "Escalade",
    desc: "Les parois du Todra sont réputées mondialement. Plus de 400 voies pour tous les niveaux, du débutant à l'expert.",
  },
  {
    icon: Compass,
    title: "Excursions désert",
    desc: "Partez à la découverte des dunes de Merzouga et de l'erg Chebbi, en 4x4 ou à dos de chameau pour un bivouac.",
  },
  {
    icon: Camera,
    title: "Photographie",
    desc: "Lumière dorée, architecture de terre crue et paysages lunaires : le Todra est un paradis pour les photographes.",
  },
];

export default function Todra() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center animate-slowZoom"
          style={{ backgroundImage: `url(${images.todraGorge})` }}
        />
        <div className="absolute inset-0 bg-night-900/40" />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <p className="text-sand-200 text-sm uppercase tracking-[0.3em] mb-3">À découvrir</p>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-light">
            Les gorges du Todra
          </h1>
          <p className="text-sand-100 text-lg mt-4 font-light">
            Un paysage à couper le souffle, à deux pas de l'auberge
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 px-6 bg-sand-50">
        <div className="max-w-4xl mx-auto">
          <p className="section-subtitle text-center">Le joyau du sud marocain</p>
          <h2 className="section-title text-center mb-8">
            Une vallée légendaire
          </h2>
          <div className="space-y-4 text-night-600 text-lg leading-relaxed font-light">
            <p>
              Les gorges du Todra s'étendent sur une trentaine de kilomètres
              le long de la rivière éponyme, entre les villes de Tinghir et
              d'Elmal n'Aït Oufella. À l'entrée de la gorge, les falaises se
              rapprochent jusqu'à former un canyon étroit de seulement 10
              mètres de large pour 300 mètres de hauteur.
            </p>
            <p>
              Ce paysage spectaculaire, sculpté par l'eau et le temps, est
              bordé par une palmeraie luxuriante de 30 kilomètres. C'est ici,
              au cœur de cette oasis, que l'Auberge Le Festival vous accueille
              pour un séjour authentique et inoubliable.
            </p>
          </div>
        </div>
      </section>

      {/* Image showcase */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <div className="relative h-80 md:h-[450px] overflow-hidden group">
          <img src={images.todraCliffs} alt="Falaises du Todra" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/60 to-transparent flex items-end p-8">
            <p className="text-white font-serif text-2xl">Les falaises</p>
          </div>
        </div>
        <div className="relative h-80 md:h-[450px] overflow-hidden group">
          <img src={images.todraRiver} alt="Rivière du Todra" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-night-900/60 to-transparent flex items-end p-8">
            <p className="text-white font-serif text-2xl">La rivière</p>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-subtitle">Activités</p>
            <h2 className="section-title">Que faire au Todra ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((activity) => (
              <div key={activity.title} className="flex gap-5 p-6 rounded-sm border border-sand-200 hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-sand-100 text-terracotta-600 flex items-center justify-center">
                    <activity.icon size={26} />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl text-night-900 mb-2">{activity.title}</h3>
                  <p className="text-night-500 leading-relaxed">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Excursions de l'auberge */}
      {excursions.filter((e) => e.is_available).length > 0 && (
        <section className="py-24 px-6 bg-sand-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="section-subtitle">Organisées par l'auberge</p>
              <h2 className="section-title">Nos excursions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {excursions
                .filter((e) => e.is_available)
                .map((ex) => (
                  <div key={ex.id} className="bg-white rounded-sm border border-sand-200 overflow-hidden flex flex-col">
                    {ex.images[0] && (
                      <div className="h-48 overflow-hidden">
                        <img src={ex.images[0]} alt={ex.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-serif text-xl text-night-900">{ex.title}</h3>
                      {ex.duration && <p className="text-night-400 text-sm mt-1">{ex.duration}</p>}
                      <p className="text-night-500 leading-relaxed mt-3 flex-1">{ex.description}</p>
                      <ul className="mt-4 space-y-1">
                        {ex.details.map((d) => (
                          <li key={d} className="text-sm text-night-500 flex items-start gap-2">
                            <Check size={14} className="text-oasis-500 mt-1 flex-shrink-0" /> {d}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 font-serif text-2xl text-terracotta-600">
                        {ex.price_mad} MAD
                        <span className="text-sm text-night-400 font-sans"> / personne</span>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="py-20 px-6 bg-night-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "300 m", label: "Hauteur des falaises" },
            { value: "30 km", label: "Longueur de la gorge" },
            { value: "400+", label: "Voies d'escalade" },
            { value: "2 min", label: "Marche depuis l'auberge" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-4xl md:text-5xl text-terracotta-400 font-light">{stat.value}</p>
              <p className="text-sand-300 text-sm mt-2 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-sand-50 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title mb-6">Prêt à explorer le Todra ?</h2>
          <p className="text-night-600 text-lg font-light mb-8">
            Réservez votre séjour et laissez-nous vous guider dans la
            découverte de ce territoire d'exception.
          </p>
          <Link to="/reserver" className="btn-primary">
            Réserver maintenant <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
