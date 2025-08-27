export interface DcaStrategy {
  id: string;
  userId: string;
  name: string;
  tokenIn: string;
  tokenOut: string;
  amountPerExecution: number;
  frequency: DcaFrequency;
  isActive: boolean;
  totalInvested: number;
  totalReceived: number;
  createdAt: Date;
  lastExecutedAt?: Date;
  nextExecutionAt: Date;
}

export enum DcaFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export interface DcaExecution {
  id: string;
  strategyId: string;
  amountIn: number;
  amountOut: number;
  priceAtExecution: number;
  transactionHash: string;
  executedAt: Date;
  gasUsed: number;
  status: ExecutionStatus;
}

export enum ExecutionStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoUrl?: string;
  priceUsd?: number;
}

export interface PriceData {
  tokenAddress: string;
  priceUsd: number;
  timestamp: Date;
  change24h?: number;
}

export interface WalletBalance {
  tokenAddress: string;
  symbol: string;
  balance: string;
  balanceUsd: number;
}

export interface CreateStrategyRequest {
  name: string;
  tokenIn: string;
  tokenOut: string;
  amountPerExecution: number;
  frequency: DcaFrequency;
}

export interface StrategyPerformance {
  strategyId: string;
  totalInvested: number;
  totalReceived: number;
  totalReturn: number;
  totalReturnPercentage: number;
  averageBuyPrice: number;
  executionCount: number;
}

// ERC20 Approval Types
export interface ERC20ApprovalRequest {
  tokenAddress: string;
  spenderAddress: string;
  amount: string;
  tokenDecimals: string;
  delegatorPkpEthAddress: string;
}

export interface ERC20ApprovalResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  gasUsed?: number;
}

export interface ApprovalParams {
  tokenAddress: string;
  spenderAddress: string;
  amount: string;
}

export interface ApprovalContext {
  delegatorPkpEthAddress: string;
  rpcUrl?: string;
}
