import { NextRequest, NextResponse } from "next/server";
import { FAULTS_DATABASE, FaultItem } from "@/lib/faults-data";
import { INITIAL_BOARDS_CONFIG, BoardModelConfig, BoardTrack } from "@/lib/schematic-data";

// In-memory state for admin modifications during development
let memoryFaults: FaultItem[] = [...FAULTS_DATABASE];
let memoryBoards: BoardModelConfig[] = [...INITIAL_BOARDS_CONFIG];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const resource = searchParams.get("resource"); // "faults" | "boards" | "stats"

  if (resource === "boards") {
    return NextResponse.json({ success: true, count: memoryBoards.length, data: memoryBoards });
  }

  if (resource === "stats") {
    return NextResponse.json({
      success: true,
      data: {
        totalFaults: memoryFaults.length,
        totalBoards: memoryBoards.length,
        totalTracks: memoryBoards.reduce((acc, b) => acc + b.tracks.length, 0),
        brands: Array.from(new Set(memoryFaults.map((f) => f.brand))),
      }
    });
  }

  // Default: return faults
  return NextResponse.json({ success: true, count: memoryFaults.length, data: memoryFaults });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, resource } = body;

    // 1. MANAGE FAULTS (الباب الأول: الدكتور الذكي)
    if (resource === "faults") {
      if (action === "create") {
        const { brand, model, powerDraw, diagnosisAr, faultyComponent, testPoint, successRate, fixPriceJOD, tags } = body;
        if (!model || !powerDraw || !diagnosisAr) {
          return NextResponse.json({ error: "الرجاء ملء الموديل وسحبة الباور والتشخيص" }, { status: 400 });
        }

        const newFault: FaultItem = {
          id: `f-adm-${Date.now()}`,
          brand: brand || "Samsung",
          model,
          powerDraw,
          diagnosisAr,
          faultyComponent: faultyComponent || "غير محدد",
          testPoint: testPoint || "فحص الممانعات حول الآيسي",
          successRate: Number(successRate) || 85,
          fixPriceJOD: Number(fixPriceJOD) || 12,
          tags: Array.isArray(tags) ? tags : ["hardware", "admin"]
        };

        memoryFaults.unshift(newFault);
        return NextResponse.json({ success: true, data: newFault }, { status: 201 });
      }

      if (action === "update") {
        const { id, updates } = body;
        const index = memoryFaults.findIndex((f) => f.id === id);
        if (index === -1) {
          return NextResponse.json({ error: "العطل غير موجود" }, { status: 404 });
        }

        memoryFaults[index] = { ...memoryFaults[index], ...updates };
        return NextResponse.json({ success: true, data: memoryFaults[index] });
      }

      if (action === "delete") {
        const { id } = body;
        memoryFaults = memoryFaults.filter((f) => f.id !== id);
        return NextResponse.json({ success: true, message: "تم حذف العطل بنجاح" });
      }
    }

    // 2. MANAGE SCHEMATICS (الباب الثاني: عارض اللوحات وتتبع المسارات)
    if (resource === "boards") {
      if (action === "create_board") {
        const { id, name, brand, image } = body;
        if (!id || !name || !image) {
          return NextResponse.json({ error: "الرجاء تعبئة اسم الموديل ومعرفه ورابط صورة اللوحة" }, { status: 400 });
        }

        const newBoard: BoardModelConfig = {
          id: id.toLowerCase().replace(/\s+/g, "-"),
          name,
          brand: brand || "Samsung",
          image,
          tracks: []
        };

        memoryBoards.push(newBoard);
        return NextResponse.json({ success: true, data: newBoard }, { status: 201 });
      }

      if (action === "add_track") {
        const { boardId, name, net, voltage, color, pathD, startLabel, startX, startY, endLabel, endX, endY } = body;
        const board = memoryBoards.find((b) => b.id === boardId);
        if (!board) {
          return NextResponse.json({ error: "اللوحة غير موجودة" }, { status: 404 });
        }

        const newTrack: BoardTrack = {
          id: `tr-${Date.now()}`,
          name: name || "مسار جديد",
          net: net || "VBUS_NET",
          voltage: voltage || "5.0V",
          color: color || "#EF4444",
          pathD: pathD || "M 150 500 L 150 300 L 300 300",
          startPoint: {
            label: startLabel || "نقطة البداية",
            x: Number(startX) || 150,
            y: Number(startY) || 500
          },
          endPoint: {
            label: endLabel || "نقطة النهاية",
            x: Number(endX) || 300,
            y: Number(endY) || 300
          }
        };

        board.tracks.push(newTrack);
        return NextResponse.json({ success: true, data: newTrack }, { status: 201 });
      }

      if (action === "delete_track") {
        const { boardId, trackId } = body;
        const board = memoryBoards.find((b) => b.id === boardId);
        if (board) {
          board.tracks = board.tracks.filter((t) => t.id !== trackId);
          return NextResponse.json({ success: true, message: "تم حذف المسار بنجاح" });
        }
      }

      if (action === "delete_board") {
        const { boardId } = body;
        memoryBoards = memoryBoards.filter((b) => b.id !== boardId);
        return NextResponse.json({ success: true, message: "تم حذف اللوحة بنجاح" });
      }
    }

    return NextResponse.json({ error: "طلب غير معروف" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json({ error: "فشل الإجراء", details: String(err) }, { status: 500 });
  }
}
