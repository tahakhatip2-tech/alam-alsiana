export interface PhoneListingItem {
  id: string;
  title: string;
  brand: string;
  model: string;
  priceJOD: number;
  city: string;
  condition: string;
  battery?: number;
  storage: string;
  color?: string;
  description: string;
  imageUrl: string;
  sellerPhone: string;
  sellerRole?: "TECH" | "TRADER" | "CUSTOMER";
  createdAt: string;
}

export const INITIAL_PHONES: PhoneListingItem[] = [
  {
    id: "ph-001",
    title: "iPhone 13 Pro Max أزرق مميز - بطارية 89%",
    brand: "Apple",
    model: "iPhone 13 Pro Max",
    priceJOD: 460,
    city: "عمان",
    condition: "مستعمل نظيف جداً (وكالة بدون أي خدش)",
    battery: 89,
    storage: "256GB",
    color: "Sierra Blue",
    description: "الجهاز نظيف جداً مفحوص كامل قطع أصلية، بطارية 89% تدوم يوم كامل مع الكرتونة والشاحن الأصلي، قابل للتفاوض البسيط.",
    imageUrl: "/phones/iphone13promax.jpg",
    sellerPhone: "0790112233",
    sellerRole: "TECH",
    createdAt: "2025-05-12T16:00:00Z",
  },
  {
    id: "ph-002",
    title: "Samsung Galaxy S23 Ultra كفالة رسمية - 512GB",
    brand: "Samsung",
    model: "Galaxy S23 Ultra",
    priceJOD: 520,
    city: "إربد",
    condition: "مستعمل كالجديد 99%",
    battery: 98,
    storage: "512GB",
    color: "Phantom Black",
    description: "سامسونج الترا جبار، رام 12 جيجا وذاكرة 512، كاميرا 200 ميجابكسل، خالي من أي ضربات، لقطة لمحبين التصوير والأداء.",
    imageUrl: "/phones/s23ultra.jpg",
    sellerPhone: "0788990011",
    sellerRole: "TRADER",
    createdAt: "2025-05-12T14:20:00Z",
  },
  {
    id: "ph-003",
    title: "Xiaomi Redmi Note 13 Pro 4G جديد بالكرتونة",
    brand: "Xiaomi",
    model: "Redmi Note 13 Pro",
    priceJOD: 165,
    city: "الزرقاء",
    condition: "جديد بالكرتونة بتغليف المصنع",
    battery: 100,
    storage: "256GB",
    color: "Midnight Black",
    description: "جهاز جديد غير مستعمل إطلاقاً مع الكفالة السنوية، شاشة أموليد 120Hz وشحن فائق السرعة 67 واط.",
    imageUrl: "/phones/redmi-note13.jpg",
    sellerPhone: "0771239876",
    sellerRole: "TRADER",
    createdAt: "2025-05-12T11:45:00Z",
  },
  {
    id: "ph-004",
    title: "iPhone 11 أسود 128GB بحالة ممتازة",
    brand: "Apple",
    model: "iPhone 11",
    priceJOD: 195,
    city: "عمان",
    condition: "مستعمل بحالة ممتازة",
    battery: 84,
    storage: "128GB",
    color: "Black",
    description: "آيفون 11 نظيف جداً، كل قطعه فحص كامل بما فيها الفيس آي دي والكاميرات، مع كفر حماية ولاصق شاشة ضد الكسر.",
    imageUrl: "/phones/iphone11.jpg",
    sellerPhone: "0795556677",
    sellerRole: "CUSTOMER",
    createdAt: "2025-05-11T18:10:00Z",
  },
];

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
    imageUrl: "/boards/board-a12.jpg",
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
    imageUrl: "/boards/board-note11.jpg",
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
    imageUrl: "/boards/board-a32.jpg",
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
