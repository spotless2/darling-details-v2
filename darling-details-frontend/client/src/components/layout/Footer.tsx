import { useQuery } from "@tanstack/react-query";
import { storeService } from "@/services";
import { Facebook, Instagram, Mail, MapPin, Phone, Loader2 } from "lucide-react";

export function Footer() {
  // Fetch store settings
  const { data: settingsResponse, isLoading, error } = useQuery({
    queryKey: ["store-settings"],
    queryFn: async () => await storeService.getStoreSettings(),
  });

  const settings = settingsResponse?.data;

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-gray-500">
            Unable to load store information.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {settings?.storeName || "Darling Details"}
              </h3>
              <p className="text-gray-600 max-w-xs">
                {settings?.storeDescription || "Your one-stop shop for all things beautiful"}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact
              </h3>
              <div className="space-y-3">
                {settings?.contactPhone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{settings.contactPhone}</span>
                  </div>
                )}
                
                {settings?.contactEmail && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{settings.contactEmail}</span>
                  </div>
                )}
                
                {settings?.storeAddress && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{settings.storeAddress}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Social Media
              </h3>
              <div className="flex space-x-4">
                {settings?.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                )}
                
                {settings?.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} {settings?.storeName || "Darling Details"}. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}