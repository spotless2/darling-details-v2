import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { insertProductSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";

export default function AddProduct() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  
  const form = useForm({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      images: [],
    },
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await categoryService.getCategories();
    },
  });
  
  const categories = categoriesResponse?.data || [];

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Create FormData for image upload
      const formData = new FormData();
      formData.append("name", data.name);
      
      if (data.description) {
        formData.append("description", data.description);
      }
      
      const categoryId = typeof data.categoryId === 'string' ? parseInt(data.categoryId, 10) : data.categoryId;
      formData.append("categoryId", String(categoryId));
      
      // Append any uploaded images
      if (uploadedImages.length > 0) {
        uploadedImages.forEach(image => {
          formData.append('image', image); 
        });
      }
      
      return await productService.createProduct(formData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset();
      setUploadedImages([]);
      setLocation("/admin/panel/products");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add product. Please check your inputs and try again.",
      });
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Just use the first file for now as backend seems to expect a single image
      const newFiles = Array.from(e.target.files);
      setUploadedImages([newFiles[0]]); // Store only the first image
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
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-display mb-1">Add New Item to Gallery</h1>
          <p className="text-gray-500">Add a new image to your gallery</p>
        </div>

        <div className="max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a name for this image" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a brief description for this image"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(parseInt(value, 10));
                      }}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                        
                        {uploadedImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {uploadedImages.map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Upload preview ${index}`}
                                  className="h-20 w-20 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                  onClick={() => {
                                    setUploadedImages([]);
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Adding to Gallery..." : "Add to Gallery"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
