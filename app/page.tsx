"use client";

import { useEffect, useState } from "react";
import { DcaStrategy, TokenInfo } from "./types/dca";
import { Plus, TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function Dashboard() {
  const [strategies, setStrategies] = useState<DcaStrategy[]>([]);
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [strategiesRes, tokensRes] = await Promise.all([
        fetch("/api/strategies"),
        fetch("/api/tokens"),
      ]);

      const strategiesData = await strategiesRes.json();
      const tokensData = await tokensRes.json();

      if (strategiesData.success) setStrategies(strategiesData.data);
      if (tokensData.success) setTokens(tokensData.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalInvested = strategies.reduce(
    (sum, strategy) => sum + strategy.totalInvested,
    0
  );
  const activeStrategies = strategies.filter((s) => s.isActive).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage your DCA trading strategies
          </p>
        </div>
        <a
          href="/strategies/create"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Strategy</span>
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Activity className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Strategies
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activeStrategies}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Invested
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalInvested.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Strategies
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {strategies.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Strategies */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Strategies
          </h2>
          <a
            href="/strategies"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View all
          </a>
        </div>

        {strategies.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No strategies yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first DCA strategy to get started.
            </p>
            <div className="mt-6">
              <a href="/strategies/create" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Strategy
              </a>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Strategy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pair
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {strategies.slice(0, 5).map((strategy) => {
                  const tokenIn = tokens.find(
                    (t) => t.address === strategy.tokenIn
                  );
                  const tokenOut = tokens.find(
                    (t) => t.address === strategy.tokenOut
                  );

                  return (
                    <tr key={strategy.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {strategy.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tokenIn?.symbol || "Unknown"} →{" "}
                          {tokenOut?.symbol || "Unknown"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">
                          {strategy.frequency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${strategy.amountPerExecution}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            strategy.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {strategy.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Token Prices */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Token Prices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tokens.map((token) => (
            <div
              key={token.address}
              className="p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                {token.logoUrl && (
                  <img
                    src={token.logoUrl}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{token.symbol}</p>
                  <p className="text-sm text-gray-500">{token.name}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-lg font-semibold text-gray-900">
                  ${token.priceUsd?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
