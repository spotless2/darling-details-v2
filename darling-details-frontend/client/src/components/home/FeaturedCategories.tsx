import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import type { Category, Product } from "@shared/schema";
import { useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Add this utility function to safely format prices
const formatPrice = (price: any): string => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  if (typeof price === 'string' && !isNaN(parseFloat(price))) {
    return parseFloat(price).toFixed(2);
  }
  return '0.00'; // fallback for undefined/null/invalid values
};

export function FeaturedCategories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  // Scroll animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  // Fetch categories
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });
  
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
  const productsByCategory = categories.map(category => {
    const categoryProducts = allProducts.filter(product => 
      product.categoryId === category.id
    ).slice(0, 3); // Limit to 3 products per category
    
    return {
      category,
      products: categoryProducts
    };
  });

  // Carousel navigation
  const handlePrev = () => {
    setActiveIndex(prev => (prev > 0 ? prev - 1 : productsByCategory.length - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev < productsByCategory.length - 1 ? prev + 1 : 0));
  };

  if (isLoading) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Skeleton className="h-12 w-64 mb-4 mx-auto" />
        <Skeleton className="h-6 w-96 mb-16 mx-auto" />
        <div className="relative h-96">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
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
        <h2 className="text-3xl font-display mb-4">
          Categorii de Produse
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Descoperă gama noastră completă de produse și servicii pentru evenimente memorabile
        </p>
      </motion.div>

      {/* Featured category with products */}
      <div className="relative mb-12 min-h-[480px]">
        {/* Navigation buttons */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full shadow-lg"
            onClick={handlePrev}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full shadow-lg"
            onClick={handleNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Category + Products carousel */}
        <AnimatePresence mode="wait">
          {productsByCategory.map((group, idx) => (
            idx === activeIndex && (
              <motion.div 
                key={group.category.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                {/* Category information */}
                <div className="space-y-6">
                  <motion.h3 
                    className="text-3xl font-display"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {group.category.name}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {group.category.description}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link href={`/products?category=${group.category.slug}`}>
                      <Button className="group">
                        Vezi toate produsele
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
                
                {/* Featured products */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.products.length > 0 ? (
                    group.products.slice(0, 2).map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                      >
                        <Link href={`/products/${product.id}`}>
                          <div className="relative h-48 bg-gray-200">
                            <img 
                              src={product.images?.[0] || '/placeholder-product.jpg'} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium truncate">{product.name}</h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {formatPrice(product.price)} RON
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-2 flex items-center justify-center h-48 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Nu există produse în această categorie</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {/* Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {productsByCategory.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === activeIndex ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Category browse grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-16"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
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
              show: { opacity: 1, scale: 1 }
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 } 
            }}
            onHoverStart={() => setHoveredCategory(index)}
            onHoverEnd={() => setHoveredCategory(null)}
          >
            <Link href={`/products?category=${category.slug}`}>
              <Card className="cursor-pointer overflow-hidden h-40">
                <CardContent className="p-0 relative h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                    style={{ backgroundImage: `url(${category.image || '/placeholder-category.jpg'})` }}
                  />
                  <div className={`absolute inset-0 transition-opacity duration-300 ${
                    hoveredCategory === index 
                      ? 'bg-black/60' 
                      : 'bg-black/40'
                  }`} />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                    <h3 className="text-lg font-medium text-white text-center">
                      {category.name}
                    </h3>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: hoveredCategory === index ? 1 : 0,
                        y: hoveredCategory === index ? 0 : 10
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