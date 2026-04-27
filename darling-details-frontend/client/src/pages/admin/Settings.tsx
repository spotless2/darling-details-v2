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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Mail, Phone, Settings2, BookOpen, Search, MapPin } from "lucide-react";

// Updated schema to match API field names including new dynamic text fields
const storeSettingsSchema = z.object({
  storeName: z
    .string()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere")
    .max(100),
  storeDescription: z.string().optional(),
  storeAddress: z.string().optional(),
  contactEmail: z.string().email("Email invalid"),
  contactPhone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Format număr de telefon invalid"
    ),
  facebookUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tiktokUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  
  // New dynamic fields
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  workingHours: z.string().optional(),
  aboutStory: z.string().optional(),
  aboutMission: z.string().optional(),
  aboutVision: z.string().optional(),
  mapEmbedUrl: z.string().optional(),
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
      tiktokUrl: "",
      seoTitle: "",
      seoDescription: "",
      workingHours: "",
      aboutStory: "",
      aboutMission: "",
      aboutVision: "",
      mapEmbedUrl: "",
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

      form.reset({
        storeName: settings.storeName || "",
        storeDescription: settings.storeDescription || "",
        storeAddress: settings.storeAddress || "",
        contactEmail: settings.contactEmail || "",
        contactPhone: settings.contactPhone || "",
        facebookUrl: settings.facebookUrl || "",
        instagramUrl: settings.instagramUrl || "",
        tiktokUrl: settings.tiktokUrl || "",
        seoTitle: settings.seoTitle || "",
        seoDescription: settings.seoDescription || "",
        workingHours: settings.workingHours || "",
        aboutStory: settings.aboutStory || "",
        aboutMission: settings.aboutMission || "",
        aboutVision: settings.aboutVision || "",
        mapEmbedUrl: settings.mapEmbedUrl || "",
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
        title: "Setări salvate",
        description: "Informațiile au fost actualizate cu succes.",
      });
      queryClient.invalidateQueries({ queryKey: ["store-settings"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Eroare",
        description:
          error.message || "Nu s-au putut salva setările. Încearcă din nou.",
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
          <h2 className="text-2xl font-bold text-red-500 mb-4">Eroare la încărcarea setărilor</h2>
          <p className="text-gray-600 mb-6">{(error as any)?.message || "Nu s-au putut încărca setările magazinului"}</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["store-settings"] })}>
            Încearcă din nou
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <p className="text-xs tracking-[0.25em] uppercase font-sans text-charcoal/40 mb-1">Administrare</p>
          <h1 className="font-display text-charcoal text-3xl">Setări Site</h1>
        </div>

        <div className="max-w-4xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8 grid w-full md:w-[600px] grid-cols-2">
                  <TabsTrigger value="general" className="flex items-center gap-2"><Store className="h-4 w-4"/> General & Contact</TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2"><BookOpen className="h-4 w-4"/> Conținut & SEO</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-8">
                  {/* Store Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-medium">Informații magazin</h2>
                    </div>
                    <Separator />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="storeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nume magazin</FormLabel>
                            <FormControl><Input placeholder="Darling Details" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="workingHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Program de lucru</FormLabel>
                            <FormControl><Input placeholder="L-V: 09:00 - 18:00" {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="storeDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descriere scurtă (Footer)</FormLabel>
                          <FormControl><Textarea className="min-h-[80px]" placeholder="Slogan sau descriere scurtă" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="storeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresă magazin</FormLabel>
                          <FormControl><Input placeholder="București, Sector 1..." {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-medium">Informații de contact</h2>
                    </div>
                    <Separator />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresă email</FormLabel>
                            <FormControl><Input type="email" placeholder="contact@exemplu.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Număr de telefon</FormLabel>
                            <FormControl><Input placeholder="0712 345 678" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Map Embed */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-medium">Hartă Google Maps</h2>
                    </div>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="mapEmbedUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Embed Hartă (Google Maps)</FormLabel>
                          <FormControl>
                            <Textarea
                              className="min-h-[80px] font-mono text-xs"
                              placeholder="https://www.google.com/maps/embed?pb=..."
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <p className="text-xs text-charcoal/40 mt-1">
                            Deschide Google Maps → Caută locația → Share → Embed a map → Copiază doar URL-ul din src="..."
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Social Media */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-medium">Rețele sociale</h2>
                    </div>
                    <Separator />

                    <div className="grid md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="facebookUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl><Input placeholder="URL Facebook" {...field} value={field.value || ""} /></FormControl>
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
                            <FormControl><Input placeholder="URL Instagram" {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tiktokUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TikTok</FormLabel>
                            <FormControl><Input placeholder="URL TikTok" {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-8">
                  {/* SEO Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-medium">SEO & Meta Tag-uri</h2>
                    </div>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titlu Site (afișat în browser și pe Google)</FormLabel>
                          <FormControl><Input placeholder="Darling Details - Aranjamente Florale și Mărturii" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="seoDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descriere Meta (afișată pe Google)</FormLabel>
                          <FormControl><Textarea className="min-h-[80px]" placeholder="Suntem o agenție de design..." {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* About Page Content */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-medium">Texte Pagina 'Despre Noi'</h2>
                    </div>
                    <Separator />

                    <FormField
                      control={form.control}
                      name="aboutStory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Povestea Noastră</FormLabel>
                          <FormControl><Textarea className="min-h-[150px]" placeholder="Darling Details a luat naștere din pasiunea..." {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aboutMission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Misiunea Noastră</FormLabel>
                          <FormControl><Textarea className="min-h-[100px]" placeholder="Ne-am propus să oferim..." {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aboutVision"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Viziunea de Viitor</FormLabel>
                          <FormControl><Textarea className="min-h-[100px]" placeholder="Ne dorim să devenim parteneri..." {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4 pt-8 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4 z-10 border-t mt-8">
                <Button type="submit" className="flex-1" disabled={mutation.isPending}>
                  {mutation.isPending ? "Se salvează..." : "Salvează modificările"}
                </Button>
                <Button type="button" variant="outline" onClick={() => form.reset()} disabled={mutation.isPending}>
                  Anulează schimbările
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </AdminLayout>
  );
}
