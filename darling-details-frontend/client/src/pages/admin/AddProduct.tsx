import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, categoryService } from "@/services";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Numele este obligatoriu"),
  description: z.string().optional(),
  categoryId: z.union([z.string(), z.number()]).refine((val) => !!val, {
    message: "Categoria este obligatorie",
  }),
  images: z.any().optional(),
});

export default function AddProduct() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      images: [],
    },
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await categoryService.getCategories(),
  });

  const categories = categoriesResponse?.data || [];

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      const categoryId =
        typeof data.categoryId === "string"
          ? parseInt(data.categoryId, 10)
          : data.categoryId;
      formData.append("categoryId", String(categoryId));
      if (uploadedImages.length > 0) {
        formData.append("image", uploadedImages[0]);
      }
      return await productService.createProduct(formData);
    },
    onSuccess: () => {
      toast({ title: "Produs adăugat cu succes." });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset();
      setUploadedImages([]);
      setLocation("/admin/panel/products");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: error.message || "Nu s-a putut adăuga produsul.",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedImages([e.target.files[0]]);
    }
  };

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl"
      >
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase font-sans text-charcoal/40 mb-1">
            Administrare
          </p>
          <h1 className="font-display text-charcoal text-3xl">Adaugă Produs</h1>
        </div>

        <div className="bg-white rounded-sm border border-gray-100 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nume */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs tracking-wider uppercase font-sans text-charcoal/50">
                      Nume produs
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Aranjament floral" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descriere */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs tracking-wider uppercase font-sans text-charcoal/50">
                      Descriere
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descriere scurtă a produsului"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categorie */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs tracking-wider uppercase font-sans text-charcoal/50">
                      Categorie
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selectează o categorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Imagine */}
              <div className="space-y-3">
                <label className="text-xs tracking-wider uppercase font-sans text-charcoal/50 block">
                  Imagine
                </label>

                {/* Custom file input */}
                <label
                  className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-sm cursor-pointer hover:border-primary/40 transition-colors bg-white group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-xs tracking-wider uppercase font-sans rounded-sm group-hover:bg-primary/20 transition-colors whitespace-nowrap">
                    <Upload className="h-3.5 w-3.5" />
                    Alege fișier
                  </span>
                  <span className="text-sm text-charcoal/50 font-sans truncate">
                    {uploadedImages.length > 0
                      ? uploadedImages[0].name
                      : "Niciun fișier ales"}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {/* Preview */}
                {uploadedImages.length > 0 && (
                  <div className="relative w-24 h-24">
                    <img
                      src={URL.createObjectURL(uploadedImages[0])}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setUploadedImages([])}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-3 bg-primary text-white text-xs tracking-widest uppercase font-sans hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 rounded-sm"
              >
                {mutation.isPending ? "Se salvează..." : "Adaugă în galerie"}
              </button>
            </form>
          </Form>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
