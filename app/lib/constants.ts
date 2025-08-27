// Network and Chain Configuration
export const NETWORKS = {
  BASE: {
    id: 8453,
    name: "Base",
    rpcUrl: "https://mainnet.base.org",
    explorer: "https://basescan.org",
  },
  LIT: {
    id: 175188,
    name: "Chronicle Yellowstone",
    rpcUrl: "https://yellowstone-rpc.litprotocol.com/",
    explorer: "https://explorer.litprotocol.com",
  },
} as const;

// Common Contract Addresses
export const CONTRACTS = {
  UNISWAP_V3_ROUTER: "0x2626664c2603336E57B271c5C0b26F421741e481",
  WETH: "0x4200000000000000000000000000000000000006",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
} as const;

// Token Configuration
export const TOKENS = {
  WETH: {
    address: CONTRACTS.WETH,
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
  },
  USDC: {
    address: CONTRACTS.USDC,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
} as const;

// Default Values
export const DEFAULTS = {
  TOKEN_DECIMALS: 18,
  SLIPPAGE_TOLERANCE: 0.5, // 0.5%
  GAS_LIMIT: 300000,
  MAX_PRIORITY_FEE: 2, // 2 gwei
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  MISSING_ENV_VARS: {
    DELEGATEE_PRIVATE_KEY: "Vincent delegatee private key not configured",
    RPC_URL: "Application RPC URL not configured",
    CHAIN_ID: "Application Chain ID not configured",
    LIT_RPC_URL: "Lit RPC URL not configured",
  },
  VALIDATION: {
    INVALID_ADDRESS: "Invalid Ethereum address format",
    MISSING_PARAMS: "Missing required parameters",
    INVALID_AMOUNT: "Amount must be a positive number",
    INVALID_AMOUNT_FORMAT: "Invalid amount format",
  },
  PKP: {
    VALIDATION_FAILED: "PKP address validation failed",
    INVALID_ADDRESS: "is not a valid Vincent Wallet address on the Lit network",
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Response Messages
export const RESPONSE_MESSAGES = {
  SUCCESS: {
    PRECHECK_PASSED: "Precheck passed successfully",
    PRECHECK_FAILED: "Precheck failed",
    EXECUTION_SUCCESS: "Execution completed successfully",
  },
  ERROR: {
    UNKNOWN_ERROR: "Unknown error occurred",
    EXECUTION_FAILED: "Execution failed",
  },
} as const;
