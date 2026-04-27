import { Link, useLocation } from "wouter";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ScrollToTopLink = ({ href, children, className = "", onClick = null }: any) => {
  const [, setLocation] = useLocation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onClick) onClick();
    setTimeout(() => setLocation(href), 80);
  };
  return <a href={href} onClick={handleClick} className={className}>{children}</a>;
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location === "/";
  const transparent = isHome && !scrolled;

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500",
          transparent
            ? "bg-transparent border-transparent"
            : "glass-navbar border-b border-white/60 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.08)]"
        )}
        initial={false}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <ScrollToTopLink href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-[hsl(348,45%,42%,0.1)] border border-[hsl(348,45%,42%,0.2)] flex items-center justify-center group-hover:bg-[hsl(348,45%,42%,0.2)] transition-colors duration-300">
                <Heart className="h-4 w-4 text-gold" />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className={cn(
                    "font-display text-xl font-medium tracking-wide transition-colors duration-300",
                    transparent ? "text-white" : "text-charcoal"
                  )}
                >
                  {SITE_CONFIG.name}
                </span>
                <span
                  className={cn(
                    "text-[10px] tracking-[0.25em] uppercase font-sans transition-colors duration-300",
                    transparent ? "text-white/70" : "text-gold"
                  )}
                >
                  evenimente & decorațiuni
                </span>
              </div>
            </ScrollToTopLink>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => {
                const active = location === item.href;
                return (
                  <ScrollToTopLink
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative text-sm tracking-[0.12em] uppercase font-sans font-medium transition-colors duration-300 py-1",
                      transparent
                        ? active ? "text-white" : "text-white/75 hover:text-white"
                        : active ? "text-primary" : "text-charcoal/70 hover:text-primary"
                    )}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-px bg-current"
                      />
                    )}
                  </ScrollToTopLink>
                );
              })}
              <ScrollToTopLink
                href="/contact"
                className={cn(
                  "ml-2 px-5 py-2 text-xs tracking-[0.15em] uppercase font-sans font-medium border transition-all duration-300",
                  transparent
                    ? "border-white/50 text-white hover:bg-white hover:text-primary"
                    : "border-primary text-primary hover:bg-primary hover:text-white"
                )}
              >
                Rezervă
              </ScrollToTopLink>
            </div>

            {/* Mobile hamburger */}
            <button
              className={cn(
                "md:hidden p-2 rounded-sm transition-colors",
                transparent ? "text-white hover:bg-white/10" : "text-charcoal hover:bg-primary/10"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100">
                <span className="font-display text-lg text-charcoal">{SITE_CONFIG.name}</span>
                <button onClick={() => setIsOpen(false)} className="p-2 text-charcoal/60 hover:text-primary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 px-6 py-8 space-y-1">
                {NAV_ITEMS.map((item, i) => {
                  const active = location === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <ScrollToTopLink
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 text-sm tracking-[0.12em] uppercase font-sans font-medium rounded-sm transition-all",
                          active
                            ? "bg-[hsl(348,45%,42%,0.1)] text-[hsl(348,45%,42%)]"
                            : "text-charcoal/70 hover:text-[hsl(348,45%,42%)] hover:bg-[hsl(348,45%,42%,0.05)]"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </ScrollToTopLink>
                    </motion.div>
                  );
                })}
              </nav>
              <div className="px-6 pb-8">
                <ScrollToTopLink
                  href="/contact"
                  className="block text-center px-6 py-3 text-xs tracking-widest uppercase font-sans font-medium transition-colors btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Rezervă Acum
                </ScrollToTopLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
