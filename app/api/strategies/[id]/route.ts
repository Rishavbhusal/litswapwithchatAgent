import { NextRequest, NextResponse } from "next/server";

// This would reference the same mock store as above
// In production, you'd have a proper database connection

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // Mock update logic
    return NextResponse.json({
      success: true,
      message: `Strategy ${id} updated`,
      data: { id, ...body },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update strategy" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Mock delete logic
    return NextResponse.json({
      success: true,
      message: `Strategy ${id} deleted`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete strategy" },
      { status: 500 }
    );
  }
}
