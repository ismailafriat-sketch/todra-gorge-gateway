import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react";
import { useData } from "../lib/data-context";

export default function Footer() {
  const { siteSettings } = useData();
  const socialLinks = [
    { url: siteSettings.facebook_url, icon: Facebook, label: "Facebook" },
    { url: siteSettings.instagram_url, icon: Instagram, label: "Instagram" },
  ].filter((s) => s.url);

  return (
    <footer className="bg-night-900 text-sand-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl text-white mb-2">Auberge Le Festival</h3>
            <p className="text-sm text-sand-400 leading-relaxed">
              Au cœur des gorges du Todra, une oasis d'hospitalité marocaine.
              Chambres confortables, cuisine traditionnelle et excursions
              inoubliables.
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-terracotta-400 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/chambres" className="hover:text-white transition-colors">Chambres</Link></li>
              <li><Link to="/galerie" className="hover:text-white transition-colors">Galerie</Link></li>
              <li><Link to="/todra" className="hover:text-white transition-colors">Gorges du Todra</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/reserver" className="hover:text-white transition-colors">Réservation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] text-terracotta-400 mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-terracotta-400 flex-shrink-0 mt-0.5" />
                <span>{siteSettings.address || "Tinghir, Gorges du Todra, Maroc"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-terracotta-400 flex-shrink-0" />
                <span>{siteSettings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-terracotta-400 flex-shrink-0" />
                <span>{siteSettings.email}</span>
              </li>
            </ul>
            {socialLinks.length > 0 && (
              <div className="flex gap-4 mt-5">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sand-400 hover:text-white transition-colors"
                    aria-label={s.label}
                  >
                    <s.icon size={20} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-night-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-sand-500">
          <p>© {new Date().getFullYear()} Auberge Le Festival. Tous droits réservés.</p>
          <Link to="/admin" className="hover:text-sand-300 transition-colors">
            Espace administration
          </Link>
        </div>
      </div>
    </footer>
  );
}
