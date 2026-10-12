import { NextRequest, NextResponse } from "next/server";
import { FAULTS_DATABASE, diagnosePowerDraw } from "@/lib/faults-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { model = "", powerDraw = "" } = body;

    if (!powerDraw || typeof powerDraw !== "string") {
      return NextResponse.json(
        { error: "يرجى إدخال سحبة الباور سبلاي" },
        { status: 400 }
      );
    }

    const result = diagnosePowerDraw(model, powerDraw);

    if (!result) {
      return NextResponse.json(
        { error: "لم يتم العثور على تشخيص مناسب" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.item,
      exactMatch: result.exactMatch,
      similarityNote: result.similarityNote || null,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء فحص العطل", details: String(err) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const brand = searchParams.get("brand");

  let list = FAULTS_DATABASE;
  if (model) {
    list = list.filter((f) => f.model.toLowerCase().includes(model.toLowerCase()));
  }
  if (brand) {
    list = list.filter((f) => f.brand.toLowerCase() === brand.toLowerCase());
  }

  return NextResponse.json({ success: true, count: list.length, data: list });
}
