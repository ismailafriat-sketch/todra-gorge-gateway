import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-gorge.jpg";
import diningImg from "@/assets/dining/dining_candlelit.jpg.asset.json";
import stripLeftImg from "@/assets/rooms/room_2.jpg.asset.json";
import stripRightImg from "@/assets/rooms/room_5.jpg.asset.json";
import poolImg from "@/assets/gallery/pool.jpg.asset.json";
import valleyImg from "@/assets/gallery/valley.jpg.asset.json";
import terraceImg from "@/assets/gallery/terrace.jpg.asset.json";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Falaises rouges des Gorges du Todra au coucher du soleil"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/70" />
        <div className="relative z-10 container-x flex h-full flex-col justify-end pb-20 md:pb-28">
          <p className="eyebrow text-primary-foreground/80">Tinghir · Maroc · Depuis 1998</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.05] text-primary-foreground md:text-7xl lg:text-8xl">
            Dormir entre <em className="italic text-accent">deux falaises</em> de trois cents mètres.
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              to="/chambres"
              className="inline-flex items-center rounded-full bg-primary-foreground px-7 py-3.5 text-sm font-medium text-primary hover:bg-primary-foreground/90 transition"
            >
              Voir les chambres
            </Link>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <span className="font-display text-3xl">4,7</span>
              <div className="text-xs leading-tight">
                <div className="text-accent">★★★★★</div>
                <div>344 avis voyageurs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="container-x py-24 md:py-32">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow">L'auberge</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Une maison de pierre et d'argile, taillée pour la gorge.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              À quelques mètres de l'oued qui traverse les Gorges du Todra,
              l'Auberge Le Festival est une adresse familiale. Deux étoiles,
              vingt-trois chambres, un toit-terrasse. Rien de superflu — juste
              l'essentiel pour s'endormir sous les étoiles du Haut Atlas.
            </p>
            <p>
              Nous accueillons randonneurs, grimpeurs et curieux depuis plus de
              vingt ans, avec la même chose à offrir : une clé, un tagine, et
              la lumière du matin sur les falaises.
            </p>
          </div>
        </div>
      </section>

      {/* IMAGE STRIP */}
      <section className="container-x">
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-7 aspect-[4/3] md:aspect-[16/11] overflow-hidden rounded-sm">
            <img src={stripLeftImg.url} alt="Salon berbère de l'auberge" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="md:col-span-5 aspect-[4/3] md:aspect-[16/11] overflow-hidden rounded-sm">
            <img src={stripRightImg.url} alt="Chambre traditionnelle de l'auberge" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="container-x pt-16 md:pt-20">
        <div className="grid gap-16 md:grid-cols-12 md:items-end mb-10">
          <div className="md:col-span-5">
            <p className="eyebrow">La maison</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Terrasse, piscine, vallée.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 text-muted-foreground leading-relaxed">
            <p>
              Une piscine taillée dans la pierre, une longue terrasse ouverte
              sur le canyon, et au loin la palmeraie verte de Tinghir. Voilà
              trois manières de prendre son temps à l'auberge.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5 aspect-[4/5] overflow-hidden rounded-sm">
            <img src={poolImg.url} alt="Piscine en pierre face au ksar" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="md:col-span-7 aspect-[4/3] md:aspect-auto overflow-hidden rounded-sm">
            <img src={terraceImg.url} alt="Terrasse en pierre ouverte sur la gorge" loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="md:col-span-12 aspect-[21/9] overflow-hidden rounded-sm">
            <img src={valleyImg.url} alt="Vue sur la palmeraie et les montagnes de Tinghir" loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>



      {/* FEATURES */}
      <section className="container-x py-24 md:py-32">
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Chambres avec vue",
              body: "Vingt-trois chambres tournées vers les falaises, aux murs de chaux et tapis berbères tissés à la main.",
            },
            {
              n: "02",
              title: "Table berbère",
              body: "Tagines mijotés, pain cuit au four à bois, thé à la menthe servi sur la terrasse au coucher du soleil.",
            },
            {
              n: "03",
              title: "Guides locaux",
              body: "Randonnée dans les gorges, escalade, excursions dans la vallée — organisées avec des guides du village.",
            },
          ].map((f) => (
            <div key={f.n} className="border-t border-border pt-6">
              <p className="font-display text-clay">{f.n}</p>
              <h3 className="mt-4 font-display text-2xl">{f.title}</h3>
              <p className="mt-3 text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DINING */}
      <section className="bg-ink text-primary-foreground">
        <div className="container-x grid gap-12 py-24 md:grid-cols-2 md:items-center md:py-32">
          <div className="aspect-[4/5] overflow-hidden rounded-sm md:order-2">
            <img src={diningImg.url} alt="Dîner aux chandelles dans la salle voûtée de l'auberge" width={1400} height={1400} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="md:order-1">
            <p className="eyebrow text-accent">La table</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              Ce qui pousse ici, ce qui mijote ici.
            </h2>
            <p className="mt-6 text-primary-foreground/80 leading-relaxed">
              La cuisine de l'auberge est celle de la région : olives de la
              vallée, dattes du Ferkla, agneau des plateaux, safran et cumin.
              Les repas sont servis dans la grande salle voûtée ou sur la
              terrasse, selon la saison.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              <li className="flex justify-between border-b border-primary-foreground/15 pb-3">
                <span>Petit-déjeuner berbère</span><span className="text-primary-foreground/60">inclus</span>
              </li>
              <li className="flex justify-between border-b border-primary-foreground/15 pb-3">
                <span>Tagine du jour</span><span className="text-primary-foreground/60">80 MAD</span>
              </li>
              <li className="flex justify-between border-b border-primary-foreground/15 pb-3">
                <span>Menu complet</span><span className="text-primary-foreground/60">150 MAD</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* BOOK CTA */}
      <section className="container-x py-24 md:py-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow">Réserver</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl">
              À partir de <span className="text-clay">793 MAD</span> la nuit.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Annulation gratuite, Wi-Fi inclus, arrivée à partir de 15h.
              Contactez-nous directement pour les meilleurs tarifs.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3">
            <a
              href="tel:+212673454307"
              className="inline-flex items-center justify-between rounded-full bg-primary px-6 py-4 text-primary-foreground hover:bg-primary/90"
            >
              <span className="text-sm">Appeler</span>
              <span className="font-display text-lg">+212 673 45 43 07</span>
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-input px-6 py-4 text-sm text-foreground hover:bg-accent/40"
            >
              Écrire à l'auberge
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
