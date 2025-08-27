"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Menu,
  X,
  User,
  LogOut,
  Shield,
  Copy,
} from "lucide-react";
import { useAuthStore } from "../stores/auth-store";
import { removeStoredVincentJWT } from "../lib/vincent-auth";

export function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      console.log("Logging out...");

      // Close dropdown first
      setIsProfileOpen(false);
      setIsMenuOpen(false);

      // Small delay to ensure UI updates
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Clean up Vincent authentication
      removeStoredVincentJWT();

      // Clear Zustand store
      logout();

      // Navigate to login with a small delay
      setTimeout(() => {
        router.push("/login");
      }, 200);

      console.log("Logout completed");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy address:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                DCA Trading
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/strategies"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Strategies
            </Link>
            <Link
              href="/strategies/create"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Strategy
            </Link>
            <Link
              href="/approvals"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
            >
              <Shield className="h-4 w-4 mr-1" />
              Approvals
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{user ? formatAddress(user.ethAddress) : "User"}</span>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">
                      Connected Wallet
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-900 flex items-center justify-between">
                      <span>{user ? formatAddress(user.ethAddress) : "Not connected"}</span>
                      {user && (
                        <button
                          onClick={() => copyAddress(user.ethAddress)}
                          className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy address"
                        >
                          <Copy className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                        </button>
                      )}
                    </div>
                    {copySuccess && (
                      <div className="px-4 py-1 text-xs text-green-600 bg-green-50">
                        Address copied!
                      </div>
                    )}
                    <div className="border-t">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("Disconnect button clicked!");
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t">
              <Link
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/strategies"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Strategies
              </Link>
              <Link
                href="/strategies/create"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Strategy
              </Link>
              <Link
                href="/approvals"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-4 w-4 mr-2" />
                Approvals
              </Link>

              {/* Mobile Profile Section */}
              <div className="border-t pt-3 mt-3">
                <div className="px-3 py-2">
                  <p className="text-xs text-gray-500">Connected as:</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {user ? formatAddress(user.ethAddress) : "Not connected"}
                    </p>
                    {user && (
                      <button
                        onClick={() => copyAddress(user.ethAddress)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy address"
                      >
                        <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                      </button>
                    )}
                  </div>
                  {copySuccess && (
                    <div className="mt-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      Address copied!
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLogout();
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={(e) => {
            e.preventDefault();
            console.log("Backdrop clicked, closing dropdown");
            setIsProfileOpen(false);
          }}
        />
      )}
    </nav>
  );
}
