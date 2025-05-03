import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertContactSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { storeService } from "@/services";
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
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  
  // Fetch store settings for contact information
  const { data: settingsResponse, isLoading, error } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => await storeService.getStoreSettings(),
  });
  
  const storeSettings = settingsResponse?.data;
  
  // Dynamic contact items based on API data
  const getContactItems = () => {
    if (!storeSettings) return [];
    
    return [
      { icon: Phone, label: "Telefon", value: storeSettings.contactPhone },
      { icon: Mail, label: "Email", value: storeSettings.contactEmail },
      { icon: MapPin, label: "Adresă", value: storeSettings.storeAddress },
    ];
  };

  const form = useForm({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mesaj trimis cu succes!",
        description: "Vă vom contacta în cel mai scurt timp.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Eroare",
        description: "A apărut o eroare. Vă rugăm să încercați din nou.",
      });
    },
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader
        title="Contactează-ne"
        description="Suntem aici să te ajutăm să creezi evenimente memorabile."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-display mb-6">Informații de Contact</h2>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="p-4 bg-red-50 text-red-800 rounded-md">
                <p>Nu am putut încărca informațiile de contact. Vă rugăm să încercați din nou mai târziu.</p>
              </div>
            )}
            
            {/* Contact information */}
            {!isLoading && !error && storeSettings && (
              <div className="space-y-6">
                {getContactItems().map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-gray-600">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div 
              className="mt-8 aspect-video rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d899.705052314709!2d24.415240569670644!3d43.99892436292056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDPCsDU5JzU2LjEiTiAyNMKwMjQnNTcuMiJF!5e1!3m2!1sen!2sro!4v1746236816831!5m2!1sen!2sro"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-300"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-display mb-6">Trimite-ne un Mesaj</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nume</FormLabel>
                      <FormControl>
                        <Input placeholder="Numele dvs." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="adresa@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefon</FormLabel>
                      <FormControl>
                        <Input placeholder="07xx xxx xxx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mesaj</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Scrieți mesajul dvs. aici..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full transition-transform hover:scale-105"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Se trimite..." : "Trimite Mesajul"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}