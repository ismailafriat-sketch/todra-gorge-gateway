import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Accueil", path: "/" },
  { label: "Chambres", path: "/chambres" },
  { label: "Galerie", path: "/galerie" },
  { label: "Gorges du Todra", path: "/todra" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-sand-50/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none">
          <span
            className={`font-serif text-2xl font-semibold tracking-tight transition-colors duration-500 ${
              scrolled ? "text-night-900" : "text-white"
            }`}
          >
            Le Festival
          </span>
          <span
            className={`text-[10px] uppercase tracking-[0.25em] mt-0.5 transition-colors duration-500 ${
              scrolled ? "text-terracotta-600" : "text-sand-200"
            }`}
          >
            Auberge · Todra
          </span>
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 relative group ${
                  scrolled ? "text-night-700 hover:text-terracotta-600" : "text-white/90 hover:text-white"
                } ${isActive(link.path) ? (scrolled ? "text-terracotta-600" : "text-white") : ""}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-terracotta-500 transition-all duration-300 ${
                    isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link to="/reserver" className="btn-primary text-sm">
            Réserver
          </Link>
        </div>

        <button
          className={`lg:hidden ${scrolled ? "text-night-800" : "text-white"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden bg-sand-50 border-t border-sand-200 animate-fadeIn">
          <ul className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`block py-3 text-base font-medium border-b border-sand-100 ${
                    isActive(link.path) ? "text-terracotta-600" : "text-night-700"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link to="/reserver" className="btn-primary w-full">
                Réserver
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
