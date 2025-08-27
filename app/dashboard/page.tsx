"use client";

import { useEffect, useState } from "react";
import { TrendingUp, DollarSign, Activity, Shield, Plus } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "../stores/auth-store";
import { removeStoredVincentJWT } from "../lib/vincent-auth";

interface DashboardStats {
  totalInvested: number;
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  activeStrategies: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalInvested: 0,
    totalValue: 0,
    totalReturn: 0,
    returnPercentage: 0,
    activeStrategies: 0,
  });

  useEffect(() => {
    // Simulate loading dashboard data
    // In a real app, this would fetch from your API
    setStats({
      totalInvested: 12500,
      totalValue: 13750,
      totalReturn: 1250,
      returnPercentage: 10,
      activeStrategies: 3,
    });
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleTestLogout = () => {
    console.log("Testing logout function...");
    try {
      removeStoredVincentJWT();
      logout();
      console.log("Test logout completed - should redirect to login");
    } catch (error) {
      console.error("Test logout error:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's your DCA trading overview.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Connected Wallet</p>
            <p className="text-lg font-semibold text-gray-900">
              {user ? formatAddress(user.ethAddress) : "Not connected"}
            </p>
            <button
              onClick={handleTestLogout}
              className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Invested */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Invested
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalInvested)}
              </p>
            </div>
          </div>
        </div>

        {/* Current Value */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Return */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Return</p>
              <p className="text-2xl font-bold text-green-600">
                +{formatCurrency(stats.totalReturn)}
              </p>
              <p className="text-sm text-green-600">
                +{stats.returnPercentage}%
              </p>
            </div>
          </div>
        </div>

        {/* Active Strategies */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Strategies
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activeStrategies}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/strategies/create"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-8 w-8 text-gray-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Create New Strategy
              </h3>
              <p className="text-gray-600">Set up a new DCA trading strategy</p>
            </div>
          </Link>

          <Link
            href="/strategies"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Activity className="h-8 w-8 text-gray-400" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Manage Strategies
              </h3>
              <p className="text-gray-600">
                View and edit your existing strategies
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  ETH DCA Purchase
                </p>
                <p className="text-sm text-gray-600">
                  Strategy: Weekly ETH Investment
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">$250.00</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  BTC DCA Purchase
                </p>
                <p className="text-sm text-gray-600">
                  Strategy: Daily BTC Accumulation
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">$100.00</p>
              <p className="text-sm text-gray-600">1 day ago</p>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Strategy Created
                </p>
                <p className="text-sm text-gray-600">Monthly LINK Investment</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">New</p>
              <p className="text-sm text-gray-600">3 days ago</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/strategies"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all activities →
          </Link>
        </div>
      </div>
    </div>
  );
}
