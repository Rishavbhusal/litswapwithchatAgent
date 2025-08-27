import { NextRequest, NextResponse } from "next/server";
import {
  DcaStrategy,
  CreateStrategyRequest,
  DcaFrequency,
} from "@/app/types/dca";

// Mock data store (in production, this would be a database)
let strategies: DcaStrategy[] = [
  {
    id: "1",
    userId: "user1",
    name: "ETH Weekly DCA",
    tokenIn: "0xA0b86a33E6441E6D3c3b6F7e8bb66F3da7E0b0Fc", // USDC
    tokenOut: "0x0000000000000000000000000000000000000000", // ETH
    amountPerExecution: 100,
    frequency: DcaFrequency.WEEKLY,
    isActive: true,
    totalInvested: 500,
    totalReceived: 0.25,
    createdAt: new Date("2024-01-01"),
    lastExecutedAt: new Date("2024-01-15"),
    nextExecutionAt: new Date("2024-01-22"),
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: strategies,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch strategies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateStrategyRequest = await request.json();

    const newStrategy: DcaStrategy = {
      id: Math.random().toString(36).substr(2, 9),
      userId: "user1", // In production, get from auth
      name: body.name,
      tokenIn: body.tokenIn,
      tokenOut: body.tokenOut,
      amountPerExecution: body.amountPerExecution,
      frequency: body.frequency,
      isActive: true,
      totalInvested: 0,
      totalReceived: 0,
      createdAt: new Date(),
      nextExecutionAt: calculateNextExecution(body.frequency),
    };

    strategies.push(newStrategy);

    return NextResponse.json({
      success: true,
      data: newStrategy,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create strategy" },
      { status: 500 }
    );
  }
}

function calculateNextExecution(frequency: DcaFrequency): Date {
  const now = new Date();
  switch (frequency) {
    case DcaFrequency.DAILY:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case DcaFrequency.WEEKLY:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case DcaFrequency.MONTHLY:
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
}
