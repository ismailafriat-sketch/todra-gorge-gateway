import { createFileRoute } from "@tanstack/react-router";
const heroImg = "https://images.pexels.com/photos/33530297/pexels-photo-33530297/free-photo-of-gorgeous-view-of-todra-gorge-in-morocco.jpeg?auto=compress&cs=tinysrgb&w=1920";
const experienceImg = "https://images.pexels.com/photos/30369008/pexels-photo-30369008/free-photo-of-stunning-todra-gorge-in-morocco-s-tinghir.jpeg?auto=compress&cs=tinysrgb&w=1600";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/gorge")({
  head: () => ({
    meta: [
      { title: "Les Gorges du Todra — Auberge Le Festival" },
      { name: "description", content: "Randonnée, escalade et culture berbère au cœur des Gorges du Todra, l'un des canyons les plus spectaculaires du Maroc." },
      { property: "og:title", content: "Les Gorges du Todra" },
      { property: "og:description", content: "300 mètres de falaises rouges au sud du Haut Atlas." },
      { property: "og:url", content: "/gorge" },
    ],
    links: [{ rel: "canonical", href: "/gorge" }],
  }),
  component: Gorge,
});

function Gorge() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="relative h-[70svh] min-h-[500px] overflow-hidden">
        <img src={heroImg} alt="Gorges du Todra" width={1920} height={1280} className="absolute inset-0 h-full w-full object-cover" crossOrigin="anonymous" />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative container-x h-full flex items-end pb-16">
          <div>
            <p className="eyebrow text-primary-foreground/80">Là où nous sommes</p>
            <h1 className="mt-3 font-display text-5xl md:text-7xl text-primary-foreground max-w-3xl">
              300 mètres de falaises. 15 mètres de largeur.
            </h1>
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow">La gorge</p>
            <h2 className="mt-4 font-display text-4xl">Un canyon sculpté par l'oued Todra.</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 text-lg text-muted-foreground leading-relaxed space-y-5">
            <p>
              Les Gorges du Todra s'ouvrent à quinze kilomètres au nord de
              Tinghir, dans le flanc sud du Haut Atlas. Au plus étroit, la piste
              se glisse entre deux murs de calcaire orangé qui montent à plus
              de trois cents mètres.
            </p>
            <p>
              L'auberge se trouve à l'entrée de la gorge — la porte s'ouvre, la
              falaise commence. En été, l'eau de l'oued reste glacée ; en
              hiver, la lumière du matin illumine la roche en rose.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x">
        <div className="aspect-[21/9] overflow-hidden rounded-sm">
          <img src={experienceImg} alt="Randonneurs dans la gorge" width={1600} height={686} loading="lazy" className="h-full w-full object-cover" crossOrigin="anonymous" />
        </div>
      </section>

      <section className="container-x py-24">
        <p className="eyebrow">Ce qu'on fait ici</p>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {[
            { t: "Randonnée dans la gorge", b: "Traversée facile de 2 heures entre les falaises, ou boucle de la journée par les villages berbères en amont.", d: "Facile · 2h à 6h" },
            { t: "Escalade", b: "Plus de 400 voies équipées, du 4 au 8b. La falaise nord est parfaite le matin, la sud l'après-midi.", d: "Tous niveaux" },
            { t: "Bivouac dans le désert", b: "Excursion de deux jours vers Merzouga et l'erg Chebbi, avec nuit sous tente berbère.", d: "2 jours" },
            { t: "Vallée des Roses", b: "Journée dans la vallée de M'Goun, connue pour ses roseraies et son eau de rose distillée en mai.", d: "1 journée" },
          ].map((x, i) => (
            <div key={x.t} className="border-t border-border pt-6">
              <div className="flex items-baseline justify-between">
                <p className="font-display text-clay">0{i + 1}</p>
                <p className="text-xs text-muted-foreground">{x.d}</p>
              </div>
              <h3 className="mt-3 font-display text-2xl">{x.t}</h3>
              <p className="mt-3 text-muted-foreground">{x.b}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-clay text-primary-foreground">
        <div className="container-x py-20 text-center">
          <p className="eyebrow text-primary-foreground/80">Organiser sur place</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl max-w-2xl mx-auto">
            Toutes les excursions se réservent à l'accueil de l'auberge.
          </h2>
          <a href="tel:+212673454307" className="mt-8 inline-flex rounded-full bg-primary-foreground px-7 py-3.5 text-sm font-medium text-primary hover:bg-primary-foreground/90">
            +212 673 45 43 07
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
