import { NextRequest, NextResponse } from "next/server";
import { PriceData } from "@/app/types/dca";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenAddress = searchParams.get("token");

    if (!tokenAddress) {
      return NextResponse.json(
        { success: false, error: "Token address required" },
        { status: 400 }
      );
    }

    // Mock price data
    const mockPrices: Record<string, PriceData> = {
      "0x0000000000000000000000000000000000000000": {
        tokenAddress: "0x0000000000000000000000000000000000000000",
        priceUsd: 2300 + Math.random() * 100 - 50,
        timestamp: new Date(),
        change24h: Math.random() * 20 - 10,
      },
      "0xA0b86a33E6441E6D3c3b6F7e8bb66F3da7E0b0Fc": {
        tokenAddress: "0xA0b86a33E6441E6D3c3b6F7e8bb66F3da7E0b0Fc",
        priceUsd: 1.0,
        timestamp: new Date(),
        change24h: Math.random() * 2 - 1,
      },
    };

    const priceData = mockPrices[tokenAddress] || {
      tokenAddress,
      priceUsd: Math.random() * 100,
      timestamp: new Date(),
      change24h: Math.random() * 20 - 10,
    };

    return NextResponse.json({
      success: true,
      data: priceData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch price data" },
      { status: 500 }
    );
  }
}
