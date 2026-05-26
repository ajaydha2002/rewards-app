import { NextResponse } from "next/server";

let customers: any = {};

export async function POST(req: Request) {
  const body = await req.json();

  const { mobile, points } = body;

  if (!customers[mobile]) {
    customers[mobile] = {
      totalPoints: 0,
    };
  }

  customers[mobile].totalPoints += points;

  return NextResponse.json({
    success: true,
    totalPoints: customers[mobile].totalPoints,
  });
}