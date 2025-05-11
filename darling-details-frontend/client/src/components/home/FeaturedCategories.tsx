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
import { Link, useLocation } from "wouter"; // Add useLocation import
import type { Category, Product } from "@shared/schema";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

// Utility function to handle image URLs - matching the Products page implementation
const getImageUrl = (imageUrl: string | undefined | null): string => {
  if (!imageUrl) return 'https://placehold.co/600x600/png?text=No+Image';
  
  try {
    // In development mode, fix URLs that contain the frontend origin
    if (import.meta.env.DEV) {
      // Check if the URL includes the frontend origin (localhost:5173)
      if (imageUrl.includes('localhost:5173')) {
        // Extract just the path portion (everything after the origin)
        const path = new URL(imageUrl).pathname;
        // Return the backend URL + the path
        return `http://localhost:3000${path}`;
      }
      
      // If it's a relative path, just prepend the backend URL
      if (!imageUrl.startsWith('http')) {
        return `http://localhost:3000${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }
    }
    
    // For production or URLs that don't need fixing
    return imageUrl;
  } catch (error) {
    // If URL parsing fails, return the original URL as a fallback
    console.error("Error parsing image URL:", error);
    return imageUrl;
  }
};

// Custom link component that scrolls to top
const ScrollToTopLink = ({ href, children, className = "" }) => {
  const [, setLocation] = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    
    // First scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Then navigate to the new location (after a small delay to allow smooth scroll)
    setTimeout(() => {
      setLocation(href);
    }, 100);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export function FeaturedCategories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [mobileProductIndex, setMobileProductIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true); // New state for auto-scroll control

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

  // Auto-scroll through categories
  useEffect(() => {
    if (!autoScroll || productsByCategory.length <= 1) return;
    
    const timer = setTimeout(() => {
      setActiveIndex((prev) => 
        prev < productsByCategory.length - 1 ? prev + 1 : 0
      );
    }, 6000); // 4.5 seconds between category changes
    
    return () => clearTimeout(timer);
  }, [activeIndex, autoScroll, productsByCategory.length]);
  
  // Pause auto-scroll when user interacts with carousel
  const handleManualNavigation = (index: number) => {
    setActiveIndex(index);
    setAutoScroll(false);
    
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setAutoScroll(true), 10000);
  };
  
  // Modified navigation functions to pause auto-scroll
  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev > 0 ? prev - 1 : productsByCategory.length - 1
    );
    setMobileProductIndex(0);
    setAutoScroll(false);
    
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setAutoScroll(true), 10000);
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev < productsByCategory.length - 1 ? prev + 1 : 0
    );
    setMobileProductIndex(0);
    setAutoScroll(false);
    
    // Resume auto-scroll after 10 seconds of inactivity
    setTimeout(() => setAutoScroll(true), 10000);
  };

  // Reset mobile product index whenever activeIndex changes
  useEffect(() => {
    setMobileProductIndex(0);
  }, [activeIndex]);

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
        <h2 className="text-3xl font-display mb-4">Explorează Galeria Noastră</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descoperă colecția noastră de decorațiuni și aranjamente pentru evenimente speciale
        </p>
      </motion.div>

      <div className="relative mb-12">
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
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        getImageUrl(group.category.image) || "/placeholder-category.jpg"
                      })`,
                      filter: "blur(1px)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/60" />

                  <div className="relative z-10 p-5 md:p-8 flex flex-col min-h-[550px] md:min-h-[480px]">
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
                                    className="overflow-hidden mx-auto max-w-[300px]"
                                  >
                                    <ScrollToTopLink href={`/products?category=${group.category.slug}`}>
                                      <div className="relative rounded-xl overflow-hidden shadow-lg border border-white/20">
                                        <div className="aspect-square relative">
                                          <img
                                            src={getImageUrl(product.imageUrl) || "/placeholder-product.jpg"}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-110" 
                                            loading="lazy"
                                            onError={(e) => {
                                              e.currentTarget.src = "/placeholder-product.jpg";
                                            }}
                                          />
                                          {/* Simplified overlay without zoom icon */}
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                                            <h4 className="text-white font-medium text-base drop-shadow-md">
                                              {product.name}
                                            </h4>
                                          </div>
                                        </div>
                                      </div>
                                    </ScrollToTopLink>
                                  </motion.div>
                                )
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32 bg-white/10 backdrop-blur-sm rounded-xl">
                          <p className="text-white text-sm">
                            Nu există imagini în această categorie
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="hidden md:block flex-grow">
                      {group.products.length > 0 ? (
                        <div
                          className={`grid gap-6 max-w-4xl mx-auto ${
                            group.products.length === 1
                              ? "grid-cols-1 max-w-md"
                              : group.products.length === 2
                              ? "grid-cols-2 max-w-2xl"
                              : "grid-cols-3"
                          }`}
                        >
                          {group.products.slice(0, 3).map((product, index) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className="overflow-hidden"
                            >
                              <ScrollToTopLink href={`/products?category=${group.category.slug}`}>
                                {/* Redesigned desktop gallery item with beautiful hover effects */}
                                <div className="group relative rounded-xl overflow-hidden shadow-xl border border-white/10 transform transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-2xl">
                                  {/* Image container with elegant hover zoom */}
                                  <div className="aspect-square overflow-hidden">
                                    <img
                                      src={getImageUrl(product.imageUrl) || "/placeholder-product.jpg"}
                                      alt={product.name}
                                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                      loading="lazy"
                                      onError={(e) => {
                                        e.currentTarget.src = "/placeholder-product.jpg";
                                      }}
                                    />
                                  </div>
                                  
                                  {/* Beautiful gradient overlay with reveal animation */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                      {/* Image name */}
                                      <h4 className="text-white font-medium text-lg tracking-wide drop-shadow-md mb-2">
                                        {product.name}
                                      </h4>
                                      
                                      {/* Elegant action indicator */}
                                      <div className="flex justify-between items-center">
                                        <span className="text-white/90 text-xs">
                                          {categories.find(c => c.id === product.categoryId)?.name}
                                        </span>
                                        <span className="bg-white text-primary p-2 rounded-full shadow-lg transform transition-all duration-300 scale-0 group-hover:scale-100">
                                          <ZoomIn size={18} />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </ScrollToTopLink>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-white/10 backdrop-blur-sm rounded-xl max-w-4xl mx-auto">
                          <p className="text-white">
                            Nu există imagini în această categorie
                          </p>
                        </div>
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-5 md:mt-7 text-center"
                    >
                      <ScrollToTopLink href={`/products?category=${group.category.slug}`}>
                        <Button className="group bg-white/90 hover:bg-white text-black hover:text-black border-0 w-auto text-base px-6 py-5"> {/* Increased button size */}
                          Vezi întreaga galerie
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /> {/* Increased icon size */}
                        </Button>
                      </ScrollToTopLink>
                    </motion.div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-4 gap-2">
          {productsByCategory.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleManualNavigation(idx)} // Use new function for manual navigation
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

      <motion.div
        className={`grid gap-6 mt-16 ${
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
            <ScrollToTopLink href={`/products?category=${category.slug}`}>
              {/* Redesigned category card with subtle glass effect */}
              <div className="relative h-40 md:h-48 rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
                {/* Background image with subtle zoom effect */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out hover:scale-110"
                  style={{
                    backgroundImage: `url(${getImageUrl(category.image) || "/placeholder-category.jpg"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                
                {/* Elegant glass-like overlay */}
                <div className={`absolute inset-0 transition-all duration-300 backdrop-blur-[1px] ${
                  hoveredCategory === index 
                    ? "bg-gradient-to-t from-black/80 via-black/50 to-black/30" 
                    : "bg-gradient-to-t from-black/70 via-black/40 to-black/20"
                }`} />

                {/* Content with subtle reveal animation */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  <h3 className="text-lg font-medium text-white text-center drop-shadow-md transition-all duration-300 transform translate-y-0">
                    {category.name}
                  </h3>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: hoveredCategory === index ? 1 : 0,
                      y: hoveredCategory === index ? 0 : 10,
                    }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 bg-white/20 backdrop-blur-sm text-white text-xs py-1 px-3 rounded-full"
                  >
                    Vezi galeria →
                  </motion.div>
                </div>
              </div>
            </ScrollToTopLink>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
