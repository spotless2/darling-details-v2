import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  Tag,
  MessageSquare,
  X,
  Image,
  Users,
  Heart,
} from "lucide-react";
import { useState } from "react";
import { authService } from "@/services";
import { motion, AnimatePresence } from "framer-motion";

const NAV_GROUPS = [
  {
    label: "General",
    items: [
      { title: "Dashboard", href: "/admin/panel", icon: LayoutDashboard },
    ],
  },
  {
    label: "Conținut",
    items: [
      { title: "Produse", href: "/admin/panel/products", icon: Package },
      { title: "Adaugă Produs", href: "/admin/panel/products/new", icon: PlusCircle },
      { title: "Categorii", href: "/admin/panel/categories", icon: Tag },
      { title: "Hero Slides", href: "/admin/panel/hero-slides", icon: Image },
    ],
  },
  {
    label: "Social",
    items: [
      { title: "Testimoniale", href: "/admin/panel/testimonials", icon: MessageSquare },
    ],
  },
  {
    label: "Sistem",
    items: [
      { title: "Setări Magazin", href: "/admin/panel/settings", icon: Settings },
    ],
  },
];

function NavItem({ item, isActive, onClick }: any) {
  const Icon = item.icon;
  return (
    <Link href={item.href} onClick={onClick}>
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 text-sm font-sans transition-all duration-200 rounded-sm cursor-pointer group",
          isActive
            ? "bg-primary text-white"
            : "text-white/60 hover:text-white hover:bg-white/8"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-white/50 group-hover:text-white")} />
        <span>{item.title}</span>
        {isActive && <div className="ml-auto w-1 h-4 bg-white/40 rounded-full" />}
      </div>
    </Link>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/login";
  };

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full bg-charcoal">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/8">
        <div className="w-8 h-8 rounded-sm bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Heart className="h-4 w-4 text-primary" />
        </div>
        <div>
          <span className="font-display text-white text-base tracking-wide">Darling Details</span>
          <span className="block text-[9px] tracking-[0.2em] uppercase text-white/40 font-sans">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[9px] tracking-[0.25em] uppercase text-white/25 font-sans px-3 mb-2">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={location === item.href}
                  onClick={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-white/8 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-sans text-white/50 hover:text-white hover:bg-white/8 transition-all duration-200 rounded-sm"
        >
          <LogOut className="h-4 w-4" />
          Deconectare
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 shrink-0 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-64 z-50 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <SidebarContent onClose={() => setIsMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden p-2 rounded-sm text-charcoal/60 hover:text-charcoal hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1">
            <h1 className="text-sm font-sans font-medium text-charcoal/50 uppercase tracking-widest">
              {NAV_GROUPS.flatMap((g) => g.items).find((i) => i.href === location)?.title || "Admin"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <span className="text-xs font-sans text-charcoal/40 hover:text-primary transition-colors cursor-pointer">
                ← Înapoi la site
              </span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
