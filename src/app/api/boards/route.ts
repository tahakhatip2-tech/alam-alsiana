import { NextRequest, NextResponse } from "next/server";
import {
  INITIAL_BOARDS,
  INITIAL_WANTED_BOARDS,
  INITIAL_PHONES,
  DeadBoardItem,
  WantedBoardItem,
  PhoneListingItem,
} from "@/lib/market-pricing-data";

function normalizeBoard(b: DeadBoardItem): DeadBoardItem {
  if (b.id === "brd-001" || b.boardModel?.includes("A12")) return { ...b, imageUrl: "/boards/board-a12.jpg" };
  if (b.id === "brd-002" || b.boardModel?.includes("Note 11")) return { ...b, imageUrl: "/boards/board-note11.jpg" };
  if (b.id === "brd-003" || b.boardModel?.includes("A32")) return { ...b, imageUrl: "/boards/board-a32.jpg" };
  if (!b.imageUrl || b.imageUrl.includes("unsplash.com")) return { ...b, imageUrl: "/boards/default-board.svg" };
  return b;
}

function normalizePhone(p: PhoneListingItem): PhoneListingItem {
  if (p.id === "ph-001" || p.model?.includes("13 Pro Max")) return { ...p, imageUrl: "/phones/iphone13promax.jpg" };
  if (p.id === "ph-002" || p.model?.includes("S23 Ultra")) return { ...p, imageUrl: "/phones/s23ultra.jpg" };
  if (p.id === "ph-003" || p.model?.includes("Note 13 Pro")) return { ...p, imageUrl: "/phones/redmi-note13.jpg" };
  if (p.id === "ph-004" || p.model?.includes("iPhone 11")) return { ...p, imageUrl: "/phones/iphone11.jpg" };
  if (!p.imageUrl || p.imageUrl.includes("unsplash.com")) return { ...p, imageUrl: "/phones/default-phone.svg" };
  return p;
}

let memoryBoards: DeadBoardItem[] = INITIAL_BOARDS.map(normalizeBoard);
let memoryWanted: WantedBoardItem[] = [...INITIAL_WANTED_BOARDS];
let memoryPhones: PhoneListingItem[] = INITIAL_PHONES.map(normalizePhone);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "wanted", "phones", or undefined
  const city = searchParams.get("city");
  const model = searchParams.get("model");

  if (type === "phones") {
    let phonesList = memoryPhones;
    if (city && city !== "الكل") {
      phonesList = phonesList.filter((p) => p.city.includes(city));
    }
    if (model) {
      phonesList = phonesList.filter((p) =>
        p.title.toLowerCase().includes(model.toLowerCase()) ||
        p.model.toLowerCase().includes(model.toLowerCase())
      );
    }
    return NextResponse.json({ success: true, count: phonesList.length, data: phonesList.map(normalizePhone) });
  }

  if (type === "wanted") {
    let wantedList = memoryWanted;
    if (city && city !== "الكل") {
      wantedList = wantedList.filter((w) => w.requesterCity.includes(city));
    }
    if (model) {
      wantedList = wantedList.filter((w) => w.requestedModel.toLowerCase().includes(model.toLowerCase()));
    }
    return NextResponse.json({ success: true, count: wantedList.length, data: wantedList });
  }

  let result = memoryBoards;
  if (city && city !== "الكل") {
    result = result.filter((b) => b.sellerCity.includes(city));
  }
  if (model) {
    result = result.filter((b) => b.boardModel.toLowerCase().includes(model.toLowerCase()));
  }

  return NextResponse.json({ success: true, count: result.length, data: result.map(normalizeBoard) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if adding to "phones"
    if (body.type === "phone") {
      const {
        title,
        brand,
        model,
        priceJOD,
        city,
        condition,
        battery,
        storage,
        color,
        description,
        imageUrl,
        sellerPhone,
        sellerRole,
      } = body;

      if (!title || !priceJOD || !sellerPhone) {
        return NextResponse.json({ error: "الرجاء تعبئة العنوان والسعر ورقم الهاتف" }, { status: 400 });
      }

      const newPhone: PhoneListingItem = {
        id: `ph-${Date.now()}`,
        title: title.trim(),
        brand: brand || "Apple",
        model: model || title.trim(),
        priceJOD: Number(priceJOD),
        city: city || "عمان",
        condition: condition || "مستعمل نظيف جداً",
        battery: battery ? Number(battery) : undefined,
        storage: storage || "128GB",
        color: color || "أساسي",
        description: description || "هاتف معروض للبيع بحالة ممتازة",
        imageUrl: imageUrl || "/phones/default-phone.svg",
        sellerPhone: sellerPhone.trim(),
        sellerRole: sellerRole || "TECH",
        createdAt: new Date().toISOString(),
      };

      memoryPhones.unshift(newPhone);
      return NextResponse.json({ success: true, data: newPhone }, { status: 201 });
    }

    // Check if adding to "wanted"
    if (body.type === "wanted") {
      const { requesterPhone, requesterCity, requestedModel, requiredPart, budgetJOD, notes } = body;
      if (!requesterPhone || !requestedModel || !budgetJOD) {
        return NextResponse.json({ error: "الرجاء تعبئة الهاتف والموديل والميزانية" }, { status: 400 });
      }

      const newWanted: WantedBoardItem = {
        id: `wnt-${Date.now()}`,
        requesterPhone,
        requesterCity: requesterCity || "عمان",
        requestedModel,
        requiredPart: requiredPart || "بوردة كاملة أو قطع",
        budgetJOD: Number(budgetJOD),
        notes: notes || "",
        createdAt: new Date().toISOString(),
      };

      memoryWanted.unshift(newWanted);
      return NextResponse.json({ success: true, data: newWanted }, { status: 201 });
    }

    const { sellerPhone, sellerCity, boardModel, brand, workingParts, condition, priceJOD, imageUrl } = body;

    if (!sellerPhone || !boardModel || !priceJOD) {
      return NextResponse.json({ error: "بيانات الإعلان غير مكتملة" }, { status: 400 });
    }

    const newBoard: DeadBoardItem = {
      id: `brd-${Date.now()}`,
      sellerPhone,
      sellerCity: sellerCity || "عمان",
      boardModel,
      brand: brand || "أخرى",
      workingParts: Array.isArray(workingParts) ? workingParts : [],
      condition: condition || "لوحة قطع غيار",
      priceJOD: Number(priceJOD),
      imageUrl: imageUrl || "/boards/default-board.svg",
      status: "AVAILABLE",
      commission15: true,
      createdAt: new Date().toISOString(),
    };

    memoryBoards.unshift(newBoard);

    return NextResponse.json({ success: true, data: newBoard }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: "فشل حفظ الإعلان", details: String(err) }, { status: 500 });
  }
}
