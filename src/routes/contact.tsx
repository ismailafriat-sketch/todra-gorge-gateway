import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Auberge Le Festival, Todra" },
      { name: "description", content: "Contacter l'Auberge Le Festival à Tinghir, Maroc. Téléphone, adresse et itinéraire vers les Gorges du Todra." },
      { property: "og:title", content: "Contact — Auberge Le Festival" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="bg-ink pt-40 pb-20 text-primary-foreground">
        <div className="container-x">
          <p className="eyebrow text-accent">Nous trouver</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl max-w-3xl">
            À l'entrée des Gorges, sur la route de Tamtattoucht.
          </h1>
        </div>
      </section>

      <section className="container-x py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow">Coordonnées</p>
            <dl className="mt-8 space-y-8">
              <div className="border-t border-border pt-6">
                <dt className="text-sm text-muted-foreground">Téléphone</dt>
                <dd className="mt-2"><a href="tel:+212673454307" className="font-display text-3xl hover:text-clay">+212 673 45 43 07</a></dd>
              </div>
              <div className="border-t border-border pt-6">
                <dt className="text-sm text-muted-foreground">Site officiel</dt>
                <dd className="mt-2">
                  <a href="https://aubergelefestival-todragorge.com" target="_blank" rel="noreferrer" className="font-display text-2xl hover:text-clay">
                    aubergelefestival-todragorge.com
                  </a>
                </dd>
              </div>
              <div className="border-t border-border pt-6">
                <dt className="text-sm text-muted-foreground">Adresse</dt>
                <dd className="mt-2 font-display text-2xl">JCCQ+57 Tinghir, Maroc</dd>
                <dd className="mt-1 text-muted-foreground">Gorges du Todra, province de Tinghir</dd>
              </div>
              <div className="border-t border-border pt-6">
                <dt className="text-sm text-muted-foreground">Arrivée / départ</dt>
                <dd className="mt-2 font-display text-2xl">15:00 · 11:00</dd>
              </div>
            </dl>
          </div>

          <div>
            <p className="eyebrow">Comment venir</p>
            <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
              <p>
                <span className="text-foreground font-medium">De Marrakech —</span> environ
                6h de route via Ouarzazate et la vallée du Dadès. Route
                spectaculaire à travers le Tizi n'Tichka.
              </p>
              <p>
                <span className="text-foreground font-medium">De Fès —</span> 8h via Midelt
                et Errachidia. Traversée du Moyen Atlas et des plateaux
                d'Imilchil.
              </p>
              <p>
                <span className="text-foreground font-medium">De Tinghir —</span> 15 km au
                nord sur la route P1272. L'auberge se trouve à l'entrée de la
                gorge, à droite après le village.
              </p>
              <p>
                Transferts en 4×4 depuis l'aéroport de Ouarzazate ou Errachidia
                sur demande.
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Auberge+Le+Festival+Todra+Gorge"
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Ouvrir dans Google Maps
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <iframe
          title="Emplacement de l'Auberge Le Festival"
          src="https://www.google.com/maps?q=Auberge+Le+Festival+Todra+Gorge+Tinghir&output=embed"
          className="h-[500px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>

      <SiteFooter />
    </div>
  );
}
