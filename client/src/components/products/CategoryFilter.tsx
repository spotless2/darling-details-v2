import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
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
    <div className="flex flex-wrap gap-2">
      <Link href="/products">
        <a
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            location === "/products"
              ? "bg-primary text-primary-foreground"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          Toate
        </a>
      </Link>
      {categories?.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${category.slug}`}
        >
          <a
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              location === `/products?category=${category.slug}`
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {category.name}
          </a>
        </Link>
      ))}
    </div>
  );
}
