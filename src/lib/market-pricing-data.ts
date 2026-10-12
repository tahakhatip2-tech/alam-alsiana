export interface WantedBoardItem {
  id: string;
  requesterPhone: string;
  requesterCity: string;
  requestedModel: string;
  requiredPart: string;
  budgetJOD: number;
  notes: string;
  createdAt: string;
}

export const INITIAL_WANTED_BOARDS: WantedBoardItem[] = [
  {
    id: "wnt-001",
    requesterPhone: "0798889900",
    requesterCity: "عمان",
    requestedModel: "Samsung Galaxy A32 (A325F)",
    requiredPart: "بوردة فيها معالج سليم MTK (الشاشة مكسورة مو مشكلة)",
    budgetJOD: 15,
    notes: "مطلوب بشكل عاجل لزبون بالمحل بوسط البلد",
    createdAt: "2025-05-12T11:00:00Z"
  },
  {
    id: "wnt-002",
    requesterPhone: "0787776655",
    requesterCity: "إربد",
    requestedModel: "Xiaomi Redmi Note 11",
    requiredPart: "آيسي باور كوالكوم PM6225 شغال أو بوردة كاملة",
    budgetJOD: 10,
    notes: "توصيل إربد أو استلام يد بيد",
    createdAt: "2025-05-12T14:30:00Z"
  }
];

export interface DeadBoardItem {
  id: string;
  sellerPhone: string;
  sellerCity: string;
  boardModel: string;
  brand: string;
  workingParts: string[];
  condition: string;
  priceJOD: number;
  imageUrl: string;
  status: "AVAILABLE" | "SOLD" | "RESERVED";
  commission15: boolean;
  createdAt: string;
}

export const INITIAL_BOARDS: DeadBoardItem[] = [
  {
    id: "brd-001",
    sellerPhone: "0791234567",
    sellerCity: "عمان",
    boardModel: "Samsung Galaxy A12 (A125F)",
    brand: "Samsung",
    workingParts: ["آيسي شحن سليم (S2MU106)", "كاميرات خلفية كاملة", "سوكت شحن وكونكترات"],
    condition: "لوحة ميتة (فاصلة معالج MTK)",
    priceJOD: 10,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60",
    status: "AVAILABLE",
    commission15: true,
    createdAt: "2025-05-10T10:00:00Z"
  },
  {
    id: "brd-002",
    sellerPhone: "0788765432",
    sellerCity: "إربد",
    boardModel: "Xiaomi Redmi Note 11",
    brand: "Xiaomi",
    workingParts: ["آيسي باور كوالكوم PM6225", "دارة الشبكة والـ RF سليمة", "سوكت بطارية"],
    condition: "لوحة مكسورة من جهة المعالج",
    priceJOD: 15,
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=60",
    status: "AVAILABLE",
    commission15: true,
    createdAt: "2025-05-11T12:30:00Z"
  },
  {
    id: "brd-003",
    sellerPhone: "0775551234",
    sellerCity: "الزرقاء",
    boardModel: "Samsung Galaxy A32 (A325F)",
    brand: "Samsung",
    workingParts: ["دارة الشحن الفرعية IF PMIC", "بيت السيم سليم", "مقاومات ومكثفات الشاشة"],
    condition: "شورت خط رئيسي بسبب ماء",
    priceJOD: 12,
    imageUrl: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&auto=format&fit=crop&q=60",
    status: "AVAILABLE",
    commission15: true,
    createdAt: "2025-05-12T08:15:00Z"
  }
];

export interface PriceItem {
  id: string;
  model: string;
  brand: string;
  partType: string;
  buyJOD: number;
  sellJOD: number;
  marketAvgJOD: number;
}

export const INITIAL_PRICES: PriceItem[] = [
  { id: "p1", brand: "Samsung", model: "Galaxy A12", partType: "شاشة أصلية وكالة", buyJOD: 13, sellJOD: 20, marketAvgJOD: 22 },
  { id: "p2", brand: "Samsung", model: "Galaxy A12", partType: "آيسي باور S2MU106X01", buyJOD: 3, sellJOD: 10, marketAvgJOD: 12 },
  { id: "p3", brand: "Samsung", model: "Galaxy A12", partType: "فلاتة شحن كاملة", buyJOD: 2, sellJOD: 9, marketAvgJOD: 10 },
  { id: "p4", brand: "Samsung", model: "Galaxy A32", partType: "شاشة أموليد أصلية", buyJOD: 24, sellJOD: 31, marketAvgJOD: 35 },
  { id: "p5", brand: "Samsung", model: "Galaxy A32", partType: "آيسي شحن MT6358W", buyJOD: 4, sellJOD: 11, marketAvgJOD: 14 },
  { id: "p6", brand: "Samsung", model: "Galaxy A23", partType: "شاشة كاملة إطار", buyJOD: 15, sellJOD: 22, marketAvgJOD: 25 },
  { id: "p7", brand: "Samsung", model: "Galaxy A23", partType: "آيسي باور PM6125", buyJOD: 5, sellJOD: 12, marketAvgJOD: 15 },
  { id: "p8", brand: "Xiaomi", model: "Redmi 9", partType: "شاشة كاملة", buyJOD: 11, sellJOD: 18, marketAvgJOD: 20 },
  { id: "p9", brand: "Xiaomi", model: "Redmi 9", partType: "آيسي شحن MT6371P", buyJOD: 3, sellJOD: 10, marketAvgJOD: 12 },
  { id: "p10", brand: "Xiaomi", model: "Redmi Note 11", partType: "شاشة أموليد سوبر", buyJOD: 22, sellJOD: 29, marketAvgJOD: 32 },
  { id: "p11", brand: "Xiaomi", model: "Redmi Note 11", partType: "آيسي باور PM6225", buyJOD: 5, sellJOD: 12, marketAvgJOD: 16 }
];
