import { Route, Switch, Redirect } from "wouter";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { authService } from "@/services";

// Fallback loading component 
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Lazy load components
const Home = lazy(() => import("@/pages/Home"));
const Products = lazy(() => import("@/pages/Products"));
const About = lazy(() => import("@/pages/About")); // Add About page
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("@/pages/admin/Products"));
const AddProduct = lazy(() => import("@/pages/admin/AddProduct"));
const EditProduct = lazy(() => import("@/pages/admin/EditProduct"));
const AdminSettings = lazy(() => import("@/pages/admin/Settings"));

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/about" component={About} /> {/* Add About route */}
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />

        {/* Admin Root Redirects */}
        <Route path="/admin">
          {() => {
            // Redirect to admin panel if authenticated, otherwise to login
            return authService.isAuthenticated() 
              ? <Redirect to="/admin/panel" /> 
              : <Redirect to="/login" />;
          }}
        </Route>
        
        <Route path="/admin/login">
          {() => <Redirect to="/login" />}
        </Route>

        {/* Protected Admin Routes */}
        <ProtectedRoute path="/admin/panel" component={AdminDashboard} />
        <ProtectedRoute path="/admin/panel/products" component={AdminProducts} />
        <ProtectedRoute path="/admin/panel/products/new" component={AddProduct} />
        <ProtectedRoute path="/admin/panel/products/edit/:id" component={EditProduct} />
        <ProtectedRoute path="/admin/panel/settings" component={AdminSettings} />
        
        {/* 404 Route */}
        <Route>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <p className="mb-6">The page you are looking for doesn't exist.</p>
              <a href="/" className="text-primary hover:underline">
                Go back to home page
              </a>
            </div>
          </div>
        </Route>
      </Switch>
    </Suspense>
  );
}
