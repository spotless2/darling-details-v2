import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { categoryService, productService } from "@/services";
import { useState, useEffect } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useSearch } from "wouter";

const getImageUrl = (url: string | undefined | null): string => {
  if (!url) return "https://placehold.co/600x600/png?text=No+Image";
  try {
    if (import.meta.env.DEV && url.includes("localhost:5173")) {
      return `http://localhost:3000${new URL(url).pathname}`;
    }
    if (!url.startsWith("http")) return `http://localhost:3000${url.startsWith("/") ? "" : "/"}${url}`;
    return url;
  } catch {
    return url;
  }
};

export default function Products() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initCategory = params.get("category") || null;

  const [activeCategory, setActiveCategory] = useState<string | null>(initCategory);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await categoryService.getCategories(),
  });

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["all-products", page, activeCategory, searchQuery],
    queryFn: async () => {
      const p: any = { page, limit: 24 };
      if (activeCategory) p.categorySlug = activeCategory;
      if (searchQuery) p.search = searchQuery;
      return await productService.getProducts(p);
    },
  });

  const categories: any[] = categoriesResponse?.data || [];
  const products: any[] = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;

  useEffect(() => { setPage(1); }, [activeCategory, searchQuery]);

  const openModal = (product: any, index: number) => {
    setSelected(product);
    setSelectedIndex(index);
  };

  const closeModal = () => setSelected(null);

  const navModal = (dir: number) => {
    const newIdx = (selectedIndex + dir + products.length) % products.length;
    setSelectedIndex(newIdx);
    setSelected(products[newIdx]);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") navModal(1);
      if (e.key === "ArrowLeft") navModal(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, selectedIndex, products]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[320px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold" />
              Colecția Darling
            </p>
            <h1 className="font-display text-white text-shadow-hero" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
              Galeria Noastră
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white border-b border-gray-100 sticky top-[79px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 text-xs tracking-widest uppercase font-sans transition-all duration-300 rounded-sm ${
                  !activeCategory
                    ? "bg-charcoal text-white"
                    : "border border-gray-200 text-charcoal/60 hover:border-charcoal/40 hover:text-charcoal"
                }`}
              >
                Toate
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-1.5 text-xs tracking-widest uppercase font-sans transition-all duration-300 rounded-sm ${
                    activeCategory === cat.slug
                      ? "bg-primary text-white"
                      : "border border-gray-200 text-charcoal/60 hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/30" />
              <input
                type="text"
                placeholder="Caută produse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm font-sans border border-gray-200 rounded-sm focus:outline-none focus:border-primary/50 bg-gray-50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 rounded-sm bg-gray-100 flex items-center justify-center mb-6">
              <Search className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="font-display text-charcoal text-xl mb-2">Niciun produs găsit</h3>
            <p className="text-charcoal/50 font-sans text-sm">
              Încearcă altă categorie sau resetează filtrele.
            </p>
            <button
              onClick={() => { setActiveCategory(null); setSearchQuery(""); }}
              className="mt-6 px-6 py-2.5 text-xs tracking-widest uppercase font-sans border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              Resetează Filtrele
            </button>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${page}-${searchQuery}`}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="hover-zoom group relative overflow-hidden rounded-sm aspect-square cursor-pointer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.05, 0.4), duration: 0.4 }}
                  onClick={() => openModal(product, i)}
                >
                  <img
                    src={getImageUrl(product.thumbnailUrl || product.imageUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/400x400/png?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4">
                    <p className="text-white font-display text-base leading-tight">{product.name}</p>
                    {product.price && (
                      <p className="text-gold text-sm font-sans mt-1">{parseFloat(product.price).toFixed(0)} lei</p>
                    )}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ZoomIn className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-16">
            <button
              onClick={() => { setPage((p) => Math.max(p - 1, 1)); window.scrollTo({ top: 0 }); }}
              disabled={page <= 1}
              className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase font-sans border border-gray-200 text-charcoal/60 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-sm font-sans text-charcoal/50">
              {page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => { setPage((p) => p + 1); window.scrollTo({ top: 0 }); }}
              disabled={page >= pagination.totalPages}
              className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase font-sans border border-gray-200 text-charcoal/60 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
            >
              Următor
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-xs tracking-widest uppercase font-sans z-10"
              >
                Închide <X className="h-4 w-4" />
              </button>

              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={getImageUrl(selected.imageUrl)}
                  alt={selected.name}
                  className="w-full max-h-[70vh] object-contain"
                />

                {/* Navigation */}
                {products.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); navModal(-1); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navModal(1); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-300"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Info bar */}
              <div className="bg-charcoal/90 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-white text-lg">{selected.name}</h3>
                  {selected.description && (
                    <p className="text-white/50 text-sm font-sans mt-0.5 line-clamp-1">{selected.description}</p>
                  )}
                </div>
                {selected.price && (
                  <div className="text-right">
                    <p className="text-gold font-display text-xl">{parseFloat(selected.price).toFixed(0)} lei</p>
                    <p className="text-white/40 text-xs font-sans">preț estimativ</p>
                  </div>
                )}
              </div>

              {/* Counter */}
              <div className="text-center mt-3">
                <span className="text-white/30 text-xs font-sans">{selectedIndex + 1} / {products.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
