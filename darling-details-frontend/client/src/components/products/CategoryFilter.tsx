import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { categoryService } from "@/services";
import type { Category } from "@shared/schema";

export function CategoryFilter() {
  const [, setLocation] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await categoryService.getCategories();
    },
  });
  
  // Extract the actual categories array with a default empty array
  const categories = categoriesResponse?.data || [];

  const handleCategoryClick = (slug: string | null) => {
    setActiveCategory(slug);
    setLocation(slug ? `/products?category=${slug}` : '/products');
  };

  if (isLoading) {
    return (
      <div className="space-x-2 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-24 bg-gray-200 rounded-full inline-block"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-3"
    >
      <motion.button
        onClick={() => handleCategoryClick(null)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
          activeCategory === null
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
        )}
      >
        Toate
      </motion.button>
      {categories.map((category) => (
        <motion.button
          key={category.id}
          onClick={() => handleCategoryClick(category.slug)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
            activeCategory === category.slug
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
          )}
        >
          {category.name}
        </motion.button>
      ))}
    </motion.div>
  );
}