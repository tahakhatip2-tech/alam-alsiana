import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface VaultRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  imei: string;
  deviceModel: string;
  faultDesc: string;
  beforeImageUrl?: string;
  status: "RECEIVED" | "IN_PROGRESS" | "DONE" | "DELIVERED";
  priceJOD?: number;
  date: string;
}

let memoryVault: VaultRecord[] = [
  {
    id: "vlt-001",
    customerName: "محمد العمري",
    customerPhone: "0791112233",
    imei: "352948102938471",
    deviceModel: "Samsung Galaxy A12",
    faultDesc: "جهاز فاصل باور بعد سقوطه بالماء. تم الاتفاق على فحص اللوحة أولاً.",
    status: "IN_PROGRESS",
    priceJOD: 15,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "vlt-002",
    customerName: "خالد الزعبي",
    customerPhone: "0785554433",
    imei: "863920194820192",
    deviceModel: "Xiaomi Redmi Note 11",
    faultDesc: "تغيير شاشة أصلية + تصليح مفتاح البور الجانبي.",
    status: "DONE",
    priceJOD: 28,
    date: new Date(Date.now() - 86400000).toISOString(),
  }
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imei = searchParams.get("imei");
  const id = searchParams.get("id");

  try {
    if (id) {
      // Try DB first
      const foundDB = await prisma.customerVault.findUnique({
        where: { id },
      }).catch(() => null);

      if (foundDB) {
        return NextResponse.json({
          success: true,
          data: {
            id: foundDB.id,
            customerName: foundDB.customerName || "زبون المحل",
            customerPhone: foundDB.customerPhone || "",
            imei: foundDB.imei,
            deviceModel: foundDB.deviceModel,
            faultDesc: foundDB.faultDesc,
            beforeImageUrl: foundDB.beforeImageUrl || "",
            status: foundDB.status,
            priceJOD: foundDB.priceJOD || undefined,
            date: foundDB.date.toISOString(),
          },
        });
      }

      const foundMem = memoryVault.find((item) => item.id === id);
      if (!foundMem) return NextResponse.json({ error: "الجهاز غير موجود" }, { status: 404 });
      return NextResponse.json({ success: true, data: foundMem });
    }

    if (imei) {
      const dbRecords = await prisma.customerVault.findMany({
        where: { imei: { contains: imei.trim(), mode: "insensitive" } },
        orderBy: { date: "desc" },
      }).catch(() => []);

      if (dbRecords.length > 0) {
        const formatted = dbRecords.map((r) => ({
          id: r.id,
          customerName: r.customerName || "زبون المحل",
          customerPhone: r.customerPhone || "",
          imei: r.imei,
          deviceModel: r.deviceModel,
          faultDesc: r.faultDesc,
          beforeImageUrl: r.beforeImageUrl || "",
          status: r.status,
          priceJOD: r.priceJOD || undefined,
          date: r.date.toISOString(),
        }));
        return NextResponse.json({ success: true, count: formatted.length, data: formatted });
      }

      const foundMem = memoryVault.filter((item) =>
        item.imei.toLowerCase().includes(imei.toLowerCase())
      );
      return NextResponse.json({ success: true, count: foundMem.length, data: foundMem });
    }

    // All records: fetch from DB + combine with fallback
    const allDB = await prisma.customerVault.findMany({
      orderBy: { date: "desc" },
    }).catch(() => []);

    if (allDB.length > 0) {
      const formatted = allDB.map((r) => ({
        id: r.id,
        customerName: r.customerName || "زبون المحل",
        customerPhone: r.customerPhone || "",
        imei: r.imei,
        deviceModel: r.deviceModel,
        faultDesc: r.faultDesc,
        beforeImageUrl: r.beforeImageUrl || "",
        status: r.status,
        priceJOD: r.priceJOD || undefined,
        date: r.date.toISOString(),
      }));
      return NextResponse.json({ success: true, count: formatted.length, data: formatted });
    }
  } catch {
    // fallback to memory
  }

  return NextResponse.json({ success: true, count: memoryVault.length, data: memoryVault });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, imei, deviceModel, faultDesc, beforeImageUrl, priceJOD } = body;

    if (!imei || !deviceModel || !faultDesc) {
      return NextResponse.json({ error: "الرجاء تعبئة رقم الـ IMEI والموديل ووصف العطل" }, { status: 400 });
    }

    // Save to live MongoDB Atlas
    try {
      // Find or create default tech user for foreign key relation
      let techUser = await prisma.user.findFirst();
      if (!techUser) {
        techUser = await prisma.user.create({
          data: {
            phone: "0790000000",
            name: "فني عالم الصيانة",
            role: "TECH",
            city: "عمان",
          },
        });
      }

      const created = await prisma.customerVault.create({
        data: {
          techId: techUser.id,
          customerName: customerName || "زبون المحل",
          customerPhone: customerPhone || "",
          imei: imei.trim(),
          deviceModel,
          faultDesc,
          beforeImageUrl: beforeImageUrl || "",
          status: "RECEIVED",
          priceJOD: priceJOD ? Number(priceJOD) : null,
        },
      });

      const resultRecord: VaultRecord = {
        id: created.id,
        customerName: created.customerName || "زبون المحل",
        customerPhone: created.customerPhone || "",
        imei: created.imei,
        deviceModel: created.deviceModel,
        faultDesc: created.faultDesc,
        beforeImageUrl: created.beforeImageUrl || "",
        status: created.status as VaultRecord["status"],
        priceJOD: created.priceJOD || undefined,
        date: created.date.toISOString(),
      };

      memoryVault.unshift(resultRecord);
      return NextResponse.json({ success: true, data: resultRecord }, { status: 201 });
    } catch {
      // In-memory fallback if needed
      const newRecord: VaultRecord = {
        id: `vlt-${Date.now()}`,
        customerName: customerName || "زبون المحل",
        customerPhone: customerPhone || "",
        imei: imei.trim(),
        deviceModel,
        faultDesc,
        beforeImageUrl: beforeImageUrl || "",
        status: "RECEIVED",
        priceJOD: priceJOD ? Number(priceJOD) : undefined,
        date: new Date().toISOString(),
      };
      memoryVault.unshift(newRecord);
      return NextResponse.json({ success: true, data: newRecord }, { status: 201 });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: "فشل حفظ الجهاز في الخزنة", details: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id و status مطلوبان" }, { status: 400 });
    }

    const validStatuses = ["RECEIVED", "IN_PROGRESS", "DONE", "DELIVERED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
    }

    // Try DB update
    try {
      const updated = await prisma.customerVault.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ success: true, data: updated });
    } catch {
      // Memory fallback
      const idx = memoryVault.findIndex((r) => r.id === id);
      if (idx !== -1) {
        memoryVault[idx] = { ...memoryVault[idx], status };
        return NextResponse.json({ success: true, data: memoryVault[idx] });
      }
      return NextResponse.json({ error: "السجل غير موجود" }, { status: 404 });
    }
  } catch (err: unknown) {
    return NextResponse.json({ error: "فشل تحديث الحالة", details: String(err) }, { status: 500 });
  }
}

