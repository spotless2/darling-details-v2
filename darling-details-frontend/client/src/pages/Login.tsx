import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { authService } from "@/services";
import { Heart, Eye, EyeOff, LogIn } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email invalid"),
  password: z.string().min(6, "Minimum 6 caractere"),
});

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await authService.login(values.email, values.password);
      toast({ title: "Bine ai revenit!" });
      setLocation("/admin/panel");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Autentificare eșuată",
        description: error.message || "Email sau parolă greșite.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-charcoal/75" />
        <div className="relative z-10 text-center px-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 font-sans mb-4">Darling Details</p>
          <h1 className="font-display text-white text-4xl leading-tight mb-6">
            Panoul de<br />Administrare
          </h1>
          <div className="w-12 h-px bg-gold/60 mx-auto" />
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-display text-charcoal text-xl">Darling Details</span>
          </div>

          <p className="text-xs tracking-[0.3em] uppercase font-sans text-charcoal/40 mb-2">Admin</p>
          <h2 className="font-display text-charcoal text-3xl mb-8">Autentificare</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-xs tracking-wider uppercase font-sans text-charcoal/50 block mb-1.5">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@darlingdetails.com"
                className="w-full border border-gray-200 bg-white rounded-sm px-4 py-3 text-sm font-sans focus:outline-none focus:border-primary/50 transition-colors"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-sans">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs tracking-wider uppercase font-sans text-charcoal/50 block mb-1.5">
                Parolă
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 bg-white rounded-sm px-4 py-3 pr-10 text-sm font-sans focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 font-sans">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white text-xs tracking-widest uppercase font-sans hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 rounded-sm mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Intră în cont
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
