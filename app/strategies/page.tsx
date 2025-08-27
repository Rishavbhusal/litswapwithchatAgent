"use client";

import { useEffect, useState } from "react";
import { DcaStrategy, TokenInfo } from "../types/dca";
import { Plus, Play, Pause, Trash2, Edit } from "lucide-react";

export default function StrategiesPage() {
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

  const toggleStrategy = async (strategyId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/strategies/${strategyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        setStrategies(
          strategies.map((s) =>
            s.id === strategyId ? { ...s, isActive: !isActive } : s
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle strategy:", error);
    }
  };

  const deleteStrategy = async (strategyId: string) => {
    if (!confirm("Are you sure you want to delete this strategy?")) return;

    try {
      const response = await fetch(`/api/strategies/${strategyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setStrategies(strategies.filter((s) => s.id !== strategyId));
      }
    } catch (error) {
      console.error("Failed to delete strategy:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DCA Strategies</h1>
          <p className="text-gray-600 mt-1">
            Manage your dollar-cost averaging strategies
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

      {/* Strategies List */}
      {strategies.length === 0 ? (
        <div className="card text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Plus className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No strategies yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first DCA strategy to start automated investing.
          </p>
          <a href="/strategies/create" className="btn-primary">
            Create Strategy
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {strategies.map((strategy) => {
            const tokenIn = tokens.find((t) => t.address === strategy.tokenIn);
            const tokenOut = tokens.find(
              (t) => t.address === strategy.tokenOut
            );

            return (
              <div key={strategy.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {strategy.name}
                      </h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          strategy.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {strategy.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-500">Trading Pair</p>
                        <p className="font-medium">
                          {tokenIn?.symbol || "Unknown"} →{" "}
                          {tokenOut?.symbol || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Amount per Execution
                        </p>
                        <p className="font-medium">
                          ${strategy.amountPerExecution}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Frequency</p>
                        <p className="font-medium capitalize">
                          {strategy.frequency}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Invested</p>
                        <p className="font-medium">
                          ${strategy.totalInvested.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Next execution:{" "}
                        {new Date(
                          strategy.nextExecutionAt
                        ).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            toggleStrategy(strategy.id, strategy.isActive)
                          }
                          className={`p-2 rounded-lg ${
                            strategy.isActive
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={strategy.isActive ? "Pause" : "Resume"}
                        >
                          {strategy.isActive ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteStrategy(strategy.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
