import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";

// Public pages
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import ProductsAdmin from "@/pages/admin/Products"; //Renamed to avoid conflict
import AddProduct from "@/pages/admin/AddProduct";
import Settings from "@/pages/admin/Settings";

function Router() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      {!location.startsWith("/admin") && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Switch location={location}>
            {/* Public routes */}
            <Route path="/">
              <PageTransition>
                <Home />
              </PageTransition>
            </Route>
            <Route path="/products">
              <PageTransition>
                <Products />
              </PageTransition>
            </Route>
            <Route path="/about">
              <PageTransition>
                <About />
              </PageTransition>
            </Route>
            <Route path="/contact">
              <PageTransition>
                <Contact />
              </PageTransition>
            </Route>

            {/* Admin routes */}
            <Route path="/admin">
              <AdminLogin />
            </Route>
            <Route path="/admin/panel">
              <Dashboard />
            </Route>
            <Route path="/admin/panel/products">
              <ProductsAdmin /> {/* Using renamed component */}
            </Route>
            <Route path="/admin/panel/products/new">
              <AddProduct />
            </Route>
            <Route path="/admin/panel/settings">
              <Settings />
            </Route>

            {/* 404 */}
            <Route>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Route>
          </Switch>
        </AnimatePresence>
      </main>
      {!location.startsWith("/admin") && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;