import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { productService, categoryService } from "@/services";
import { Package, Tag, ShoppingBag, Box } from "lucide-react";

// Dashboard stat card component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  color: string;
  delay?: number;
}

function StatCard({ title, value, icon: Icon, description, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm p-6 flex items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mr-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <div>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-gray-500">{title}</p>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    categories: 0,
  });

  // Fetch products data
  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return await productService.getProducts();
    },
  });

  // Fetch categories data
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await categoryService.getCategories();
    },
  });

  // Update stats when data is loaded
  useEffect(() => {
    if (productsResponse?.data && categoriesResponse?.data) {
      const products = productsResponse.data;
      const categories = categoriesResponse.data;
      
      // Calculate stats from the data
      const availableProducts = products.filter(p => 
        (p.quantity && p.quantity > 0) || (p.available && p.available > 0)
      ).length;

      setStats({
        totalProducts: products.length,
        availableProducts,
        categories: categories.length,
      });
    }
  }, [productsResponse, categoriesResponse]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <motion.h1 
          className="text-3xl font-display mb-1"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        <motion.p 
          className="text-gray-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Store overview and analytics
        </motion.p>
      </div>

      {/* Loading state */}
      {(isLoadingProducts || isLoadingCategories) ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 h-32 animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                <div className="ml-4">
                  <div className="h-6 bg-gray-200 w-24 mb-2 rounded"></div>
                  <div className="h-4 bg-gray-200 w-32 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts} 
            icon={Package} 
            color="bg-blue-600" 
            delay={0.2} 
          />
          <StatCard 
            title="Available Products" 
            value={stats.availableProducts} 
            icon={Box} 
            color="bg-green-600" 
            description={`${stats.availableProducts} of ${stats.totalProducts} in stock`} 
            delay={0.3} 
          />
          <StatCard 
            title="Categories" 
            value={stats.categories} 
            icon={Tag} 
            color="bg-purple-600" 
            delay={0.4} 
          />
        </div>
      )}

      {/* Recent Products */}
      <div className="mt-8">
        <motion.h2 
          className="text-2xl font-display mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Recent Products
        </motion.h2>
        
        {isLoadingProducts ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="animate-pulse p-4">
              <div className="h-6 bg-gray-200 w-1/3 mb-4 rounded"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productsResponse?.data.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            src={product.thumbnailUrl || product.imageUrl || '/placeholder-image.webp'} 
                            alt={product.name}
                            className="h-10 w-10 rounded-full object-cover" 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price} RON</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (product.quantity > 0 || product.available > 0) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {(product.quantity > 0 || product.available > 0) ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}