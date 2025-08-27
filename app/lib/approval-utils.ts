import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { getVincentAbilityClient } from "@lit-protocol/vincent-app-sdk/abilityClient";
import { bundledVincentAbility } from "@lit-protocol/vincent-ability-erc20-approval";
import { ERC20ApprovalRequest, ERC20ApprovalResult } from "@/app/types/dca";
import { ERROR_MESSAGES, HTTP_STATUS, RESPONSE_MESSAGES } from "./constants";

// Types for internal use
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  status?: number;
}

export interface EnvironmentConfig {
  delegateePrivateKey: string;
  appRpcUrl: string;
  appChainId: number;
  litRpcUrl: string;
}

export interface ApprovalParams {
  rpcUrl: string;
  chainId: number;
  spenderAddress: string;
  tokenAddress: string;
  tokenDecimals: number;
  tokenAmount: number;
}

/**
 * Validate required environment variables
 */
export function validateEnvironment(): ValidationResult {
  const delegateePrivateKey = process.env.VINCENT_APP_DELEGATEE_PRIVATE_KEY;
  const appRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  const appChainId = process.env.NEXT_PUBLIC_CHAIN_ID;
  const litRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

  if (!delegateePrivateKey) {
    environmentError("VINCENT_APP_DELEGATEE_PRIVATE_KEY");
    return {
      isValid: false,
      error: ERROR_MESSAGES.MISSING_ENV_VARS.DELEGATEE_PRIVATE_KEY,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }

  if (!appRpcUrl) {
    environmentError("NEXT_PUBLIC_RPC_URL");
    return {
      isValid: false,
      error: ERROR_MESSAGES.MISSING_ENV_VARS.RPC_URL,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }

  if (!appChainId) {
    environmentError("NEXT_PUBLIC_CHAIN_ID");
    return {
      isValid: false,
      error: ERROR_MESSAGES.MISSING_ENV_VARS.CHAIN_ID,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }

  if (!litRpcUrl) {
    environmentError("NEXT_PUBLIC_RPC_URL");
    return {
      isValid: false,
      error: ERROR_MESSAGES.MISSING_ENV_VARS.LIT_RPC_URL,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }

  return { isValid: true };
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    delegateePrivateKey: process.env.VINCENT_APP_DELEGATEE_PRIVATE_KEY!,
    appRpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
    appChainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
    litRpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
  };
}

/**
 * Validate ERC20 approval request parameters
 */
export function validateApprovalRequest(
  request: ERC20ApprovalRequest,
  isQueryParams = false
): ValidationResult {
  const { tokenAddress, spenderAddress, amount, tokenDecimals, delegatorPkpEthAddress } = request;

  // Check required fields
  const requiredFields = isQueryParams 
    ? [tokenAddress, spenderAddress, amount, tokenDecimals, delegatorPkpEthAddress]
    : [tokenAddress, spenderAddress, amount, delegatorPkpEthAddress];

  if (requiredFields.some(field => !field)) {
    const missingFields = isQueryParams 
      ? "tokenAddress, spenderAddress, amount, tokenDecimals, delegatorPkpEthAddress"
      : "tokenAddress, spenderAddress, amount, delegatorPkpEthAddress";
    
    validationError("required_fields", { missing: missingFields }, "missing_required_fields");
    return {
      isValid: false,
      error: `${ERROR_MESSAGES.VALIDATION.MISSING_PARAMS}: ${missingFields}`,
      status: HTTP_STATUS.BAD_REQUEST,
    };
  }

  // Validate Ethereum addresses
  if (
    !ethers.isAddress(tokenAddress) ||
    !ethers.isAddress(spenderAddress) ||
    !ethers.isAddress(delegatorPkpEthAddress)
  ) {
    validationError("ethereum_addresses", { tokenAddress, spenderAddress, delegatorPkpEthAddress }, "invalid_address_format");
    return {
      isValid: false,
      error: ERROR_MESSAGES.VALIDATION.INVALID_ADDRESS,
      status: HTTP_STATUS.BAD_REQUEST,
    };
  }

  // Validate amount for POST requests
  if (!isQueryParams) {
    try {
      const amountBigInt = BigInt(amount);
      if (amountBigInt <= 0) {
        validationError("amount", { amount }, "non_positive_amount");
        return {
          isValid: false,
          error: ERROR_MESSAGES.VALIDATION.INVALID_AMOUNT,
          status: HTTP_STATUS.BAD_REQUEST,
        };
      }
    } catch {
      validationError("amount", { amount }, "invalid_amount_format");
      return {
        isValid: false,
        error: ERROR_MESSAGES.VALIDATION.INVALID_AMOUNT_FORMAT,
        status: HTTP_STATUS.BAD_REQUEST,
      };
    }
  }

  return { isValid: true };
}

/**
 * Create Vincent ability client
 */
export function createAbilityClient(delegateePrivateKey: string) {
  const ethersSigner = new ethers.Wallet(delegateePrivateKey);
  return getVincentAbilityClient({
    ethersSigner,
    bundledVincentAbility,
  });
}

/**
 * Create approval parameters object
 */
export function createApprovalParams(
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  tokenDecimals: string,
  chainId: number,
  rpcUrl: string
): ApprovalParams {
  return {
    rpcUrl,
    chainId,
    spenderAddress,
    tokenAddress,
    tokenDecimals: parseInt(tokenDecimals),
    tokenAmount: parseInt(amount),
  };
}

/**
 * Handle PKP validation errors
 */
export function handlePkpValidationError(
  error: unknown,
  delegatorPkpEthAddress: string
): ValidationResult {
  if (
    error instanceof Error &&
    error.message.includes("ethAddressToPkpId")
  ) {
    return {
      isValid: false,
      error: `${ERROR_MESSAGES.PKP.VALIDATION_FAILED}: ${delegatorPkpEthAddress} ${ERROR_MESSAGES.PKP.INVALID_ADDRESS}. Please ensure you're using a valid Vincent Wallet address that exists on Chronicle Yellowstone (chain ID 175188).`,
      status: HTTP_STATUS.BAD_REQUEST,
    };
  }
  
  return { isValid: false };
}

/**
 * Create error response
 */
export function createErrorResponse(
  message: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  data?: Partial<ERC20ApprovalResult>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(data && { data }),
    },
    { status }
  );
}

/**
 * Create success response
 */
export function createSuccessResponse(
  data: ERC20ApprovalResult | any,
  status: number = HTTP_STATUS.OK
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Extract transaction hash from execution result
 */
export function extractTransactionHash(executeResult: any): string | undefined {
  return executeResult.success && executeResult.transactionHash
    ? executeResult.transactionHash
    : undefined;
}

/**
 * Create ERC20 approval result
 */
export function createApprovalResult(executeResult: any): ERC20ApprovalResult {
  const result = {
    success: executeResult.success,
    transactionHash: extractTransactionHash(executeResult),
    gasUsed: executeResult.gasUsed,
    error: executeResult.success
      ? undefined
      : executeResult.error || RESPONSE_MESSAGES.ERROR.EXECUTION_FAILED,
  };

  if (result.transactionHash) {
  }

  return result;
}
