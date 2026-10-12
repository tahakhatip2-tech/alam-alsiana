import { NextRequest, NextResponse } from "next/server";
import { IC_COMPATIBILITY_DATABASE, findICReplacements, calculateSafeInjection } from "@/lib/ic-database";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const results = findICReplacements(q);
  return NextResponse.json({ success: true, count: results.length, data: results });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { voltage, resistance } = body;
    const calc = calculateSafeInjection(Number(voltage), Number(resistance));
    return NextResponse.json({ success: true, data: calc });
  } catch (err: unknown) {
    return NextResponse.json({ error: "فشل الحساب", details: String(err) }, { status: 400 });
  }
}
