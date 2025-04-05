import { useState } from "react";
import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialService } from "@/services";
import { Edit, Trash2, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Testimonial } from "@shared/schema";

export default function Testimonials() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Fetch testimonials using testimonialService
  const { data: testimonialsResponse, error, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      try {
        const response = await testimonialService.getTestimonials();
        return response;
      } catch (error) {
        throw error;
      }
    }
  });

  const testimonials = (() => {
    if (!testimonialsResponse) return [];
    
    // Handle different response structures
    if (Array.isArray(testimonialsResponse)) {
      return testimonialsResponse;
    }
    
    // Check if response is wrapped in a data property (common API pattern)
    if (testimonialsResponse.data && Array.isArray(testimonialsResponse.data)) {
      return testimonialsResponse.data;
    }
    
    console.warn("Unexpected testimonials response format:", testimonialsResponse);
    return [];
  })();

  // Create or update testimonial mutation using testimonialService
  const saveMutation = useMutation({
    mutationFn: async (testimonial: Partial<Testimonial>) => {
      if (testimonial.id) {
        return await testimonialService.updateTestimonial(testimonial.id, testimonial);
      } else {
        return await testimonialService.createTestimonial(testimonial);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setIsOpen(false);
      setCurrentTestimonial(null);
      toast.success(currentTestimonial?.id ? "Testimonial actualizat" : "Testimonial adăugat");
    },
    onError: (error) => {
      console.error("Error saving testimonial:", error);
      toast.error("A apărut o eroare la salvarea testimonialului");
    }
  });

  // Delete testimonial mutation using testimonialService
  const deleteMutation = useMutation({
    mutationFn: async (id: number | string) => {
      return await testimonialService.deleteTestimonial(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setIsDeleteDialogOpen(false);
      setCurrentTestimonial(null);
      toast.success("Testimonial șters");
    },
    onError: (error) => {
      console.error("Error deleting testimonial:", error);
      toast.error("A apărut o eroare la ștergerea testimonialului");
    }
  });

  const handleOpenDialog = (testimonial?: Testimonial) => {
    setCurrentTestimonial(testimonial || { 
      rating: 5,
      date: new Date().toISOString().split('T')[0]
    });
    setIsOpen(true);
  };

  const handleOpenDeleteDialog = (testimonial: Testimonial) => {
    setCurrentTestimonial(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTestimonial) {
      saveMutation.mutate(currentTestimonial);
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
            Testimoniale
          </motion.h1>
          <motion.p 
            className="text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Administrați testimonialele clienților
          </motion.p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus size={16} /> Adaugă testimonial
        </Button>
      </div>

      {/* Testimonials table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 w-1/3 mb-4 rounded"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conținut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {testimonial.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(testimonial.date).toLocaleDateString("ro-RO")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(testimonial)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDeleteDialog(testimonial)}>
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
            <DialogTitle>{currentTestimonial?.id ? 'Editează testimonial' : 'Adaugă testimonial'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Nume client</label>
                <Input 
                  id="name"
                  value={currentTestimonial?.name || ''}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="rating" className="text-sm font-medium">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setCurrentTestimonial({...currentTestimonial, rating})}
                      className="p-1"
                    >
                      <Star 
                        className={`h-6 w-6 ${currentTestimonial?.rating && currentTestimonial.rating >= rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="content" className="text-sm font-medium">Conținut</label>
                <Textarea 
                  id="content"
                  value={currentTestimonial?.content || ''}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, content: e.target.value})}
                  rows={4}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium">Data</label>
                <Input 
                  id="date"
                  type="date"
                  value={currentTestimonial?.date ? new Date(currentTestimonial.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setCurrentTestimonial({...currentTestimonial, date: e.target.value})}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Anulează
              </Button>
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? 'Se salvează...' : 'Salvează'}
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
            <p>Ești sigur că dorești să ștergi testimonialul de la <strong>{currentTestimonial?.name}</strong>?</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anulează
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => currentTestimonial?.id && deleteMutation.mutate(currentTestimonial.id)}
            >
              {deleteMutation.isPending ? 'Se șterge...' : 'Șterge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}