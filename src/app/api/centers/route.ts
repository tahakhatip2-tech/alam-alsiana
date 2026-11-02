import { NextResponse } from "next/server";
import { INITIAL_MAINTENANCE_CENTERS, MaintenanceCenter } from "@/lib/centers-data";

declare global {
  var __alam_centers: MaintenanceCenter[] | undefined;
}

if (!global.__alam_centers) {
  global.__alam_centers = [...INITIAL_MAINTENANCE_CENTERS];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const q = searchParams.get("q");

    let list = global.__alam_centers || INITIAL_MAINTENANCE_CENTERS;

    if (city && city !== "الكل") {
      list = list.filter((c) => c.city.includes(city));
    }

    if (q) {
      const query = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.ownerName.toLowerCase().includes(query) ||
          c.area.toLowerCase().includes(query) ||
          c.specialties.some((s) => s.toLowerCase().includes(query)) ||
          c.bio.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch centers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.phone || !body.city) {
      return NextResponse.json(
        { success: false, error: "اسم المركز ورقم الهاتف والمدينة حقول مطلوبة" },
        { status: 400 }
      );
    }

    const newCenter: MaintenanceCenter = {
      id: `center-${Date.now()}`,
      name: body.name,
      ownerName: body.ownerName || "فني معتمد",
      leadTechTitle: body.leadTechTitle || "أخصائي صيانة أجهزة ذكية",
      logo:
        body.logo ||
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80",
      coverImage:
        body.coverImage ||
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
      city: body.city,
      area: body.area || body.city,
      address: body.address || `${body.city} - الشارع الرئيسي`,
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      rating: 5.0,
      reviewCount: 1,
      isVerified: true,
      isOpenNow: true,
      workingHours: body.workingHours || "10:00 ص - 10:00 م",
      specialties: body.specialties || ["صيانة عامة", "شاشات", "بطاريات"],
      services: body.services || [
        {
          title: "فحص وتشخيص فوري للأعطال",
          description: "فحص متكامل لدوائر الباور والشحن والشاشة",
          priceStartingFrom: 5,
          estimatedTime: "فوري",
        },
      ],
      features: body.features || [
        "كفالة رسمية على الإصلاح",
        "قطع أصلية مكفولة",
        "سند استلام موثق",
      ],
      availableStockSnippet: {
        phonesForSaleCount: Number(body.phonesCount) || 3,
        boardsCount: Number(body.boardsCount) || 5,
      },
      googleMapsUrl: body.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(body.name + " " + body.city)}`,
      bio: body.bio || "مركز صيانة متكامل يقدم حلول صيانة الهواتف المتقدمة والقطع الأصلية.",
    };

    if (!global.__alam_centers) {
      global.__alam_centers = [...INITIAL_MAINTENANCE_CENTERS];
    }
    global.__alam_centers.unshift(newCenter);

    return NextResponse.json({ success: true, data: newCenter });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to add center" },
      { status: 500 }
    );
  }
}
