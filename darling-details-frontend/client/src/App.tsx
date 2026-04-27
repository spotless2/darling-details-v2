import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from "@/routes";
import { queryClient } from "@/lib/queryClient";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLocation } from "wouter";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <ScrollToTop />
        <MainLayout>
          <AppRoutes />
        </MainLayout>
        <Toaster />
    </QueryClientProvider>
  );
}