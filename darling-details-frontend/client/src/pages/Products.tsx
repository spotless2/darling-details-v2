import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { categoryService, productService } from "@/services";
import { useState, useRef, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { ZoomIn, X as XIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// Utility function to handle image URLs
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

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const categoryRefs = useRef<Record<string, HTMLElement | null>>({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20); // Higher limit for gallery view
  
  // Fetch all categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await categoryService.getCategories()
  });
  
  // Fetch products with pagination
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["all-products", page, limit, activeCategory],
    queryFn: async () => {
      const params: any = { page, limit };
      // Add category filter to API request if selected
      if (activeCategory) params.categoryId = activeCategory;
      return await productService.getProducts(params);
    }
  });

  const categories = categoriesResponse?.data || [];
  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;
  
  // No longer need to filter products by category as we're doing it in the API
  const filteredProducts = products;
  
  // Group products by category - only when we have products
  const productsByCategory = categories.map(category => ({
    category,
    products: filteredProducts.filter(product => 
      activeCategory ? (product.categoryId === category.id && product.categoryId === activeCategory) 
                     : product.categoryId === category.id
    )
  }));

  // Reset to first page when category changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  // Scroll to category section when activeCategory changes
  useEffect(() => {
    if (activeCategory && categoryRefs.current[activeCategory]) {
      categoryRefs.current[activeCategory]?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [activeCategory]);

  // Clear category filter
  const clearFilters = () => {
    setActiveCategory(null);
  };

  // Pagination functions
  const handlePreviousPage = () => {
    setPage(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    if (pagination && page < pagination.totalPages) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Function to handle product click and show modal
  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Gallery Header */}
      <PageHeader
        title="Galeria Noastră"
        description="Explorează colecția noastră de produse și decorațiuni pentru evenimente speciale"
      />

      {/* Improved Mobile-friendly Category Navigation */}
      <div className="bg-primary/5 sticky top-16 z-10 border-y border-primary/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Mobile Dropdown (visible on small screens) */}
          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>
                    {activeCategory 
                      ? categories.find(c => c.id === activeCategory)?.name 
                      : 'Toate categoriile'}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                <DropdownMenuItem 
                  onClick={() => setActiveCategory(null)}
                  className={!activeCategory ? "bg-primary/10 text-primary" : ""}
                >
                  Toate categoriile
                </DropdownMenuItem>
                {categories.map(category => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={activeCategory === category.id ? "bg-primary/10 text-primary" : ""}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Desktop Buttons (hidden on mobile) */}
          <div className="hidden sm:flex flex-wrap gap-2">
            <Button 
              variant={!activeCategory ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="whitespace-nowrap"
            >
              Toate
            </Button>
            
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Active filter indicator (visible on all screen sizes) */}
          {activeCategory && (
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="outline" className="bg-primary/5 text-primary">
                {categories.find(c => c.id === activeCategory)?.name}
                <button 
                  className="ml-1" 
                  onClick={() => setActiveCategory(null)} 
                  aria-label="Remove category filter"
                >
                  <XIcon size={12} />
                </button>
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-primary hover:text-primary/80"
              >
                Resetează
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory || 'all'}-${page}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="space-y-10 sm:space-y-16"
            >
              {/* Display products by category */}
              {productsByCategory
                .filter(group => group.products.length > 0) // Only show categories with products
                .map(({ category, products }) => (
                  <motion.section 
                    key={category.id} 
                    variants={itemVariants}
                    className="scroll-mt-32"
                    id={`category-${category.slug}`}
                    ref={el => categoryRefs.current[category.id] = el}
                  >
                    <div className="flex items-center mb-4 sm:mb-8">
                      <h2 className="text-xl sm:text-3xl font-display text-gray-900 flex flex-wrap items-center gap-2">
                        {category.name}
                        <Badge variant="outline" className="bg-primary/5 text-primary text-xs sm:text-sm">
                          {products.length} imagini
                        </Badge>
                      </h2>
                      <Separator className="flex-grow ml-4 sm:ml-6 hidden sm:block" />
                    </div>
                    
                    {category.description && (
                      <p className="text-gray-600 mb-4 sm:mb-8 max-w-3xl text-sm sm:text-base">
                        {category.description}
                      </p>
                    )}
                    
                    {/* Optimized Gallery Grid - Better for mobile viewing and scrolling */}
                    {products.length === 1 ? (
                      // Special case for single image in a category - different for mobile vs desktop
                      <div className="block sm:hidden max-w-lg mx-auto">
                        <motion.div
                          whileHover={{ 
                            scale: 1.02,
                            transition: { duration: 0.2 } 
                          }}
                          className="group relative aspect-square cursor-pointer"
                          onClick={() => handleProductClick(products[0])}
                        >
                          {/* Mobile single image view */}
                          <div className="relative w-full h-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                            <img 
                              src={getImageUrl(products[0].imageUrl)} 
                              alt={products[0].name || 'Product Image'} 
                              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                              <h3 className="text-white font-medium text-base sm:text-lg line-clamp-1">{products[0].name}</h3>
                              
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-white/90 text-xs sm:text-sm">
                                  {products[0].category?.name || categories.find(c => c.id === products[0].categoryId)?.name}
                                </span>
                                <span className="bg-primary/80 text-white text-xs p-1 rounded-full">
                                  <ZoomIn size={14} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : null}
                    
                    {/* Desktop view for all cases (including single products) */}
                    <div className={`${products.length === 1 ? 'hidden sm:grid' : 'grid'} grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6`}>
                      {products.map(product => (
                        <motion.div
                          key={product.id}
                          whileHover={{ 
                            scale: 1.02,
                            transition: { duration: 0.2 } 
                          }}
                          className="group relative aspect-square cursor-pointer"
                          onClick={() => handleProductClick(product)}
                        >
                          {/* Image Container */}
                          <div className="relative w-full h-full overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                            {/* Product Image with URL handling */}
                            <img 
                              src={getImageUrl(product.imageUrl)} 
                              alt={product.name || 'Product Image'} 
                              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                            />
                            
                            {/* Overlay with minimal info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-4">
                              <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">{product.name}</h3>
                              
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-white/90 text-xs hidden sm:inline-block">
                                  {product.category?.name || categories.find(c => c.id === product.categoryId)?.name}
                                </span>
                                <span className="bg-primary/80 text-white text-xs p-1 rounded-full ml-auto">
                                  <ZoomIn size={14} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                ))}
                
              {/* No results message */}
              {filteredProducts.length === 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-12 sm:py-20"
                >
                  <div className="max-w-md mx-auto px-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Nu am găsit imagini
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Încercați să selectați o altă categorie.
                    </p>
                    <Button 
                      onClick={clearFilters}
                      variant="default"
                    >
                      Afișează toată galeria
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {/* Pagination controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Pagina anterioară
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Pagina {page} din {pagination.totalPages}
                    {pagination.total > 0 && ` (${pagination.total} produse în total)`}
                  </span>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleNextPage}
                    disabled={page >= pagination.totalPages}
                    className="flex items-center gap-1"
                  >
                    Pagina următoare
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Improved Image Gallery Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-white/95 backdrop-blur-sm max-h-[90vh] max-w-[95vw]">
          <div className="relative w-full h-full max-h-[80vh] overflow-y-auto">
            {selectedProduct && (
              <div className="flex flex-col md:flex-row">
                {/* Image - optimized for mobile and desktop */}
                <div className="w-full md:w-2/3 h-[50vh] md:h-[70vh] relative bg-black/5 flex items-center justify-center">
                  <img 
                    src={getImageUrl(selectedProduct.imageUrl)} 
                    alt={selectedProduct.name || 'Product Image'} 
                    className="max-w-full max-h-full object-contain p-2"
                  />
                </div>
                
                {/* Product Details */}
                <div className="w-full md:w-1/3 p-4 sm:p-6 space-y-3 md:space-y-4 border-t md:border-t-0 md:border-l border-gray-200">
                  <h2 className="text-xl sm:text-2xl font-display text-gray-900">{selectedProduct.name}</h2>
                  
                  <Badge variant="outline" className="bg-primary/5 text-primary">
                    {categories.find(c => c.id === selectedProduct.categoryId)?.name}
                  </Badge>
                  
                  {selectedProduct.description && (
                    <div className="mt-3 sm:mt-4">
                      <h3 className="text-sm font-medium text-gray-900">Descriere:</h3>
                      <p className="mt-1 sm:mt-2 text-sm text-gray-600">{selectedProduct.description}</p>
                    </div>
                  )}
                  
                  {selectedProduct.details && (
                    <div className="mt-3 sm:mt-4">
                      <h3 className="text-sm font-medium text-gray-900">Detalii:</h3>
                      <p className="mt-1 sm:mt-2 text-sm text-gray-600">{selectedProduct.details}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}