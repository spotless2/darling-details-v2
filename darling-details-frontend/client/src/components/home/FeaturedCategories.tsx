import { useQuery } from "@tanstack/react-query";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { Category, Product } from "@shared/schema";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Add this utility function to safely format prices
const formatPrice = (price: any): string => {
  if (typeof price === "number") {
    return price.toFixed(2);
  }
  if (typeof price === "string" && !isNaN(parseFloat(price))) {
    return parseFloat(price).toFixed(2);
  }
  return "0.00"; // fallback for undefined/null/invalid values
};

export function FeaturedCategories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  // Fetch categories
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery(
    {
      queryKey: ["categories"],
      queryFn: async () => {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      },
    }
  );

  // Fetch products
  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  const categories = categoriesResponse?.data || [];
  const allProducts = productsResponse?.data || [];

  const isLoading = isLoadingCategories || isLoadingProducts;

  // Group products by category
  const productsByCategory = categories.map((category) => {
    const categoryProducts = allProducts
      .filter((product) => product.categoryId === category.id)
      .slice(0, 3); // Limit to 3 products per category

    return {
      category,
      products: categoryProducts,
    };
  });

  // Carousel navigation
  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev > 0 ? prev - 1 : productsByCategory.length - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev < productsByCategory.length - 1 ? prev + 1 : 0
    );
  };

  // Add this to your component before the return statement
  const [mobileProductIndex, setMobileProductIndex] = useState(0);

  useEffect(() => {
    const currentGroup = productsByCategory[activeIndex];
    if (currentGroup?.products?.length > 1) {
      const timer = setTimeout(() => {
        setMobileProductIndex((prev) =>
          prev < currentGroup.products.length - 1 ? prev + 1 : 0
        );
      }, 2200); // Change every 3 seconds

      return () => clearTimeout(timer);
    }
  }, [mobileProductIndex, productsByCategory, activeIndex]);

  if (isLoading) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-64 mb-4 mx-auto" />
        <Skeleton className="h-6 w-96 mb-16 mx-auto" />
        <div className="relative h-96">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity, y }}
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-display mb-4">Categorii de Produse</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descoperă gama noastră completă de produse și servicii pentru
          evenimente memorabile
        </p>
      </motion.div>

      {/* Replace just the Featured category with products section */}
      <div className="relative mb-12">
        {/* Repositioned Navigation buttons - now at top corners with better contrast */}
        <div className="absolute z-20 flex justify-between w-full top-3 px-3 md:px-6 pointer-events-none">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg bg-primary text-white hover:bg-primary/90 pointer-events-auto h-8 w-8"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-lg bg-primary text-white hover:bg-primary/90 pointer-events-auto h-8 w-8"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {productsByCategory.map(
            (group, idx) =>
              idx === activeIndex && (
                <motion.div
                  key={group.category.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-2xl"
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        group.category.image || "/placeholder-category.jpg"
                      })`,
                      filter: "blur(1px)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/60" />

                  {/* Content container - completely restructured for mobile */}
                  <div className="relative z-10 p-5 md:p-8 flex flex-col min-h-[550px] md:min-h-[480px]">
                    {/* Category information - always at top */}
                    <div className="text-center mb-5 md:mb-7 pt-4">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="bg-primary/80 text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                          Categorie Populară
                        </span>
                      </motion.div>

                      <motion.h3
                        className="text-2xl md:text-4xl font-display text-white mt-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {group.category.name}
                      </motion.h3>

                      <motion.p
                        className="text-white/90 text-sm md:text-base mt-2 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        {group.category.description}
                      </motion.p>
                    </div>

                    {/* Mobile: Single product at a time with auto-advance */}
                    <div className="md:hidden flex-grow flex flex-col justify-center">
                      {group.products.length > 0 ? (
                        <div className="relative">
                          <AnimatePresence mode="wait">
                            {group.products.map(
                              (product, index) =>
                                index === mobileProductIndex && (
                                  <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl shadow-xl overflow-hidden mx-auto max-w-[240px]"
                                  >
                                    <Link href={`/products/${product.id}`}>
                                      <div className="relative h-36 bg-gray-200">
                                        <img
                                          src={
                                            product.imageUrl ||
                                            "/placeholder-product.jpg"
                                          }
                                          alt={product.name}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-white/90 text-black px-2 py-0.5 rounded-full text-xs font-medium">
                                          {formatPrice(product.price)} RON
                                        </div>
                                      </div>
                                      <div className="p-3">
                                        <h4 className="font-medium text-sm truncate">
                                          {product.name}
                                        </h4>
                                        <p className="text-gray-600 text-xs mt-1 line-clamp-1">
                                          {product.description?.substring(
                                            0,
                                            60
                                          ) || ""}
                                        </p>
                                        <div className="mt-2 flex items-center justify-between">
                                          <span className="text-xs text-primary font-medium">
                                            Vezi detalii
                                          </span>
                                          <ArrowRight className="h-3 w-3 text-primary" />
                                        </div>
                                      </div>
                                    </Link>
                                  </motion.div>
                                )
                            )}
                          </AnimatePresence>

                          {/* Product pagination dots */}
                          {group.products.length > 1 && (
                            <div className="flex justify-center mt-3 gap-1.5">
                              {group.products.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setMobileProductIndex(idx)}
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                                    idx === mobileProductIndex
                                      ? "bg-primary scale-110"
                                      : "bg-white/60"
                                  }`}
                                  aria-label={`Show product ${idx + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32 bg-white/10 backdrop-blur-sm rounded-xl">
                          <p className="text-white text-sm">
                            Nu există produse în această categorie
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Desktop: Products Grid (add this new section) */}
                    <div className="hidden md:block flex-grow">
                      {group.products.length > 0 ? (
                        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                          {group.products.slice(0, 3).map((product, index) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              whileHover={{
                                y: -5,
                                transition: { duration: 0.2 },
                              }}
                              className="bg-white rounded-xl shadow-xl overflow-hidden h-full"
                            >
                              <Link href={`/products/${product.id}`}>
                                <div className="relative h-48 bg-gray-200">
                                  <img
                                    src={
                                      product.imageUrl ||
                                      "/placeholder-product.jpg"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-3 right-3 bg-white/90 text-black px-2 py-1 rounded-full text-xs font-medium">
                                    {formatPrice(product.price)} RON
                                  </div>
                                </div>
                                <div className="p-4">
                                  <h4 className="font-medium text-base truncate">
                                    {product.name}
                                  </h4>
                                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                    {product.description?.substring(0, 80) ||
                                      ""}
                                  </p>
                                  <div className="mt-3 flex items-center justify-between">
                                    <span className="text-sm text-primary font-medium">
                                      Vezi detalii
                                    </span>
                                    <ArrowRight className="h-4 w-4 text-primary" />
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-white/10 backdrop-blur-sm rounded-xl max-w-4xl mx-auto">
                          <p className="text-white">
                            Nu există produse în această categorie
                          </p>
                        </div>
                      )}
                    </div>

                    {/* View all button - always at bottom */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-5 md:mt-7 text-center"
                    >
                      <Link href={`/products?category=${group.category.slug}`}>
                        <Button className="group bg-white/90 hover:bg-white text-black hover:text-black border-0 w-auto">
                          Vezi toate produsele
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Indicators - moved outside the main carousel */}
        <div className="flex justify-center mt-4 gap-2">
          {productsByCategory.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "bg-primary scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`View category ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Category browse grid */}
      <motion.div
        className={`grid gap-6 mt-16 ${
          // Adjust grid columns based on number of categories
          categories.length === 1
            ? "grid-cols-1 max-w-md mx-auto"
            : categories.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
            : categories.length === 3
            ? "grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto"
            : categories.length === 4
            ? "grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        }`}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              show: { opacity: 1, scale: 1 },
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            onHoverStart={() => setHoveredCategory(index)}
            onHoverEnd={() => setHoveredCategory(null)}
          >
            <Link href={`/products?category=${category.slug}`}>
              <Card className="cursor-pointer overflow-hidden h-40 md:h-48">
                <CardContent className="p-0 relative h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{
                      backgroundImage: `url(${
                        category.image || "/placeholder-category.jpg"
                      })`,
                    }}
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      hoveredCategory === index ? "bg-black/60" : "bg-black/40"
                    }`}
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                    <h3 className="text-lg font-medium text-white text-center">
                      {category.name}
                    </h3>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: hoveredCategory === index ? 1 : 0,
                        y: hoveredCategory === index ? 0 : 10,
                      }}
                      transition={{ duration: 0.2 }}
                      className="text-xs text-white mt-1"
                    >
                      Vezi produse →
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
