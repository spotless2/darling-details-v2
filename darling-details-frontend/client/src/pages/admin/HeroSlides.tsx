import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, Image, X, Check } from "lucide-react";
import apiClient from "@/services/apiClient";

function SlideForm({ slide, onClose, onSaved }: { slide?: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    description: slide?.description || "",
    imageUrl: slide?.imageUrl || "",
    ctaText: slide?.ctaText || "Descoperă Colecția",
    ctaLink: slide?.ctaLink || "/products",
    order: slide?.order ?? 0,
    active: slide?.active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.title || !form.imageUrl) {
      setError("Titlul și URL-ul imaginii sunt obligatorii.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (slide) {
        await apiClient.put(`/hero-slides/${slide.id}`, form);
      } else {
        await apiClient.post("/hero-slides", form);
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e.message || "Eroare la salvare.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-sm w-full max-w-xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display text-charcoal text-lg">{slide ? "Editează Slide" : "Slide Nou"}</h2>
          <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-sm">{error}</div>}

          {[
            { key: "title", label: "Titlu *", placeholder: "Ex: Povești de Neuitat" },
            { key: "subtitle", label: "Subtitlu", placeholder: "Ex: Florile visurilor tale" },
            { key: "description", label: "Descriere", placeholder: "Scurtă descriere afișată pe slide..." },
            { key: "imageUrl", label: "URL Imagine *", placeholder: "https://..." },
            { key: "ctaText", label: "Text Buton", placeholder: "Ex: Descoperă" },
            { key: "ctaLink", label: "Link Buton", placeholder: "/products" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs tracking-wider uppercase font-sans text-charcoal/50 block mb-1.5">{label}</label>
              {key === "description" ? (
                <textarea
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-primary/50 resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-primary/50"
                />
              )}
            </div>
          ))}

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs tracking-wider uppercase font-sans text-charcoal/50 block mb-1.5">Ordine</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm font-sans focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs tracking-wider uppercase font-sans text-charcoal/50 block mb-1.5">Status</label>
              <button
                onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-sans border rounded-sm w-full transition-colors ${
                  form.active ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 text-charcoal/50"
                }`}
              >
                {form.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {form.active ? "Activ" : "Inactiv"}
              </button>
            </div>
          </div>

          {/* Preview */}
          {form.imageUrl && (
            <div>
              <label className="text-xs tracking-wider uppercase font-sans text-charcoal/50 block mb-1.5">Preview Imagine</label>
              <div className="relative h-32 overflow-hidden rounded-sm bg-gray-100">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-xs tracking-widest uppercase font-sans border border-gray-200 text-charcoal/60 hover:border-charcoal/40 transition-all rounded-sm">
            Anulează
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary px-5"
          >
            {saving ? "Se salvează..." : <><Check className="h-3.5 w-3.5" /> Salvează</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSlides() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editSlide, setEditSlide] = useState<any>(null);

  const { data: slides = [], isLoading } = useQuery({
    queryKey: ["hero-slides-admin"],
    queryFn: async () => {
      const res = await apiClient.get("/hero-slides");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiClient.delete(`/hero-slides/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hero-slides-admin"] }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) =>
      apiClient.put(`/hero-slides/${id}`, { active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hero-slides-admin"] }),
  });

  const handleSaved = () => queryClient.invalidateQueries({ queryKey: ["hero-slides-admin"] });

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase font-sans text-charcoal/40 mb-1">Administrare</p>
            <h1 className="font-display text-charcoal text-3xl">Hero Slides</h1>
          </div>
          <button
            onClick={() => { setEditSlide(null); setFormOpen(true); }}
            className="btn-primary px-5"
          >
            <Plus className="h-4 w-4" />
            Slide Nou
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : slides.length === 0 ? (
          <div className="bg-white rounded-sm border border-gray-100 flex flex-col items-center justify-center py-20 text-center">
            <Image className="h-10 w-10 text-gray-200 mb-4" />
            <p className="font-display text-charcoal/40 text-xl">Niciun slide adăugat</p>
            <p className="text-sm text-charcoal/30 font-sans mt-2">Adaugă primul slide pentru hero-ul paginii principale.</p>
            <button
              onClick={() => { setEditSlide(null); setFormOpen(true); }}
              className="mt-6 px-5 py-2.5 text-xs tracking-widest uppercase font-sans border border-primary text-primary hover:bg-primary hover:text-white transition-all rounded-sm"
            >
              Adaugă Slide
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide: any, i: number) => (
              <motion.div
                key={slide.id}
                className="bg-white rounded-sm border border-gray-100 flex items-center gap-4 p-4 hover:shadow-sm transition-all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GripVertical className="h-4 w-4 text-gray-200 shrink-0" />

                <div className="w-16 h-12 rounded-sm overflow-hidden bg-gray-100 shrink-0">
                  <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-sans font-medium text-charcoal text-sm truncate">{slide.title}</p>
                  {slide.subtitle && <p className="text-xs text-charcoal/40 font-sans truncate">{slide.subtitle}</p>}
                </div>

                <span className={`text-[10px] tracking-wider uppercase font-sans px-2 py-1 rounded-sm ${
                  slide.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-charcoal/40"
                }`}>
                  {slide.active ? "Activ" : "Inactiv"}
                </span>
                <span className="text-xs text-charcoal/30 font-sans shrink-0">#{slide.order}</span>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleMutation.mutate({ id: slide.id, active: !slide.active })}
                    className="p-2 text-charcoal/30 hover:text-charcoal transition-colors"
                    title={slide.active ? "Dezactivează" : "Activează"}
                  >
                    {slide.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => { setEditSlide(slide); setFormOpen(true); }}
                    className="p-2 text-charcoal/30 hover:text-primary transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => { if (confirm("Sigur ștergi acest slide?")) deleteMutation.mutate(slide.id); }}
                    className="p-2 text-charcoal/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {formOpen && (
          <SlideForm
            slide={editSlide}
            onClose={() => { setFormOpen(false); setEditSlide(null); }}
            onSaved={handleSaved}
          />
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
