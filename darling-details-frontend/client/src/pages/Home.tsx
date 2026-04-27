import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { Testimonials } from "@/components/home/Testimonials";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { CheckCircle2, Sparkles, Heart, Clock, Phone, ArrowRight } from "lucide-react";

const ScrollToTopLink = ({ href, children, className = "" }: any) => {
  const [, setLocation] = useLocation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setLocation(href), 80);
  };
  return <a href={href} onClick={handleClick} className={className}>{children}</a>;
};

const WHY_US = [
  {
    icon: Sparkles,
    title: "Design Premium",
    description: "Fiecare detaliu este ales cu grijă pentru a crea o atmosferă de poveste la evenimentul tău.",
    colorClass: "text-amber-500",
    bgClass: "bg-amber-100/50 border-amber-200",
    hoverBgClass: "group-hover:bg-amber-500 group-hover:border-amber-500",
  },
  {
    icon: Heart,
    title: "Personalizare Totală",
    description: "Adaptăm fiecare creație viziunii tale — nimic nu este standard în Darling Details.",
    colorClass: "text-rose-500",
    bgClass: "bg-rose-100/50 border-rose-200",
    hoverBgClass: "group-hover:bg-rose-500 group-hover:border-rose-500",
  },
  {
    icon: CheckCircle2,
    title: "Calitate Garantată",
    description: "Materiale premium și finisaje impecabile care impresionează fiecare invitat.",
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-100/50 border-emerald-200",
    hoverBgClass: "group-hover:bg-emerald-500 group-hover:border-emerald-500",
  },
  {
    icon: Clock,
    title: "Livrare la Timp",
    description: "Respectăm termenele și ne asigurăm că totul este perfect la momentul cel mai important.",
    colorClass: "text-blue-500",
    bgClass: "bg-blue-100/50 border-blue-200",
    hoverBgClass: "group-hover:bg-blue-500 group-hover:border-blue-500",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Consultație", desc: "Discutăm viziunea ta și cerințele evenimentului." },
  { step: "02", title: "Personalizare", desc: "Creăm propuneri adaptate stilului și bugetului tău." },
  { step: "03", title: "Producție", desc: "Realizăm fiecare detaliu cu maximă atenție și precizie." },
  { step: "04", title: "Livrare", desc: "Livrăm și instalăm decorațiunile la locația ta." },
];

export default function Home() {
  return (
    <div>
      <Hero />

      {/* Why us section */}
      <section className="py-24 bg-ivory relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(348,45%,42%) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-label mb-4">De Ce Noi</p>
            <h2
              className="font-display text-charcoal"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
            >
              Diferența Darling Details
            </h2>
            <div className="flex justify-center mt-4">
              <div className="w-16 h-px bg-gold" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_US.map((item, i) => (
              <motion.div
                key={i}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
              >
                <div className={`w-14 h-14 rounded-full border ${item.bgClass} flex items-center justify-center mx-auto mb-5 ${item.hoverBgClass} transition-all duration-400 shadow-sm group-hover:shadow-md group-hover:-translate-y-1`}>
                  <item.icon className={`h-6 w-6 ${item.colorClass} group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="font-display text-charcoal text-lg mb-2">{item.title}</h3>
                <p className="text-charcoal/55 text-sm font-sans leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedCategories />

      {/* Process / How it works */}
      <section className="py-24 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(45deg, hsl(38,65%,58%) 25%, transparent 25%), linear-gradient(-45deg, hsl(38,65%,58%) 25%, transparent 25%)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="section-label mb-4 text-gold">Procesul Nostru</p>
            <h2
              className="font-display text-white"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
            >
              Cum Lucrăm
            </h2>
            <div className="flex justify-center mt-4">
              <div className="w-16 h-px bg-gold" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            {PROCESS_STEPS.map((item, i) => (
              <motion.div
                key={i}
                className="text-center relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <div className="w-16 h-16 rounded-full border border-gold/30 bg-gradient-to-br from-gold/20 to-amber-600/30 flex items-center justify-center mx-auto mb-5 relative z-10 shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-all duration-500">
                  <span className="font-display text-gold text-xl font-bold group-hover:text-white transition-colors duration-300">{item.step}</span>
                </div>
                <h3 className="font-display text-white text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm font-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA Banner */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/70 text-xs tracking-[0.3em] uppercase font-sans mb-6">
              Hai să Creăm Ceva Frumos Împreună
            </p>
            <h2
              className="font-display text-white mb-6"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              Evenimentul Tău Merită Perfectiunea
            </h2>
            <p className="text-white/70 font-sans text-base mb-10 max-w-xl mx-auto leading-relaxed">
              Contactează-ne astăzi și hai să discutăm cum putem transforma viziunea ta în realitate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ScrollToTopLink
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary text-sm tracking-widest uppercase font-sans font-medium hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" />
                Contactează-ne
              </ScrollToTopLink>
              <ScrollToTopLink
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/50 text-white text-sm tracking-widest uppercase font-sans font-medium hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
              >
                Explorează Galeria
                <ArrowRight className="h-4 w-4" />
              </ScrollToTopLink>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

