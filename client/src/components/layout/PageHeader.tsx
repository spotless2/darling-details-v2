import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/5 to-transparent" />

      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full" />
        <div className="absolute top-1/2 -left-12 w-32 h-32 bg-primary/5 rounded-full transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-primary/5 rounded-full transform translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-display mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p 
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {description}
            </motion.p>
          )}

          {children && (
            <motion.div
              className="relative mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom border with shadow */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        <div className="h-4 bg-gradient-to-b from-black/5 to-transparent" />
      </div>
    </motion.div>
  );
}