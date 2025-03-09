import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { PageHeader } from "@/components/layout/PageHeader";
import type { Category } from "@shared/schema";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default function Products() {
  const [location] = useLocation();
  const categorySlug = new URLSearchParams(location.split("?")[1]).get("category");

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const currentCategory = categories?.find((c) => c.slug === categorySlug);

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <PageHeader
        title={currentCategory ? currentCategory.name : "Toate Produsele"}
        description={currentCategory?.description}
      >
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CategoryFilter />
        </motion.div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="min-h-[400px]"
        >
          <ProductGrid categoryId={currentCategory?.id} />
        </motion.div>
      </div>
    </motion.div>
  );
}