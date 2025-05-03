import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/products/ProductCard";
import { categoryService, productService } from "@/services";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react"; // Add this import
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/PageHeader";

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

// Replace the entire return statement

return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Use the same PageHeader component as About page */}
    <PageHeader
      title="Colecția Noastră"
      description="Explorează toate produsele noastre pentru evenimente speciale, organizate pe categorii"
    />

{/* Search section with improved contrast */}
<div className="bg-gradient-to-b from-primary/5 to-white py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div 
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      <div className="bg-white p-6 rounded-lg shadow-md border border-primary/30">
        <div className="relative">
          <Input
            type="text"
            placeholder="Caută produse după nume sau descriere..."
            className="pl-10 py-6 border-primary/30 focus:border-primary focus:ring-primary/40 bg-primary/10 placeholder:text-primary/70 text-gray-800 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-primary" />
        </div>
        
        {searchQuery && (
          <div className="mt-3 text-sm text-primary font-medium">
            {filteredProducts.length === 0 ? (
              <p>Nu am găsit rezultate pentru "<span className="text-primary font-bold">{searchQuery}</span>"</p>
            ) : (
              <p>Am găsit <span className="text-primary font-bold">{filteredProducts.length}</span> produse pentru "<span className="text-primary font-bold">{searchQuery}</span>"</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  </div>
</div>

    {/* Product listings section */}
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
                className="mt-4 text-primary hover:text-primary/80"
                onClick={() => setSearchQuery("")}
              >
                Șterge căutarea
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  </motion.div>
);
}