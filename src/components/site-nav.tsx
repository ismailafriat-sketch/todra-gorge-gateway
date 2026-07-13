import { Link } from "@tanstack/react-router";
import { useState } from "react";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/chambres", label: "Chambres" },
  { to: "/galerie", label: "Galerie" },
  { to: "/gorge", label: "La Gorge" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container-x flex items-center justify-between py-6">
        <Link to="/" className="flex flex-col leading-none">
          <span className="eyebrow text-primary-foreground/80">Auberge</span>
          <span className="font-display text-xl text-primary-foreground">Le Festival</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-primary-foreground/90 hover:text-primary-foreground transition-colors"
              activeProps={{ className: "text-primary-foreground font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/reservation"
          className="hidden md:inline-flex items-center rounded-full bg-primary-foreground/95 px-5 py-2 text-sm font-medium text-primary hover:bg-primary-foreground transition"
        >
          Réserver
        </Link>
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <div className="space-y-1.5">
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
            <span className="block h-px w-6 bg-current" />
          </div>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-ink/95 backdrop-blur">
          <div className="container-x flex flex-col gap-4 py-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-primary-foreground text-lg"
              >
                {l.label}
              </Link>
            ))}
            <a href="tel:+212673454307" className="text-accent text-lg">
              +212 673 45 43 07
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
