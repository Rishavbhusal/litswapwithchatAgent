import { NextRequest, NextResponse } from "next/server";
import { ERC20ApprovalResult } from "@/app/types/dca";
import {
  validateEnvironment,
  getEnvironmentConfig,
  validateApprovalRequest,
  createAbilityClient,
  createApprovalParams,
  handlePkpValidationError,
  createErrorResponse,
  createSuccessResponse,
  createApprovalResult,
} from "@/app/lib/approval-utils";
import { RESPONSE_MESSAGES, DEFAULTS } from "@/app/lib/constants";

/**
 * Execute precheck for ERC20 approval
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const endpoint = "/api/approvals";

  try {

    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const approvalRequest = {
      tokenAddress: searchParams.get("tokenAddress"),
      spenderAddress: searchParams.get("spenderAddress"),
      amount: searchParams.get("amount"),
      tokenDecimals: searchParams.get("tokenDecimals"),
      delegatorPkpEthAddress: searchParams.get("delegatorPkpEthAddress"),
    };

    // Validate request parameters
    const validationResult = validateApprovalRequest(approvalRequest, true);
    if (!validationResult.isValid) {
      const duration = Date.now() - startTime;
      return createErrorResponse(validationResult.error!, validationResult.status!);
    }

    // Validate environment configuration
    const envValidation = validateEnvironment();
    if (!envValidation.isValid) {
      const duration = Date.now() - startTime;
      return createErrorResponse(envValidation.error!, envValidation.status!);
    }

    // Get environment configuration
    const config = getEnvironmentConfig();

    // Create ability client
    const abilityClient = createAbilityClient(config.delegateePrivateKey);

    console.log({
      tokenAddress: approvalRequest.tokenAddress,
      spenderAddress: approvalRequest.spenderAddress,
      tokenAmount: parseInt(approvalRequest.amount!),
      tokenDecimals: parseInt(approvalRequest.tokenDecimals!),
      rpcUrl: config.appRpcUrl,
      chainId: config.appChainId,
    }, "-------------->")




    // Create approval parameters
    const approvalParams = createApprovalParams(
      approvalRequest.tokenAddress!,
      approvalRequest.spenderAddress!,
      approvalRequest.amount!,
      approvalRequest.tokenDecimals!,
      config.appChainId,
      config.appRpcUrl
    );

    // Validate PKP address exists before proceeding
    try {

      console.log(approvalParams);
      console.log(abilityClient);
      console.log(approvalRequest.delegatorPkpEthAddress);
      const precheckResult = await abilityClient.precheck(approvalParams, {
        delegatorPkpEthAddress: approvalRequest.delegatorPkpEthAddress!,
        // rpcUrl: config.appRpcUrl,
      });


      const duration = Date.now() - startTime;

      return createSuccessResponse({
        success: precheckResult.success,
        message: precheckResult.success
          ? RESPONSE_MESSAGES.SUCCESS.PRECHECK_PASSED
          : RESPONSE_MESSAGES.SUCCESS.PRECHECK_FAILED,
        details: precheckResult,
      });
    } catch (precheckError) {

      // Handle specific PKP router errors
      const pkpValidation = handlePkpValidationError(
        precheckError,
        approvalRequest.delegatorPkpEthAddress!
      );

      if (pkpValidation.error) {
        const duration = Date.now() - startTime;
        return createErrorResponse(pkpValidation.error, pkpValidation.status!);
      }

      // Re-throw other errors to be handled by the outer catch block
      throw precheckError;
    }
  } catch (error) {

    const duration = Date.now() - startTime;

    return createErrorResponse(
      error instanceof Error ? error.message : RESPONSE_MESSAGES.ERROR.UNKNOWN_ERROR
    );
  }
}

/**
 * Execute ERC20 approval using Vincent Ability
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {

    const body = await request.json();

    // Validate request body
    const validationResult = validateApprovalRequest(body, false);
    if (!validationResult.isValid) {
      const duration = Date.now() - startTime;
      return createErrorResponse(validationResult.error!, validationResult.status!);
    }

    // Validate environment configuration
    const envValidation = validateEnvironment();
    if (!envValidation.isValid) {
      const duration = Date.now() - startTime;
      return createErrorResponse(envValidation.error!, envValidation.status!);
    }

    // Get environment configuration
    const config = getEnvironmentConfig();

    // Create ability client
    const abilityClient = createAbilityClient(config.delegateePrivateKey);

    // Create approval parameters
    const approvalParams = createApprovalParams(
      body.tokenAddress,
      body.spenderAddress,
      body.amount,
      body.tokenDecimals || DEFAULTS.TOKEN_DECIMALS.toString(),
      config.appChainId,
      config.appRpcUrl
    );
    // console.log(`Approval Params ->${JSON.stringfy(approvalParams)}`)

    console.log("Approval Params");
    console.log(approvalParams)

    const executeResult = await abilityClient.execute(approvalParams, {
      delegatorPkpEthAddress: body.delegatorPkpEthAddress, // The Vincent App User's Vincent Wallet address
    },  '0.0.12-mma');



    // Create approval result
    const result = createApprovalResult(executeResult);
    const responseStatus = executeResult.success ? 200 : 400;

    const duration = Date.now() - startTime;

    return createSuccessResponse(result, responseStatus);
  } catch (error) {

    const result: ERC20ApprovalResult = {
      success: false,
      error: error instanceof Error ? error.message : RESPONSE_MESSAGES.ERROR.UNKNOWN_ERROR,
    };

    const duration = Date.now() - startTime;

    return createErrorResponse(RESPONSE_MESSAGES.ERROR.EXECUTION_FAILED, 500, result);
  }
}
