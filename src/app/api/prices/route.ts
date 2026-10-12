import { NextRequest, NextResponse } from "next/server";
import { INITIAL_PRICES } from "@/lib/market-pricing-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const brand = searchParams.get("brand");

  let result = INITIAL_PRICES;
  if (model) {
    result = result.filter((p) => p.model.toLowerCase().includes(model.toLowerCase()));
  }
  if (brand) {
    result = result.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  }

  return NextResponse.json({ success: true, count: result.length, data: result });
}
