import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from "@/routes";
import { queryClient } from "@/lib/queryClient";
import { MainLayout } from "@/components/layout/MainLayout";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
        <Toaster />
    </QueryClientProvider>
  );
}