import { NextResponse } from "next/server";
import { TokenInfo } from "@/app/types/dca";

// Mock token data
const tokens: TokenInfo[] = [
  {
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    priceUsd: 2300,
  },
  {
    address: "0xA0b86a33E6441E6D3c3b6F7e8bb66F3da7E0b0Fc",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoUrl: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    priceUsd: 1,
  },
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    symbol: "UNI",
    name: "Uniswap",
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
    priceUsd: 7.5,
  },
  {
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    symbol: "LINK",
    name: "Chainlink",
    decimals: 18,
    logoUrl: "https://cryptologos.cc/logos/chainlink-link-logo.png",
    priceUsd: 15.2,
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch tokens" },
      { status: 500 }
    );
  }
}
