"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Wallet, ArrowRight, CheckCircle, Zap } from "lucide-react";
import {
  handleVincentAuth,
  redirectToVincentConnect,
  getCurrentUser,
  removeStoredVincentJWT,
} from "../lib/vincent-auth";
import { useAuthStore } from "../stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setAuthenticated, setJWT, setLoading, isLoading } =
    useAuthStore();
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    needsRedirect: boolean;
    user: any;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("📄 Login Page - URL:", window.location.href);
        setLoading(true);

        // Handle Vincent authentication
        const result = handleVincentAuth();
        console.log("🔄 Login Page - Auth result:", result);
        setAuthState(result);

        if (result.isAuthenticated && result.user) {
          console.log(
            "✅ Login Page - User authenticated, redirecting to dashboard"
          );

          // Update store
          setUser(result.user);
          setAuthenticated(true);
          setJWT(localStorage.getItem("VINCENT_AUTH_JWT"));

          // Redirect to dashboard
          router.push("/dashboard");
        } else if (result.needsRedirect) {
          console.log("❌ Login Page - User needs authentication");

          // User needs to authenticate
          setAuthenticated(false);
          setUser(null);
          setJWT(null);
        }
      } catch (error) {
        console.error("💥 Login Page - Authentication error:", error);
        setAuthenticated(false);
        setUser(null);
        setJWT(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, setUser, setAuthenticated, setJWT, setLoading]);

  const handleConnect = () => {
    try {
      redirectToVincentConnect();
    } catch (error) {
      console.error("Failed to redirect to Vincent Connect:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                DCA Trading
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to DCA Trading
              </h2>
              <p className="text-gray-600 mb-8">
                Secure, automated dollar-cost averaging for your crypto
                investments
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Secure wallet authentication
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Automated DCA strategies
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Real-time portfolio tracking
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  Cross-chain support
                </span>
              </div>
            </div>

            {/* Connect Button */}
            <button
              onClick={handleConnect}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Wallet className="h-5 w-5 mr-2" />
              Connect with Vincent
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>

            {/* Info Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By connecting, you agree to our Terms of Service and Privacy
                Policy. Your wallet will be used to authenticate and execute
                trading strategies.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              How Wallet Authentication Works
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <p>Connect your wallet securely</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <p>Review and configure trading permissions</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                  3
                </span>
                <p>Start creating automated DCA strategies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
