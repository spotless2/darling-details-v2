import { motion } from "framer-motion";
import { Heart, Star, Award, Users, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { storeService } from "@/services";

const ScrollToTopLink = ({ href, children, className = "" }: any) => {
  const [, setLocation] = useLocation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setLocation(href), 80);
  };
  return <a href={href} onClick={handleClick} className={className}>{children}</a>;
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Creativitate",
    desc: "Idei proaspete și originale pentru mărturii și decorațiuni care reflectă personalitatea fiecărui client.",
    colorClass: "text-amber-500",
    bgClass: "bg-amber-100/50 border-amber-200",
    hoverBgClass: "group-hover:bg-amber-500 group-hover:border-amber-500",
  },
  {
    icon: Award,
    title: "Calitate",
    desc: "Materiale premium și atenție meticuloasă la fiecare detaliu pentru produse care impresionează.",
    colorClass: "text-rose-500",
    bgClass: "bg-rose-100/50 border-rose-200",
    hoverBgClass: "group-hover:bg-rose-500 group-hover:border-rose-500",
  },
  {
    icon: Heart,
    title: "Pasiune",
    desc: "Punem suflet în fiecare creație, pentru că știm cât de importante sunt momentele speciale.",
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-100/50 border-emerald-200",
    hoverBgClass: "group-hover:bg-emerald-500 group-hover:border-emerald-500",
  },
  {
    icon: Users,
    title: "Personalizare",
    desc: "Fiecare eveniment este unic — adaptăm fiecare creație pentru a se potrivi perfect cu viziunea ta.",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-100/50 border-blue-200",
    hoverBgClass: "group-hover:bg-blue-500 group-hover:border-blue-500",
  },
];

const STATS = [
  { value: "100+", label: "Evenimente realizate" },
  { value: "500+", label: "Clienți mulțumiți" },
  { value: "2025", label: "Fondată în" },
  { value: "5★", label: "Rating mediu" },
];

export default function About() {
  const { data: settingsResponse } = useQuery({
    queryKey: ["store-settings"],
    queryFn: () => storeService.getStoreSettings(),
  });
  const settings = settingsResponse?.data || {};

  const aboutStory = settings.aboutStory || `Darling Details a luat naștere în 2025 din pasiunea pentru frumos și atenția la detalii. Am pornit cu viziunea de a aduce un suflu nou în lumea mărturiilor și decorațiunilor pentru evenimente speciale.\n\nDeși suntem la început de drum, punem suflet în fiecare creație și ne dedicăm să transformăm evenimentele importante din viața dumneavoastră în amintiri de neuitat, prin detalii atent alese și personalizate.`;
  const aboutMission = settings.aboutMission || `"Ne-am propus să oferim mărturii și decorațiuni care reflectă personalitatea și stilul fiecărui client. Credem că detaliile fac diferența și transformă un eveniment obișnuit într-unul memorabil. Fiecare eveniment are povestea sa unică, iar noi suntem aici să o evidențiem."`;
  const aboutVision = settings.aboutVision || `Ne dorim să devenim parteneri de încredere pentru cele mai frumoase momente din viața clienților noștri. Avem planuri ambițioase de a crește și de a aduce bucurie prin creațiile noastre în cât mai multe evenimente speciale.`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold" />
              Povestea Noastră
            </p>
            <h1
              className="font-display text-white text-shadow-hero"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Despre Darling Details
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="section-label mb-4">Cine Suntem</p>
              <h2
                className="font-display text-charcoal mb-6"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
              >
                Povestea Noastră
              </h2>
              <div className="w-16 h-px bg-gold mb-8" />
              
              {aboutStory.split('\n').map((paragraph: string, i: number) => 
                paragraph.trim() ? (
                  <p key={i} className="text-charcoal/65 font-sans leading-relaxed mb-5">
                    {paragraph}
                  </p>
                ) : null
              )}

              <ScrollToTopLink
                href="/contact"
                className="btn-primary px-7 hover:-translate-y-0.5"
              >
                Contactează-ne
                <Heart className="h-3.5 w-3.5" />
              </ScrollToTopLink>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
                  alt="Wedding decorations"
                  className="w-full aspect-[4/3] object-cover rounded-sm shadow-2xl"
                />
                {/* Decorative frame */}
                <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/30 rounded-sm -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="text-center"
              >
                <div className="font-display text-gold text-4xl md:text-5xl mb-2 font-bold">{stat.value}</div>
                <div className="text-white/80 text-xs tracking-widest uppercase font-sans">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-label mb-4">Misiunea Noastră</p>
            <h2
              className="font-display text-charcoal mb-8"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
            >
              De Ce Existăm
            </h2>
            <div className="flex justify-center mb-8">
              <div className="w-16 h-px bg-gold" />
            </div>
            {aboutMission.split('\n').map((paragraph: string, i: number) => 
              paragraph.trim() ? (
                <p key={i} className="text-charcoal/65 font-sans text-lg leading-relaxed italic font-light mb-4">
                  {paragraph}
                </p>
              ) : null
            )}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-label mb-4">Ce Ne Definește</p>
            <h2
              className="font-display text-charcoal"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
            >
              Valorile Noastre
            </h2>
            <div className="flex justify-center mt-4">
              <div className="w-16 h-px bg-gold" />
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                className="card-elegant p-7 text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className={`w-14 h-14 rounded-full border ${v.bgClass} flex items-center justify-center mx-auto mb-5 ${v.hoverBgClass} transition-all duration-400 shadow-sm group-hover:shadow-md group-hover:-translate-y-1`}>
                  <v.icon className={`h-6 w-6 ${v.colorClass} group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="font-display text-charcoal text-lg mb-3">{v.title}</h3>
                <p className="text-charcoal/55 text-sm font-sans leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision CTA */}
      <section className="py-20 bg-charcoal text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Star className="h-8 w-8 text-gold mx-auto mb-6" />
            <h2 className="font-display text-white mb-6" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}>
              Viziunea de Viitor
            </h2>
            {aboutVision.split('\n').map((paragraph: string, i: number) => 
              paragraph.trim() ? (
                <p key={i} className="text-white/55 font-sans leading-relaxed mb-8">
                  {paragraph}
                </p>
              ) : null
            )}
            <ScrollToTopLink
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold/50 text-gold text-xs tracking-widest uppercase font-sans hover:bg-gold hover:text-white transition-all duration-300"
            >
              Explorează Colecțiile
            </ScrollToTopLink>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
