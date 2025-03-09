import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package,
  PlusCircle,
  Settings,
  LogOut 
} from "lucide-react";

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
    title: "Settings",
    href: "/admin/panel/settings",
    icon: Settings,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
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
                        <a
                          className={cn(
                            "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                          )}
                        >
                          <Icon
                            className={cn(
                              "mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200",
                              isActive
                                ? "text-primary"
                                : "text-gray-400 group-hover:text-primary"
                            )}
                          />
                          {item.title}
                        </a>
                      </Link>
                    );
                  })}
                </nav>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <Link href="/admin">
                    <a className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary w-full transition-all duration-200">
                      <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                      Logout
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
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