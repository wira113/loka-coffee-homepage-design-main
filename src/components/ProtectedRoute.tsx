import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Jika masih loading, tampilkan loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Jika user belum login, redirect ke halaman login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Jika user sudah login, tampilkan halaman yang diminta
  return <>{children}</>;
}
