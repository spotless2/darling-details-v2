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
  MessageSquare 
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  {
    title: "Dashboard",
    href: "/admin/panel",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/panel/products",
    icon: Package,
  },
  {
    title: "Add Product",
    href: "/admin/panel/products/new",
    icon: PlusCircle,
  },
  {
    title: "Categories",
    href: "/admin/panel/categories",
    icon: Tag,
  },
  {
    title: "Testimonials",
    href: "/admin/panel/testimonials",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/admin/panel/settings",
    icon: Settings,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm px-4 py-3">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mr-2 border-gray-200 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <span className="text-lg font-display text-primary">DD</span>
            </div>
            <span className="text-lg font-display text-gray-900">Admin Panel</span>
          </div>
        </div>
      </div>

      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
        )}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out md:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full bg-white border-r">
            <div className="flex flex-col flex-grow pt-20 overflow-y-auto">
              <nav className="flex-1 px-2 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-sm font-medium",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                      )}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.location.href = item.href;
                      }}
                    >
                      <Icon
                        className={cn(
                          "mr-3 h-5 w-5",
                          isActive
                            ? "text-primary"
                            : "text-gray-400 group-hover:text-primary"
                        )}
                      />
                      {item.title}
                    </Button>
                  );
                })}
              </nav>
              <div className="flex-shrink-0 border-t border-gray-200 p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = "/admin";
                  }}
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
              <div className="flex items-center flex-shrink-0 px-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <span className="text-xl font-display text-primary">DD</span>
                </div>
                <span className="text-xl font-display">Admin Panel</span>
              </div>
              <div className="flex flex-col flex-1">
                <nav className="flex-1 px-2 space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    return (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-sm font-medium",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                          )}
                        >
                          <Icon
                            className={cn(
                              "mr-3 h-5 w-5",
                              isActive
                                ? "text-primary"
                                : "text-gray-400 group-hover:text-primary"
                            )}
                          />
                          {item.title}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
                <div className="flex-shrink-0 border-t border-gray-200 p-4">
                  <Link href="/admin">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
                    >
                      <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                      Logout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6 pt-20 md:pt-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}