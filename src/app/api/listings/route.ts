import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const userId = searchParams.get("userId");

    const whereClause: Record<string, unknown> = {};

    if (category && category !== "ALL") {
      whereClause.category = category;
    }
    if (city && city !== "الكل") {
      whereClause.city = city;
    }
    if (userId) {
      whereClause.userId = userId;
    }

    const listings = await prisma.marketListing.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            shopName: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => []);

    return NextResponse.json({ success: true, count: listings.length, data: listings });
  } catch (err: unknown) {
    return NextResponse.json({ error: "فشل في جلب الإعلانات", details: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      title,
      category,
      brand,
      model,
      priceJOD,
      city,
      description,
      condition,
      battery,
      storage,
      images,
      contactPhone,
      whatsapp,
    } = body;

    if (!title || !priceJOD || !contactPhone) {
      return NextResponse.json({ error: "العنوان، السعر، ورقم الهاتف مطلوبين" }, { status: 400 });
    }

    // Default to first user if userId not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) targetUserId = firstUser.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "يرجى تسجيل الدخول أولاً لإضافة إعلان" }, { status: 401 });
    }

    const created = await prisma.marketListing.create({
      data: {
        userId: targetUserId,
        title: title.trim(),
        category: category || "USED_PHONE",
        brand: brand || "General",
        model: model || "Device",
        priceJOD: Number(priceJOD),
        city: city || "عمان",
        description: description || "لا توجد تفاصيل إضافية",
        condition: condition || "مستعمل بحالة جيدة",
        battery: battery ? Number(battery) : null,
        storage: storage || null,
        images: images || [],
        contactPhone: contactPhone.trim(),
        whatsapp: whatsapp ? whatsapp.trim() : contactPhone.trim(),
        status: "AVAILABLE",
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: "فشل نشر الإعلان", details: String(err) }, { status: 500 });
  }
}
