"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/auth-store";
import {
  handleVincentAuth,
  getCurrentUser,
  getStoredVincentJWT,
  isVincentJWTExpired,
} from "../lib/vincent-auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ["/login", "/"];

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    setUser,
    setAuthenticated,
    setJWT,
    setLoading,
    isAuthenticated,
    isLoading,
  } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("🏠 Auth Provider - Current pathname:", pathname);
        setLoading(true);

        // Handle Vincent authentication flow
        const authResult = handleVincentAuth();
        console.log("🔄 Auth Provider - After handleVincentAuth:", authResult);

        if (authResult.isAuthenticated && authResult.user) {
          console.log(
            "✅ Auth Provider - User authenticated:",
            authResult.user
          );

          // User is authenticated
          setUser(authResult.user);
          setAuthenticated(true);
          setJWT(getStoredVincentJWT());

          // Redirect to dashboard if on login page
          if (pathname === "/login") {
            console.log("🔀 Auth Provider - Redirecting to dashboard");
            router.push("/dashboard");
          }
        } else if (authResult.needsRedirect) {
          console.log("❌ Auth Provider - User needs authentication");

          // User needs authentication
          setUser(null);
          setAuthenticated(false);
          setJWT(null);

          // Redirect to login if on protected route
          if (!PUBLIC_ROUTES.includes(pathname)) {
            console.log("🔀 Auth Provider - Redirecting to login");
            router.push("/login");
          }
        }
      } catch (error) {
        console.error("💥 Auth initialization error:", error);
        setUser(null);
        setAuthenticated(false);
        setJWT(null);

        // Redirect to login on error
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [pathname, router, setUser, setAuthenticated, setJWT, setLoading]);

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Protect routes
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
