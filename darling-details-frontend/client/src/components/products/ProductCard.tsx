import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Get image URL or use fallback
  const imageUrl = product.imageUrl || product.thumbnailUrl || '/placeholder-image.webp';
  const fullImageUrl = product.imageUrl || imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full">
        <CardContent className="p-0">
          <div className="relative h-64">
            <motion.img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="p-4">
            <motion.h3 
              className="text-lg font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {product.name}
            </motion.h3>
            <motion.p 
              className="text-sm text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {product.description}
            </motion.p>
            <motion.p 
              className="text-lg font-semibold mt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {product.price} RON
            </motion.p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full hover:scale-105 transition-transform">
                Vezi Detalii
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{product.name}</DialogTitle>
              </DialogHeader>
              <motion.div 
                className="grid gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="aspect-video overflow-hidden rounded-lg">
                  <motion.img
                    src={fullImageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-lg font-semibold mt-4">{product.price} RON</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Disponibilitate: {product.quantity || product.available || 0} bucăți
                  </p>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
}