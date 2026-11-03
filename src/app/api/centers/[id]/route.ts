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

    let center = allCenters.find((c) => c.id === id);

    if (!center) {
      return NextResponse.json(
        { success: false, error: "مركز الصيانة غير موجود" },
        { status: 404 }
      );
    }

    if (center.id === "center-gardens-pro") {
      center = { ...center, coverImage: "/centers/gardens-cover.jpg", logo: "/centers/gardens-logo.jpg" };
    } else if (center.id === "center-irbid-tech") {
      center = { ...center, coverImage: "/centers/irbid-cover.jpg", logo: "/centers/irbid-logo.jpg" };
    } else if (center.id === "center-sweifieh-elite") {
      center = { ...center, coverImage: "/centers/sweifieh-cover.jpg", logo: "/centers/sweifieh-logo.jpg" };
    } else {
      if (!center.coverImage || center.coverImage.includes("unsplash.com")) {
        center = { ...center, coverImage: "/centers/default-center-cover.jpg" };
      }
      if (!center.logo || center.logo.includes("unsplash.com")) {
        center = { ...center, logo: "/centers/default-center-logo.jpg" };
      }
    }

    return NextResponse.json({ success: true, data: center });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch center" },
      { status: 500 }
    );
  }
}
