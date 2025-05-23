import { Link, useLocation } from "wouter";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

// Custom link component that scrolls to top
const ScrollToTopLink = ({ href, children, className = "", onClick = null }) => {
  const [, setLocation] = useLocation();

  const handleClick = (e) => {
    e.preventDefault();
    
    // First scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Execute any additional onClick handler if provided
    if (onClick) onClick();
    
    // Then navigate to the new location
    setTimeout(() => {
      setLocation(href);
    }, 100);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            {/* Replace Link with ScrollToTopLink */}
            <ScrollToTopLink href="/">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-serif text-2xl text-primary">D</span>
                </div>
                <span className="text-2xl font-serif text-gray-900">
                  {SITE_CONFIG.name}
                </span>
              </div>
            </ScrollToTopLink>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {NAV_ITEMS.map((item) => (
              // Replace Link with ScrollToTopLink
              <ScrollToTopLink
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-base font-medium transition-colors ${
                  location === item.href
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {item.label}
              </ScrollToTopLink>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl shadow-lg">
            {NAV_ITEMS.map((item) => (
              // Replace Link with ScrollToTopLink
              <ScrollToTopLink
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium text-shadow-sm ${
                  location === item.href
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-gray-900 hover:text-primary hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </ScrollToTopLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}