import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { updateProductSchema } from "@shared/schema";
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
import { useLocation, useParams } from "wouter";
import { useEffect, useState } from "react";

export default function EditProduct() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const params = useParams();
  const productId = params.id;
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      images: [],
    },
  });

  // Fetch product data
  const { data: productResponse, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      return await productService.getProduct(productId);
    },
    enabled: !!productId,
  });

  // Set form values when product data is loaded
  useEffect(() => {
    if (productResponse && productResponse.data) {
      const product = productResponse.data;
      console.log("Product data loaded:", product);
      
      // Use setTimeout to ensure the form is fully initialized before setting values
      setTimeout(() => {
        form.reset({
          name: product.name || "",
          description: product.description || "",
          categoryId: product.categoryId ? String(product.categoryId) : "",
          images: [],
        });
        
        // Set current image
        setCurrentImage(product.imageUrl || '');
        setIsDataLoaded(true);
      }, 0);
    }
  }, [productResponse, form]);

  // Fetch categories
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await categoryService.getCategories();
    },
  });
  
  const categories = categoriesResponse?.data || [];

  // Update product mutation
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      // Create FormData for image upload
      const formData = new FormData();
      
      formData.append("name", data.name);
      
      if (data.description) {
        formData.append("description", data.description);
      }
      
      const categoryId = typeof data.categoryId === 'string' ? 
        parseInt(data.categoryId, 10) : data.categoryId;
      formData.append("categoryId", String(categoryId));
      
      // Append images if there are new ones
      if (uploadedImages.length > 0) {
        uploadedImages.forEach(image => {
          formData.append('image', image); 
        });
      }
      
      console.log("Updating product with data:", Object.fromEntries(formData.entries()));
      return await productService.updateProduct(productId, formData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setUploadedImages([]);
      setLocation("/admin/panel/products");
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update product. Please check your inputs and try again.",
      });
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedImages(newFiles);
    }
  };

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  if (isLoadingProduct || isLoadingCategories || !isDataLoaded) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-display mb-1">Edit Product</h1>
          <p className="text-gray-500">Update product information</p>
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
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {currentImage && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                            <img 
                              src={currentImage}
                              alt="Current product image"
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                        
                        {uploadedImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt="Upload preview"
                                  className="h-32 w-32 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                  onClick={() => {
                                    setUploadedImages((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    );
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
                {mutation.isPending ? "Updating Gallery Item..." : "Update Gallery Item"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
