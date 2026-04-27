import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { getBackendUrl } from "@/services/apiClient";

const backendUrl = getBackendUrl();

const getImageUrl = (url: string | undefined | null): string => {
  if (!url) return "https://placehold.co/600x600/png?text=No+Image";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Prepend backend URL for relative paths like /uploads/...
  return `${backendUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

const ScrollToTopLink = ({ href, children, className = "" }: any) => {
  const [, setLocation] = useLocation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setLocation(href), 80);
  };
  return <a href={href} onClick={handleClick} className={className}>{children}</a>;
};

export function FeaturedCategories() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: categoriesResponse, isLoading: loadingCats } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const r = await fetch("/api/categories");
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
  });

  const { data: productsResponse, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const r = await fetch("/api/products");
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
  });

  const categories: any[] = categoriesResponse?.data || [];
  const allProducts: any[] = productsResponse?.data || [];

  const groups = useMemo(
    () => [
      {
        category: {
          id: "all",
          name: "Toate produsele",
          slug: "toate",
          description: "Descoperă cele mai noi creații din colecția noastră.",
        },
        products: allProducts.slice(0, 4),
      },
      ...categories.map((cat) => ({
        category: cat,
        products: allProducts.filter((p) => p.categoryId === cat.id).slice(0, 4),
      })),
    ],
    [categories, allProducts]
  );

  const navigate = useCallback(
    (dir: number) => {
      setActiveIndex((c) => (c + dir + groups.length) % groups.length);
    },
    [groups.length]
  );

  useEffect(() => {
    if (activeIndex >= groups.length) {
      setActiveIndex(0);
    }
  }, [groups.length, activeIndex]);

  useEffect(() => {
    if (isPaused || groups.length <= 1) return;
    const t = setInterval(() => navigate(1), 5500);
    return () => clearInterval(t);
  }, [navigate, isPaused, groups.length]);

  if (loadingCats || loadingProducts) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!groups.length) return null;

  const group = groups[activeIndex];

  return (
    <section
      className="py-24 bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="section-label mb-3">Colecțiile Noastre</p>
            <h2
              className="font-display text-charcoal"
              style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)" }}
            >
              Explorează Galeria
            </h2>
            <div className="w-16 h-px bg-gold mt-4" />
          </div>
          <ScrollToTopLink
            href="/products"
            className="flex items-center gap-2 text-sm tracking-wider uppercase font-sans text-[hsl(348,45%,42%)] hover:text-[hsl(348,45%,42%,0.7)] transition-colors border-b border-[hsl(348,45%,42%,0.3)] hover:border-[hsl(348,45%,42%)] pb-0.5 self-end"
          >
            Vezi toate produsele
            <ArrowRight className="h-4 w-4" />
          </ScrollToTopLink>
        </motion.div>

        {/* Category tabs */}
        {groups.length > 1 && (
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 hide-scrollbar">
            {groups.map((group, i) => (
              <button
                key={group.category.id}
                onClick={() => setActiveIndex(i)}
                className={`px-5 py-2 text-xs tracking-[0.15em] uppercase font-sans whitespace-nowrap transition-all duration-300 rounded-sm ${
                  i === activeIndex
                    ? "bg-charcoal text-white"
                    : "border border-gray-200 text-charcoal/60 hover:border-charcoal/40 hover:text-charcoal"
                }`}
              >
                {group.category.name}
              </button>
            ))}
          </div>
        )}

        {/* Products grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {group.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    className="hover-zoom group relative overflow-hidden rounded-sm aspect-square cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <ScrollToTopLink
                      href={group.category.id === "all" ? `/products` : `/products?category=${group.category.slug}`}
                      className="block w-full h-full"
                    >
                      <img
                        src={getImageUrl(product.thumbnailUrl || product.imageUrl)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/400x400/png?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4">
                        <p className="text-white font-display text-lg leading-tight">
                          {product.name}
                        </p>
                        {product.price && (
                          <p className="text-gold text-sm font-sans mt-1">
                            {parseFloat(product.price).toFixed(0)} lei
                          </p>
                        )}
                      </div>
                    </ScrollToTopLink>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-sm">
                <p className="text-charcoal/40 font-sans text-sm">
                  Nu există produse în această categorie.
                </p>
              </div>
            )}

            {/* Category info + CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-8 pt-8 border-t border-gray-100 gap-4">
              <div>
                <h3 className="font-display text-charcoal text-xl">
                  {group.category.name}
                </h3>
                {group.category.description && (
                  <p className="text-charcoal/50 text-sm font-sans mt-1 max-w-md">
                    {group.category.description}
                  </p>
                )}
              </div>
              <ScrollToTopLink
                href={group.category.id === "all" ? "/products" : `/products?category=${group.category.slug}`}
                className="btn-primary px-6 py-2.5 hover:-translate-y-0.5 shadow-sm shrink-0"
              >
                Vezi Galeria
                <ArrowRight className="h-3.5 w-3.5" />
              </ScrollToTopLink>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        {groups.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {groups.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === activeIndex
                    ? "w-6 h-2"
                    : "w-2 h-2 hover:bg-gray-400"
                }`}
                style={{ backgroundColor: i === activeIndex ? 'hsl(348, 45%, 42%)' : '#d1d5db' }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
