import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface HeroSlide {
  id?: number;
  image?: string;
  imageUrl?: string;
  title: string;
  subtitle: string;
  description: string;
}

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1920&h=1080&fit=crop&q=85",
    title: "Mărturii Personalizate",
    subtitle: "Amintiri de Neuitat",
    description: "Oferă invitaților tăi mărturii unice care vor păstra vie amintirea acestei zile speciale.",
  },
  {
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&h=1080&fit=crop&q=85",
    title: "Decorațiuni pentru Evenimente",
    subtitle: "Elegante și Rafinate",
    description: "Transformăm locația evenimentului tău într-un spațiu de poveste cu decorațiuni atent selecționate.",
  },
  {
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&h=1080&fit=crop&q=85",
    title: "Atmosferă Magică",
    subtitle: "Lumini & Efecte",
    description: "Iluminat ambiental și efecte speciale pentru momente de vis, irepetabile.",
  },
];

export function Hero() {
  const [, setLocation] = useLocation();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const { data: slidesData } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const res = await fetch("/api/hero-slides/active");
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });

  const slides: HeroSlide[] =
    slidesData && Array.isArray(slidesData) && slidesData.length > 0
      ? slidesData
      : FALLBACK_SLIDES;

  const navigate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setCurrent((c) => (c + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => navigate(1), 6000);
    return () => clearInterval(t);
  }, [navigate, isPaused]);

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  const slide = slides[current];
  const bgImage = slide.imageUrl || slide.image;

  return (
    <section
      className="relative w-full h-screen min-h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background images */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, scale: 1.08, x: direction > 0 ? 60 : -60 }}
          animate={{ opacity: 1, scale: 1.05, x: 0 }}
          exit={{ opacity: 0, scale: 1, x: direction > 0 ? -60 : 60 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center animate-ken-burns"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/80 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-5 flex items-center gap-3"
              >
                <span className="w-8 h-px bg-gold" />
                {slide.subtitle}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="font-display text-white text-shadow-hero leading-[1.1] mb-6"
                style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-white/75 text-base sm:text-lg font-sans font-light leading-relaxed mb-10 max-w-lg"
              >
                {slide.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0 });
                    setLocation("/products");
                  }}
                  className="px-8 py-3.5 bg-primary text-white text-sm tracking-widest uppercase font-sans font-medium hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(176,68,88,0.5)]"
                >
                  Descoperă Produsele
                </button>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0 });
                    setLocation("/contact");
                  }}
                  className="px-8 py-3.5 border border-white/50 text-white text-sm tracking-widest uppercase font-sans font-medium hover:bg-white/10 hover:border-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  Contactează-ne
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`transition-all duration-400 rounded-full ${
              i === current
                ? "w-8 h-1.5 bg-gold"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 border border-white/25 text-white/70 hover:text-white hover:border-white/60 hover:bg-white/10 transition-all duration-300 hidden md:flex items-center justify-center"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => navigate(1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 border border-white/25 text-white/70 hover:text-white hover:border-white/60 hover:bg-white/10 transition-all duration-300 hidden md:flex items-center justify-center"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Scroll down hint */}
      <motion.button
        onClick={scrollDown}
        className="absolute bottom-10 right-8 z-10 text-white/50 hover:text-white hidden md:flex flex-col items-center gap-2 transition-colors duration-300"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase font-sans">Scroll</span>
        <ArrowDown className="h-4 w-4" />
      </motion.button>
    </section>
  );
}
