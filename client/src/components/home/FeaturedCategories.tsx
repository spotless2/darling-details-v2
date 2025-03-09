import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { Category } from "@shared/schema";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

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
    <motion.section 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <motion.div variants={item} className="text-center mb-12">
        <h2 className="text-3xl font-display text-center mb-3">
          Categorii de Produse
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Descoperă gama noastră completă de produse și servicii pentru evenimente memorabile
        </p>
      </motion.div>
      <motion.div 
        variants={container}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {categories?.map((category) => (
          <motion.div key={category.id} variants={item}>
            <Link href={`/products?category=${category.slug}`}>
              <Card className="group cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-64">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${category.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="text-center text-white transform group-hover:scale-105 transition-transform duration-300">
                        <h3 className="text-2xl font-display mb-2">{category.name}</h3>
                        <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {category.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}