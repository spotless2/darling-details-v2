import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import type { Category } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const categorySlug = new URLSearchParams(location.split("?")[1]).get("category");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const currentCategory = categories?.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif mb-8">
        {currentCategory ? currentCategory.name : "Toate Produsele"}
      </h1>
      <div className="mb-8">
        <CategoryFilter />
      </div>
      <ProductGrid categoryId={currentCategory?.id} />
    </div>
  );
}
