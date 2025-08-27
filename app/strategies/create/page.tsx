"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DcaFrequency,
  TokenInfo,
  CreateStrategyRequest,
} from "../../types/dca";

export default function CreateStrategyPage() {
  const router = useRouter();
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateStrategyRequest>({
    name: "",
    tokenIn: "",
    tokenOut: "",
    amountPerExecution: 0,
    frequency: DcaFrequency.WEEKLY,
  });

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/tokens");
      const data = await response.json();
      if (data.success) {
        setTokens(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/strategies");
      } else {
        alert("Failed to create strategy: " + data.error);
      }
    } catch (error) {
      console.error("Failed to create strategy:", error);
      alert("Failed to create strategy");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amountPerExecution" ? parseFloat(value) || 0 : value,
    }));
  };

  const selectedTokenIn = tokens.find((t) => t.address === formData.tokenIn);
  const selectedTokenOut = tokens.find((t) => t.address === formData.tokenOut);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create DCA Strategy
        </h1>
        <p className="text-gray-600 mt-1">
          Set up a new dollar-cost averaging strategy
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Strategy Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Strategy Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., ETH Weekly DCA"
              className="input"
              required
            />
          </div>

          {/* Token Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="tokenIn"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                From Token (You Pay)
              </label>
              <select
                id="tokenIn"
                name="tokenIn"
                value={formData.tokenIn}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Select token</option>
                {tokens.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
              {selectedTokenIn && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                  {selectedTokenIn.logoUrl && (
                    <img
                      src={selectedTokenIn.logoUrl}
                      alt={selectedTokenIn.symbol}
                      className="w-4 h-4 rounded-full"
                    />
                  )}
                  <span>Current price: ${selectedTokenIn.priceUsd}</span>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="tokenOut"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                To Token (You Receive)
              </label>
              <select
                id="tokenOut"
                name="tokenOut"
                value={formData.tokenOut}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Select token</option>
                {tokens.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
              </select>
              {selectedTokenOut && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                  {selectedTokenOut.logoUrl && (
                    <img
                      src={selectedTokenOut.logoUrl}
                      alt={selectedTokenOut.symbol}
                      className="w-4 h-4 rounded-full"
                    />
                  )}
                  <span>Current price: ${selectedTokenOut.priceUsd}</span>
                </div>
              )}
            </div>
          </div>

          {/* Amount and Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="amountPerExecution"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount per Execution ($)
              </label>
              <input
                type="number"
                id="amountPerExecution"
                name="amountPerExecution"
                value={formData.amountPerExecution}
                onChange={handleInputChange}
                placeholder="100"
                min="1"
                step="0.01"
                className="input"
                required
              />
            </div>

            <div>
              <label
                htmlFor="frequency"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value={DcaFrequency.DAILY}>Daily</option>
                <option value={DcaFrequency.WEEKLY}>Weekly</option>
                <option value={DcaFrequency.MONTHLY}>Monthly</option>
              </select>
            </div>
          </div>

          {/* Preview */}
          {formData.tokenIn &&
            formData.tokenOut &&
            formData.amountPerExecution > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Strategy Preview
                </h3>
                <div className="text-sm text-blue-800">
                  <p>
                    Every {formData.frequency}, spend $
                    {formData.amountPerExecution} {selectedTokenIn?.symbol} to
                    buy {selectedTokenOut?.symbol}
                  </p>
                  {selectedTokenIn?.priceUsd && selectedTokenOut?.priceUsd && (
                    <p className="mt-1">
                      Estimated {selectedTokenOut?.symbol} per execution: ~
                      {(
                        formData.amountPerExecution / selectedTokenOut.priceUsd
                      ).toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
            )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Strategy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
