import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface UserRecord {
  id: string;
  phone: string;
  name: string;
  role: "TECH" | "TRADER" | "CUSTOMER" | "ADMIN";
  city: string;
  shopName?: string | null;
  passwordHash?: string | null;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __alam_fallback_users: UserRecord[] | undefined;
}

if (!global.__alam_fallback_users) {
  global.__alam_fallback_users = [
    {
      id: "usr-demo-01",
      phone: "0790001122",
      name: "فني معتمد (تجريبي)",
      role: "TECH",
      city: "عمان",
      createdAt: new Date().toISOString(),
    },
    {
      id: "usr-demo-02",
      phone: "0780003344",
      name: "مستخدم تجريبي",
      role: "CUSTOMER",
      city: "إربد",
      createdAt: new Date().toISOString(),
    },
  ];
}

const memoryUsers = global.__alam_fallback_users;

// Quick helper to prevent DB timeouts from hanging the user response
function withTimeout<T>(promise: Promise<T>, ms = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Database connection timeout")), ms)
    ),
  ]);
}

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
      let user: any = null;

      try {
        user = await withTimeout(
          prisma.user.findUnique({
            where: { phone: cleanPhone },
          }),
          2000
        );
      } catch {
        // DB offline/timeout -> fallback to memory
      }

      if (!user) {
        user = memoryUsers.find((u) => u.phone === cleanPhone);
      }

      if (!user) {
        return NextResponse.json(
          { error: "رقم الهاتف غير مسجل، يرجى إنشاء حساب جديد" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          city: user.city || "عمان",
          shopName: user.shopName || null,
        },
      });
    }

    // ─── REGISTER ACTION ─────────────────────────────────────────────────────
    if (action === "register") {
      if (!name) {
        return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
      }

      const assignedRole = role === "TRADER" ? "TRADER" : role === "CUSTOMER" ? "CUSTOMER" : "TECH";
      let existingUser: any = null;

      try {
        existingUser = await withTimeout(
          prisma.user.findUnique({
            where: { phone: cleanPhone },
          }),
          2000
        );
      } catch {
        // DB offline/timeout -> check memory
      }

      if (!existingUser) {
        existingUser = memoryUsers.find((u) => u.phone === cleanPhone);
      }

      if (existingUser) {
        return NextResponse.json(
          { error: "رقم الهاتف مسجل مسبقاً، يمكنك تسجيل الدخول مباشرة" },
          { status: 400 }
        );
      }

      let createdUser: any = null;

      try {
        createdUser = await withTimeout(
          prisma.user.create({
            data: {
              phone: cleanPhone,
              name: name.trim(),
              role: assignedRole,
              city: city || "عمان",
              shopName: shopName ? shopName.trim() : null,
              passwordHash: password || null,
            },
          }),
          2000
        );
      } catch {
        // Fallback store
      }

      if (!createdUser) {
        createdUser = {
          id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          phone: cleanPhone,
          name: name.trim(),
          role: assignedRole,
          city: city || "عمان",
          shopName: shopName ? shopName.trim() : null,
          passwordHash: password || null,
          createdAt: new Date().toISOString(),
        };
        memoryUsers.push(createdUser);
      }

      return NextResponse.json(
        {
          success: true,
          user: {
            id: createdUser.id,
            phone: createdUser.phone,
            name: createdUser.name,
            role: createdUser.role,
            city: createdUser.city,
            shopName: createdUser.shopName || null,
          },
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "حدث خطأ في الخادم", details: String(err) },
      { status: 500 }
    );
  }
}
