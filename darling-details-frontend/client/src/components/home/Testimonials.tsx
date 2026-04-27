import { useQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import type { Testimonial } from "@shared/schema";

const DEFAULT_TESTIMONIALS = [
  {
    id: 'default-1',
    name: "Maria Popescu",
    rating: 5,
    content: "Darling Details a făcut ca nunta noastră să arate exact cum am visat! Aranjamentele florale au fost absolut superbe, iar invitații au fost impresionați de fiecare detaliu. Recomand din suflet!",
    date: new Date().toISOString()
  },
  {
    id: 'default-2',
    name: "Andreea Ionescu",
    rating: 5,
    content: "O echipă extraordinară! Am colaborat pentru botezul fetiței noastre și totul a decurs perfect. Creativitate, profesionalism și o atenție deosebită la detalii. Mulțumim!",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'default-3',
    name: "Elena Dumitru",
    rating: 5,
    content: "Cele mai frumoase decorațiuni pe care le-am văzut vreodată. Au reușit să transforme complet locația evenimentului nostru. Serviciile sunt de o calitate excepțională, peste așteptări.",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export function Testimonials() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const response = await fetch("/api/testimonials");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 bg-white/80 rounded-sm animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayTestimonials = testimonials?.length ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section className="py-24 bg-ivory relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(348,45%,42%) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="section-label mb-4">Recenzii</p>
          <h2 className="font-display text-charcoal mb-4" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
            Ce Spun Clienții Noștri
          </h2>
          <div className="flex justify-center">
            <div className="w-16 h-px bg-gold" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((t, i) => (
            <motion.div
              key={t.id}
              className="card-elegant bg-white p-8 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-primary/10">
                <Quote className="h-10 w-10 fill-current" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`h-4 w-4 ${si < t.rating ? "fill-gold text-gold" : "text-gray-200 fill-gray-200"}`}
                  />
                ))}
              </div>

              <p className="text-charcoal/70 leading-relaxed font-sans text-sm mb-6 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-display text-primary text-base">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-sans font-medium text-charcoal text-sm">{t.name}</p>
                  {t.date && (
                    <p className="text-xs text-charcoal/40 mt-0.5">
                      {new Date(t.date).toLocaleDateString("ro-RO", { month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


