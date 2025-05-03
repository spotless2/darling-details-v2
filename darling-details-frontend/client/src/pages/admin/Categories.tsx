import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services";
import { Edit, Trash2, Plus } from "lucide-react";
import { Image as ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Category } from "@shared/schema";

export default function Categories() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<Partial<Category> | null>(null);

  // Fetch categories
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await categoryService.getCategories(),
  });

  const categories = categoriesResponse?.data || [];

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (category: Partial<Category>) =>
      category.id
        ? categoryService.updateCategory(category.id, category)
        : categoryService.createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsOpen(false);
      setCurrentCategory(null);
      toast.success(
        currentCategory?.id ? "Categorie actualizată" : "Categorie creată"
      );
    },
    onError: (error) => {
      console.error("Error saving category:", error);
      toast.error("A apărut o eroare la salvarea categoriei");
    },
  });

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsDeleteDialogOpen(false);
      setCurrentCategory(null);
      toast.success("Categorie ștearsă");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error("A apărut o eroare la ștergerea categoriei");
    },
  });

  const handleOpenDialog = (category?: Category) => {
    setCurrentCategory(category || {});
    setIsOpen(true);
  };

  const handleOpenDeleteDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCategory) {
      createMutation.mutate(currentCategory);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <motion.h1
            className="text-3xl font-display mb-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Categorii
          </motion.h1>
          <motion.p
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Administrați categoriile de produse
          </motion.p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Adaugă categorie
        </Button>
      </div>

      {/* Categories table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 w-1/3 mb-4 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          className="bg-white rounded-lg shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descriere
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {category.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDeleteDialog(category)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCategory?.id ? "Editează categorie" : "Adaugă categorie"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nume
                </label>
                <Input
                  id="name"
                  value={currentCategory?.name || ""}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug
                </label>
                <Input
                  id="slug"
                  value={currentCategory?.slug || ""}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      slug: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Descriere
                </label>
                <Textarea
                  id="description"
                  value={currentCategory?.description || ""}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="image" className="text-sm font-medium">
                  Imagine
                </label>
                <Input
                  id="image"
                  type="text"
                  placeholder="URL imagine (ex: https://images.unsplash.com/...)"
                  value={currentCategory?.image || ""}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      image: e.target.value,
                    })
                  }
                />

                {/* Preview below the input */}
                {currentCategory?.image ? (
                  <div className="relative w-full h-28 mt-2 rounded-md overflow-hidden border bg-gray-50">
                    <img
                      src={currentCategory.image}
                      alt={currentCategory?.name || "Preview"}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() =>
                        setCurrentCategory({
                          ...currentCategory,
                          image: undefined,
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-24 mt-2 border-2 border-dashed rounded-md border-gray-300 bg-gray-50">
                    <div className="flex flex-col items-center space-y-1">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                      <div className="text-xs text-gray-500">
                        Nu există imagine
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Anulează
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Se salvează..." : "Salvează"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare ștergere</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Ești sigur că dorești să ștergi categoria{" "}
              <strong>{currentCategory?.name}</strong>?
            </p>
            <p className="text-red-500 text-sm mt-2">
              Atenție! Această acțiune va șterge și toate produsele asociate
              acestei categorii.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Anulează
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                currentCategory?.id && deleteMutation.mutate(currentCategory.id)
              }
            >
              {deleteMutation.isPending ? "Se șterge..." : "Șterge"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
