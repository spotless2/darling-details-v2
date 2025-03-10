import { ReactNode, FC } from "react";
import { Route, useLocation } from "wouter";
import { AuthGuard } from "./AuthGuard";

interface ProtectedRouteProps {
  path: string;
  component: FC;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  return (
    <Route
      path={path}
      component={() => (
        <AuthGuard>
          <Component />
        </AuthGuard>
      )}
    />
  );
}
