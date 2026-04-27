import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertContactSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { storeService } from "@/services";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Facebook, Instagram } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();

  const { data: settingsResponse } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => await storeService.getStoreSettings(),
  });
  const settings = settingsResponse?.data;

  const form = useForm({
    resolver: zodResolver(insertContactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Mesaj trimis!", description: "Vă vom contacta în cel mai scurt timp." });
      form.reset();
    },
    onError: () => {
      toast({ variant: "destructive", title: "Eroare", description: "Vă rugăm să încercați din nou." });
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-gold" />
              Vorbește cu Noi
            </p>
            <h1 className="font-display text-white text-shadow-hero" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
              Contactează-ne
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Left: info */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div>
                <p className="section-label mb-4">Detalii Contact</p>
                <h2 className="font-display text-charcoal text-2xl md:text-3xl mb-2">
                  Suntem Aici pentru Tine
                </h2>
                <div className="w-12 h-px bg-gold mb-6" />
                <p className="text-charcoal/60 font-sans text-sm leading-relaxed">
                  Ai un eveniment special în plan? Contactează-ne și hai să discutăm cum putem
                  transforma visul tău în realitate.
                </p>
              </div>

              <div className="space-y-5">
                {settings?.contactPhone && (
                  <a href={`tel:${settings.contactPhone}`}
                    className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-sm bg-primary/10 border border-primary/15 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <Phone className="h-4.5 w-4.5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/40 uppercase tracking-widest font-sans">Telefon</p>
                      <p className="text-charcoal font-sans font-medium">{settings.contactPhone}</p>
                    </div>
                  </a>
                )}
                {settings?.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}`}
                    className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-sm bg-primary/10 border border-primary/15 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <Mail className="h-4.5 w-4.5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/40 uppercase tracking-widest font-sans">Email</p>
                      <p className="text-charcoal font-sans font-medium">{settings.contactEmail}</p>
                    </div>
                  </a>
                )}
                {settings?.storeAddress && (
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-sm bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                      <MapPin className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-charcoal/40 uppercase tracking-widest font-sans">Adresă</p>
                      <p className="text-charcoal font-sans font-medium">{settings.storeAddress}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              {(settings?.facebookUrl || settings?.instagramUrl) && (
                <div>
                  <p className="text-xs text-charcoal/40 uppercase tracking-widest font-sans mb-3">Social Media</p>
                  <div className="flex gap-3">
                    {settings.facebookUrl && (
                      <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 border border-gray-200 flex items-center justify-center text-charcoal/50 hover:text-primary hover:border-primary/40 transition-all duration-300">
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}
                    {settings.instagramUrl && (
                      <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 border border-gray-200 flex items-center justify-center text-charcoal/50 hover:text-primary hover:border-primary/40 transition-all duration-300">
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Map */}
              <div className="aspect-[4/3] overflow-hidden rounded-sm border border-gray-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d899.705052314709!2d24.415240569670644!3d43.99892436292056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDPCsDU5JzU2LjEiTiAyNMKwMjQnNTcuMiJF!5e1!3m2!1sen!2sro!4v1746236816831!5m2!1sen!2sro"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              className="lg:col-span-3 bg-white p-8 md:p-10 rounded-sm shadow-[0_4px_40px_-8px_rgba(0,0,0,0.1)]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <p className="section-label mb-4">Formular</p>
              <h2 className="font-display text-charcoal text-2xl md:text-3xl mb-2">
                Trimite-ne un Mesaj
              </h2>
              <div className="w-12 h-px bg-gold mb-8" />

              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs tracking-widest uppercase font-sans text-charcoal/60">Nume *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Numele dvs."
                              {...field}
                              className="rounded-none border-gray-200 focus:border-primary focus:ring-0 font-sans"
                            />
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
                          <FormLabel className="text-xs tracking-widest uppercase font-sans text-charcoal/60">Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="adresa@email.com"
                              {...field}
                              className="rounded-none border-gray-200 focus:border-primary focus:ring-0 font-sans"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs tracking-widest uppercase font-sans text-charcoal/60">Telefon</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+40 7xx xxx xxx"
                            {...field}
                            className="rounded-none border-gray-200 focus:border-primary focus:ring-0 font-sans"
                          />
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
                        <FormLabel className="text-xs tracking-widest uppercase font-sans text-charcoal/60">Mesaj *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Spune-ne despre evenimentul tău..."
                            rows={5}
                            {...field}
                            className="rounded-none border-gray-200 focus:border-primary focus:ring-0 font-sans resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white text-xs tracking-widest uppercase font-sans font-medium hover:bg-primary/90 disabled:opacity-60 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {mutation.isPending ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {mutation.isPending ? "Se trimite..." : "Trimite Mesajul"}
                  </button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
