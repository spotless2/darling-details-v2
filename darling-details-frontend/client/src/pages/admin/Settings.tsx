import { useEffect } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storeService } from "@/services";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Store, Mail, Phone } from "lucide-react";

// Updated schema to match API field names
const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters").max(100),
  storeDescription: z.string().optional(),
  storeAddress: z.string().optional(),
  contactEmail: z.string().email("Must be a valid email"),
  contactPhone: z.string().regex(
    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    "Phone number format is invalid"
  ),
  facebookUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof storeSettingsSchema>;

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Setup form with Zod validation and field names matching API
  const form = useForm<FormValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: "",
      storeDescription: "",
      storeAddress: "",
      contactEmail: "",
      contactPhone: "",
      facebookUrl: "",
      instagramUrl: "",
    },
  });

  // Fetch current store settings
  const {
    data: settingsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => {
      return await storeService.getStoreSettings();
    },
  });

  // Update form when settings are loaded - correctly mapped fields
  useEffect(() => {
    if (settingsResponse?.data) {
      const settings = settingsResponse.data;
      console.log("Loaded settings:", settings); // Debug log
      
      form.reset({
        storeName: settings.storeName || "",
        storeDescription: settings.storeDescription || "",
        storeAddress: settings.storeAddress || "",
        contactEmail: settings.contactEmail || "",
        contactPhone: settings.contactPhone || "",
        facebookUrl: settings.facebookUrl || "",
        instagramUrl: settings.instagramUrl || "",
      });
    }
  }, [settingsResponse, form]);

  // Update store settings mutation
  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      return storeService.updateStoreSettings(data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Store settings updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };

  // Show loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-4 bg-gray-200 rounded w-full max-w-md"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded w-full max-w-md"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show error state
  if (isError) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Settings</h2>
          <p className="text-gray-600 mb-6">{(error as any)?.message || "Failed to load store settings"}</p>
          <Button 
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["store-settings"] });
            }}
          >
            Try Again
          </Button>
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
          <h1 className="text-2xl font-display mb-1">Store Settings</h1>
          <p className="text-gray-500">Manage your store's basic information</p>
        </div>

        <div className="max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Store Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-medium">Store Information</h2>
                </div>
                <Separator />
                
                <FormField
                  control={form.control}
                  name="storeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter store name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storeDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Short description of your store"
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
                  name="storeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your store's physical address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Contact Information */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-medium">Contact Information</h2>
                </div>
                <Separator />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="contact@example.com" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="555-123-4567" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Social Media - Twitter field removed */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-medium">Social Media</h2>
                </div>
                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="facebookUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Facebook URL" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Instagram URL" 
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Saving Changes..." : "Save Changes"}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={mutation.isPending}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </AdminLayout>
  );
}