import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { Category } from "@shared/schema";

export function FeaturedCategories() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-display text-center mb-8">
        Categorii de Produse
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories?.map((category) => (
          <Link key={category.id} href={`/products?category=${category.slug}`}>
            <Card className="group cursor-pointer overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-64">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-2xl font-display mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-200">{category.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}