import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { productService, categoryService, testimonialService } from "@/services";
import { Package, Tag, MessageSquare, Star, TrendingUp, Image, ArrowRight } from "lucide-react";
import { Link } from "wouter";

function StatCard({ title, value, icon: Icon, color, delay = 0, href }: any) {
  return (
    <motion.div
      className="bg-white rounded-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link href={href || "#"}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase font-sans text-charcoal/40 mb-2">{title}</p>
            <p className="font-display text-charcoal text-3xl">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-sm ${color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-1 mt-4 text-xs text-charcoal/40 font-sans group-hover:text-primary transition-colors">
          <span>Vezi detalii</span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: productsResponse } = useQuery({
    queryKey: ["products"],
    queryFn: async () => await productService.getProducts(),
  });
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await categoryService.getCategories(),
  });
  const { data: testimonialsData } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/testimonials");
      return res.json();
    },
  });

  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  const testimonials = Array.isArray(testimonialsData) ? testimonialsData : [];
  const avgRating = testimonials.length
    ? (testimonials.reduce((s: number, t: any) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : "—";

  const recentProducts = [...products].reverse().slice(0, 5);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-[0.25em] uppercase font-sans text-charcoal/40 mb-1">Panou de Control</p>
          <h1 className="font-display text-charcoal text-3xl">Dashboard</h1>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Produse"
            value={products.length}
            icon={Package}
            color="bg-primary"
            delay={0}
            href="/admin/panel/products"
          />
          <StatCard
            title="Categorii"
            value={categories.length}
            icon={Tag}
            color="bg-gold"
            delay={0.1}
            href="/admin/panel/categories"
          />
          <StatCard
            title="Testimoniale"
            value={testimonials.length}
            icon={MessageSquare}
            color="bg-charcoal"
            delay={0.2}
            href="/admin/panel/testimonials"
          />
          <StatCard
            title="Rating Mediu"
            value={avgRating}
            icon={Star}
            color="bg-amber-500"
            delay={0.3}
          />
        </div>

        {/* Quick actions */}
        <motion.div
          className="bg-white rounded-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-xs tracking-widest uppercase font-sans text-charcoal/40 mb-4">Acțiuni Rapide</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Adaugă Produs", href: "/admin/panel/products/new", icon: Package },
              { label: "Categorii", href: "/admin/panel/categories", icon: Tag },
              { label: "Hero Slides", href: "/admin/panel/hero-slides", icon: Image },
              { label: "Setări", href: "/admin/panel/settings", icon: TrendingUp },
            ].map((action, i) => (
              <Link key={i} href={action.href}>
                <motion.div
                  className="flex flex-col items-center gap-2 p-4 border border-gray-100 rounded-sm hover:border-primary/30 hover:bg-primary/3 transition-all duration-200 cursor-pointer group text-center"
                  whileHover={{ y: -2 }}
                >
                  <action.icon className="h-5 w-5 text-charcoal/40 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-sans text-charcoal/60 group-hover:text-primary transition-colors">{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent products */}
        <motion.div
          className="bg-white rounded-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs tracking-widest uppercase font-sans text-charcoal/40">Produse Recente</p>
            <Link href="/admin/panel/products">
              <span className="text-xs text-primary hover:text-primary/70 font-sans cursor-pointer flex items-center gap-1">
                Vezi toate <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.length === 0 ? (
              <div className="px-6 py-8 text-center text-charcoal/30 text-sm font-sans">
                Nu există produse încă.
              </div>
            ) : (
              recentProducts.map((product: any, i: number) => (
                <motion.div
                  key={product.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                >
                  {product.thumbnailUrl || product.imageUrl ? (
                    <img
                      src={product.thumbnailUrl || product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center">
                      <Package className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-medium text-charcoal truncate">{product.name}</p>
                    <p className="text-xs text-charcoal/40 font-sans">
                      {categories.find((c: any) => c.id === product.categoryId)?.name || "Fără categorie"}
                    </p>
                  </div>
                  {product.price && (
                    <span className="text-sm font-sans text-gold shrink-0">
                      {parseFloat(product.price).toFixed(0)} lei
                    </span>
                  )}
                  <Link href={`/admin/panel/products/edit/${product.id}`}>
                    <span className="text-xs text-charcoal/30 hover:text-primary font-sans cursor-pointer">Edit</span>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
