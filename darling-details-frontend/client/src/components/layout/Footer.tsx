import { useQuery } from "@tanstack/react-query";
import { storeService } from "@/services";
import { NAV_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { Facebook, Instagram, Mail, MapPin, Phone, Heart, ExternalLink } from "lucide-react";
import { useLocation } from "wouter";

const ScrollToTopLink = ({ href, children, className = "" }: any) => {
  const [, setLocation] = useLocation();
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setLocation(href), 80);
  };
  return <a href={href} onClick={handleClick} className={className}>{children}</a>;
};

export function Footer() {
  const { data: settingsResponse } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => await storeService.getStoreSettings(),
  });
  const settings = settingsResponse?.data;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white/80 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="font-display text-xl text-white tracking-wide">{settings?.storeName || SITE_CONFIG.name}</span>
                <span className="block text-[10px] tracking-[0.25em] uppercase text-gold mt-0.5">evenimente & decoraÈ›iuni</span>
              </div>
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-sm mb-6">
              {settings?.storeDescription || SITE_CONFIG.description}
            </p>
            <div className="flex gap-3">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-sm border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-gold/60 hover:bg-gold/10 transition-all duration-300">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-sm border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-gold/60 hover:bg-gold/10 transition-all duration-300">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings?.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-sm border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-gold/60 hover:bg-gold/10 transition-all duration-300">
                  <TikTok className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase font-sans text-gold mb-5">Navigare</h4>
            <ul className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <ScrollToTopLink href={item.href}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-3 h-px bg-gold transition-all duration-300" />
                    {item.label}
                  </ScrollToTopLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.25em] uppercase font-sans text-gold mb-5">Contact</h4>
            <ul className="space-y-3">
              {settings?.contactPhone && (
                <li>
                  <a href={`tel:${settings.contactPhone}`}
                    className="text-sm text-white/55 hover:text-white flex items-center gap-2.5 transition-colors duration-200">
                    <Phone className="h-3.5 w-3.5 text-gold/70 shrink-0" />
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings?.contactEmail && (
                <li>
                  <a href={`mailto:${settings.contactEmail}`}
                    className="text-sm text-white/55 hover:text-white flex items-center gap-2.5 transition-colors duration-200">
                    <Mail className="h-3.5 w-3.5 text-gold/70 shrink-0" />
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings?.storeAddress && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-3.5 w-3.5 text-gold/70 shrink-0 mt-0.5" />
                  <span className="text-sm text-white/55">{settings.storeAddress}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35">
            Â© {year} {settings?.storeName || SITE_CONFIG.name}. Toate drepturile rezervate.
          </p>
          <p className="text-xs text-white/25 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-primary/60" /> for special events
          </p>
        </div>
      </div>
    </footer>
  );
}

export function TikTok(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}


