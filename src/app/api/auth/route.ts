import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, phone, name, role, city, shopName, password } = body;

    if (!phone) {
      return NextResponse.json({ error: "رقم الهاتف مطلوب" }, { status: 400 });
    }

    const cleanPhone = phone.trim().replace(/\s+/g, "");

    // ─── LOGIN ACTION ────────────────────────────────────────────────────────
    if (action === "login") {
      let user = await prisma.user.findUnique({
        where: { phone: cleanPhone },
      }).catch(() => null);

      if (!user) {
        return NextResponse.json({ error: "رقم الهاتف غير مسجل، يرجى إنشاء حساب جديد" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          city: user.city,
          shopName: user.shopName || null,
        },
      });
    }

    // ─── REGISTER ACTION ─────────────────────────────────────────────────────
    if (action === "register") {
      if (!name) {
        return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
      }

      const existing = await prisma.user.findUnique({
        where: { phone: cleanPhone },
      }).catch(() => null);

      if (existing) {
        return NextResponse.json({ error: "رقم الهاتف مسجل مسبقاً، يمكنك تسجيل الدخول" }, { status: 400 });
      }

      const newUser = await prisma.user.create({
        data: {
          phone: cleanPhone,
          name: name.trim(),
          role: role === "TRADER" ? "TRADER" : role === "CUSTOMER" ? "CUSTOMER" : "TECH",
          city: city || "عمان",
          shopName: shopName ? shopName.trim() : null,
          passwordHash: password || null,
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          phone: newUser.phone,
          name: newUser.name,
          role: newUser.role,
          city: newUser.city,
          shopName: newUser.shopName || null,
        },
      }, { status: 201 });
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: "فشل في معالجة طلب المصادقة", details: String(err) }, { status: 500 });
  }
}
