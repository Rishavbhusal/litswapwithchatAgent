"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { ERC20ApprovalRequest, ERC20ApprovalResult } from "@/app/types/dca";

// Form validation schema
const approvalFormSchema = z.object({
  tokenAddress: z
    .string()
    .min(42, "Token address must be a valid Ethereum address")
    .max(42),
  spenderAddress: z
    .string()
    .min(42, "Spender address must be a valid Ethereum address")
    .max(42),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => {
      try {
        const num = parseInt(val);
        return num > 0;
      } catch {
        return false;
      }
    }, "Amount must be a positive number"),
  tokenDecimals: z.string().refine((val) => {
    const num = parseInt(val);
    return num >= 0 && num <= 18;
  }, "Token decimals must be between 0 and 18"),
  delegatorPkpEthAddress: z
    .string()
    .min(42, "Delegator PKP address must be a valid Ethereum address")
    .max(42),
});

type ApprovalFormData = z.infer<typeof approvalFormSchema>;

interface PrecheckResult {
  success: boolean;
  message?: string;
  error?: string;
}

export default function ApprovalsPage(): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPrecheckLoading, setIsPrecheckLoading] = useState<boolean>(false);
  const [approvalResult, setApprovalResult] =
    useState<ERC20ApprovalResult | null>(null);
  const [precheckResult, setPrecheckResult] = useState<PrecheckResult | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalFormSchema),
    defaultValues: {
      tokenAddress: "",
      spenderAddress: "",
      amount: "",
      tokenDecimals: "6",
      delegatorPkpEthAddress: "",
    },
  });

  const watchedValues = watch();

  const executePrecheck = async (): Promise<void> => {
    try {
      setIsPrecheckLoading(true);
      setPrecheckResult(null);

      const values = getValues();

      // Validate form before precheck
      const validation = approvalFormSchema.safeParse(values);
      if (!validation.success) {
        setPrecheckResult({
          success: false,
          error: "Please fill in all required fields correctly",
        });
        return;
      }

      const params = new URLSearchParams({
        tokenAddress: values.tokenAddress,
        spenderAddress: values.spenderAddress,
        amount: values.amount,
        tokenDecimals: values.tokenDecimals,
        delegatorPkpEthAddress: values.delegatorPkpEthAddress,
      });

      const response = await fetch(`/api/approvals?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Precheck failed");
      }

      setPrecheckResult({
        success: result.success,
        message: result.data?.message || "Precheck completed successfully",
      });
    } catch (error) {
      console.error("Precheck error:", error);
      setPrecheckResult({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsPrecheckLoading(false);
    }
  };

  const onSubmit = async (data: ApprovalFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setApprovalResult(null);

      const requestData = {
        tokenAddress: data.tokenAddress,
        spenderAddress: data.spenderAddress,
        amount: data.amount,
        tokenDecimals: data.tokenDecimals,
        delegatorPkpEthAddress: data.delegatorPkpEthAddress,
      };

      const response = await fetch("/api/approvals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Approval execution failed");
      }

      setApprovalResult(result.data);
    } catch (error) {
      console.error("Approval execution error:", error);
      setApprovalResult({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = (): boolean => {
    const validation = approvalFormSchema.safeParse(watchedValues);
    return validation.success;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              ERC20 Token Approval
            </h1>
            <p className="text-blue-100 mt-2">
              Execute ERC20 token approvals using Vincent Abilities
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Token Address */}
              <div>
                <label
                  htmlFor="tokenAddress"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Token Contract Address *
                </label>
                <input
                  {...register("tokenAddress")}
                  type="text"
                  id="tokenAddress"
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.tokenAddress && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tokenAddress.message}
                  </p>
                )}
              </div>

              {/* Spender Address */}
              <div>
                <label
                  htmlFor="spenderAddress"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Spender Address *
                </label>
                <input
                  {...register("spenderAddress")}
                  type="text"
                  id="spenderAddress"
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.spenderAddress && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.spenderAddress.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Amount (in token's smallest unit) *
                </label>
                <input
                  {...register("amount")}
                  type="text"
                  id="amount"
                  placeholder="1000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Enter the amount in the token's smallest unit. For USDC (6
                  decimals): 1 USDC = 1000000
                </p>
              </div>

              {/* Token Decimals */}
              <div>
                <label
                  htmlFor="tokenDecimals"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Token Decimals *
                </label>
                <input
                  {...register("tokenDecimals")}
                  type="text"
                  id="tokenDecimals"
                  placeholder="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.tokenDecimals && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tokenDecimals.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Number of decimal places for this token. Common values:
                  ETH=18, USDC=6, USDT=6
                </p>
              </div>

              {/* Delegator PKP Address */}
              <div>
                <label
                  htmlFor="delegatorPkpEthAddress"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Vincent Wallet Address *
                </label>
                <input
                  {...register("delegatorPkpEthAddress")}
                  type="text"
                  id="delegatorPkpEthAddress"
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.delegatorPkpEthAddress && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.delegatorPkpEthAddress.message}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  The Ethereum address of the Vincent Wallet on whose behalf the
                  approval will be executed. This must be a valid Vincent Wallet
                  address that exists on the target network (Base mainnet: Chain
                  ID 8453).
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Precheck Button */}
                <button
                  type="button"
                  onClick={executePrecheck}
                  disabled={isPrecheckLoading || !isFormValid()}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPrecheckLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Run Precheck
                </button>

                {/* Execute Button */}
                <button
                  type="submit"
                  disabled={
                    isLoading || !isFormValid() || !precheckResult?.success
                  }
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Execute Approval
                </button>
              </div>
            </form>

            {/* Precheck Results */}
            {precheckResult && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Precheck Results
                </h3>
                <div
                  className={`p-4 rounded-md ${
                    precheckResult.success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-start">
                    {precheckResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          precheckResult.success
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {precheckResult.success
                          ? "Precheck Passed"
                          : "Precheck Failed"}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          precheckResult.success
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {precheckResult.message || precheckResult.error}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Execution Results */}
            {approvalResult && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Execution Results
                </h3>
                <div
                  className={`p-4 rounded-md ${
                    approvalResult.success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-start">
                    {approvalResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          approvalResult.success
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {approvalResult.success
                          ? "Approval Executed Successfully"
                          : "Approval Failed"}
                      </p>

                      {approvalResult.success &&
                        approvalResult.transactionHash && (
                          <div className="mt-2">
                            <p className="text-sm text-green-700">
                              <strong>Transaction Hash:</strong>
                            </p>
                            <p className="text-sm text-green-600 font-mono break-all">
                              {approvalResult.transactionHash}
                            </p>
                          </div>
                        )}

                      {approvalResult.gasUsed && (
                        <p className="text-sm text-green-700 mt-1">
                          <strong>Gas Used:</strong>{" "}
                          {approvalResult.gasUsed.toLocaleString()}
                        </p>
                      )}

                      {approvalResult.error && (
                        <p className="text-sm text-red-700 mt-1">
                          <strong>Error:</strong> {approvalResult.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                How ERC20 Approval Works
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Run precheck first to validate the approval parameters and
                  policies
                </li>
                <li>
                  • The approval allows the spender address to transfer tokens
                  on behalf of the Vincent Wallet
                </li>
                <li>
                  • Amount should be specified in the token's smallest unit
                  based on token decimals (e.g., for USDC with 6 decimals: 1
                  USDC = 1,000,000 units)
                </li>
                <li>
                  • Token decimals specify how many decimal places the token
                  uses (ETH=18, USDC=6, USDT=6, etc.)
                </li>
                <li>
                  • Execution requires a valid Vincent Wallet address that
                  exists on the target network
                </li>
                <li>
                  • Make sure the Vincent Wallet has been properly created and
                  registered on Chronicle Yellowstone (Chain ID: 175188)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
