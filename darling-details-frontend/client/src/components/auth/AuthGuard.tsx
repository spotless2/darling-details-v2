import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { authService } from "@/services";
import { useQuery } from "@tanstack/react-query";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  redirectTo = "/login" 
}: AuthGuardProps) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // Verify token on mount
  const { data: verifyResponse, isLoading } = useQuery({
    queryKey: ['verify-token'],
    queryFn: async () => {
      try {
        return await authService.verifyToken();
      } catch (error) {
        return null;
      }
    },
    enabled: authService.isAuthenticated(),
  });

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        // No token at all, redirect immediately
        setLocation(redirectTo);
        return;
      }

      if (!isLoading) {
        // Token verification completed
        if (!verifyResponse || !verifyResponse.valid) {
          // Invalid token
          authService.logout();
          setLocation(redirectTo);
        }
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [redirectTo, setLocation, verifyResponse, isLoading]);

  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
