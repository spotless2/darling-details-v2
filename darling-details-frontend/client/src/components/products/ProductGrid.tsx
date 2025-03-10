import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./ProductCard";
import { productService } from "@/services";
import type { Product } from "@shared/schema";

interface ProductGridProps {
  categoryId?: number;
}

export function ProductGrid({ categoryId }: ProductGridProps) {
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["products", { categoryId }],
    queryFn: async () => {
      // When categoryId is provided, filter products by category
      const filters = categoryId ? { categoryId: categoryId.toString() } : {};
      return await productService.getProducts(filters);
    },
  });
  
  // Get the products array from the response, defaulting to empty array
  const products = productsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-80 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nu am găsit produse în această categorie.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
