import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { categoryService, productService } from "@/services";
import type { Category, Product } from "@shared/schema";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await categoryService.getCategories()
  });
  
  // Fetch all products at once
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => await productService.getProducts()
  });

  const categories = categoriesResponse?.data || [];
  const allProducts = productsResponse?.data || [];
  
  const filteredProducts = allProducts.filter(product => {
    // Normalize search query - trim whitespace and convert to lowercase
    const query = searchQuery.trim().toLowerCase();
    
    // If no search query, return all products
    if (!query) return true;
    
    // Check product name (with null/undefined check)
    const nameMatch = product.name?.toLowerCase().includes(query) || false;
    
    // Check product description (with null/undefined check)
    const descriptionMatch = product.description?.toLowerCase().includes(query) || false;
    
    // Return true if either name or description matches
    return nameMatch || descriptionMatch;
  });
  
  // Group products by category
  const productsByCategory = categories.map(category => ({
    category,
    products: filteredProducts.filter(product => product.categoryId === category.id)
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Colecția Noastră
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Explorează toate produsele noastre pentru evenimente speciale, organizate pe categorii
          </motion.p>
          
          {/* Search input */}
          <motion.div 
            className="mt-8 max-w-md mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Input
              type="text"
              placeholder="Caută produse..."
              className="pl-10 py-6 rounded-full shadow-md focus:ring-2 focus:ring-purple-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <motion.div 
          className="absolute -bottom-8 left-0 right-0 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <ChevronDown className="h-12 w-12 text-purple-400 animate-bounce" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-16"
          >
            {/* Display products by category */}
            {productsByCategory
              .filter(group => group.products.length > 0) // Only show categories with products
              .map(({ category, products }) => (
                <motion.section 
                  key={category.id} 
                  variants={itemVariants}
                  className="scroll-mt-16"
                  id={`category-${category.slug}`}
                >
                  <div className="flex items-center mb-6">
                    <h2 className="text-3xl font-display text-gray-900">
                      {category.name}
                    </h2>
                    <Separator className="flex-grow ml-6" />
                  </div>
                  
                  {category.description && (
                    <p className="text-gray-600 mb-8 max-w-3xl">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="transform transition-all duration-300"
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ))}
              
            {/* No results message */}
            {searchQuery && !filteredProducts.length && (
              <motion.div 
                variants={itemVariants}
                className="text-center py-16"
              >
                <p className="text-xl text-gray-600">
                  Nu am găsit produse care să corespundă căutării "{searchQuery}"
                </p>
                <button 
                  className="mt-4 text-purple-600 hover:text-purple-800"
                  onClick={() => setSearchQuery("")}
                >
                  Șterge căutarea
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}