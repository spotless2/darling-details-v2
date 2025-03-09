import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Category } from "@shared/schema";

export function CategoryFilter() {
  const [location] = useLocation();
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

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
      <Link href="/products">
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
            location === "/products"
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
          )}
        >
          Toate
        </motion.a>
      </Link>
      {categories?.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
              location === `/products?category=${category.slug}`
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
            )}
          >
            {category.name}
          </motion.a>
        </Link>
      ))}
    </motion.div>
  );
}