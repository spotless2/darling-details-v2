import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { productService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

export default function Products() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return await productService.getProducts();
    },
  });
  
  const products = productsResponse?.data || [];

  const deleteProductMutation = useMutation({
    mutationFn: (id: string | number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Success",
        description: "Product has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product. Please try again.",
      });
    },
  });

  const handleDeleteProduct = (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-display mb-1">Products</h1>
            <p className="text-gray-500">Manage your product inventory</p>
          </div>
          <Link href="/admin/panel/products/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Image</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Price</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Available</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse border-b">
                      <td className="py-4 px-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded w-20" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-8 bg-gray-200 rounded w-24 ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : (
                  products?.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <img
                          src={product.thumbnailUrl || product.imageUrl || "/placeholder-image.webp"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="py-4 px-6">{product.name}</td>
                      <td className="py-4 px-6">{product.price} RON</td>
                      <td className="py-4 px-6">{product.quantity || product.available || 0}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/panel/products/edit/${product.id}`}>
                            <Button size="sm" variant="outline" className="flex items-center gap-1">
                              <Pencil className="w-4 h-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex items-center gap-1"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProductMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
