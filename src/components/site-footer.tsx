import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-muted/60">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="eyebrow">Auberge Le Festival</p>
          <h3 className="mt-2 font-display text-3xl text-foreground">
            Au pied des falaises de Todra.
          </h3>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Hôtel 2 étoiles à Tinghir, Maroc — une auberge familiale nichée dans
            les Gorges du Todra depuis plus de vingt ans.
          </p>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            <li>
              <a href="tel:+212673454307" className="hover:text-primary">
                +212 673 45 43 07
              </a>
            </li>
            <li>
              <a
                href="https://aubergelefestival-todragorge.com"
                className="hover:text-primary"
                target="_blank"
                rel="noreferrer"
              >
                aubergelefestival-todragorge.com
              </a>
            </li>
            <li className="text-muted-foreground">JCCQ+57 Tinghir, Maroc</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Navigation</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
            <li><Link to="/chambres" className="hover:text-primary">Chambres</Link></li>
            <li><Link to="/gorge" className="hover:text-primary">La Gorge</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col md:flex-row items-start md:items-center justify-between gap-2 py-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Auberge Le Festival — Todra Gorge.</p>
          <p>Arrivée 15:00 · Note voyageurs 4,7/5 (344 avis)</p>
        </div>
      </div>
    </footer>
  );
}
