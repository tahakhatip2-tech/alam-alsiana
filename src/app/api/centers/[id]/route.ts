import { NextResponse } from "next/server";
import { INITIAL_MAINTENANCE_CENTERS, MaintenanceCenter } from "@/lib/centers-data";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const allCenters: MaintenanceCenter[] =
      (global as any).__alam_centers || INITIAL_MAINTENANCE_CENTERS;

    const center = allCenters.find((c) => c.id === id);

    if (!center) {
      return NextResponse.json(
        { success: false, error: "مركز الصيانة غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: center });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch center" },
      { status: 500 }
    );
  }
}
