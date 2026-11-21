// ─────────────────────────────────────────────────────────────
//  Software / Firmware Database
//  عالم الصيانة — قاعدة بيانات السوفتوير والفلاشات
// ─────────────────────────────────────────────────────────────

export interface ModelPackageFile {
  id: string;
  name: string;             // e.g. "الفلاشة الرسمية الكاملة (4 ملفات)"
  fileName: string;         // e.g. "A125FXXU6EXC1_OJO_4Files.zip"
  category: "rom" | "tool" | "pit" | "driver" | "fix";
  fileSize: string;         // "3.8 GB", "3.2 MB", "120 KB"
  downloadUrl: string;      // Direct or official link
  description?: string;     // e.g. "تشمل ملفات AP, BL, CP, CSC لإعادة التهيئة الكاملة"
  isEssential?: boolean;
}

export interface SoftwareVersion {
  id: string;
  versionName: string;       // "Android 14 / One UI 6.1"
  buildNumber?: string;      // "A125FXXU6EXC1"
  region?: string;           // "Middle East / Jordan"
  fileSize?: string;         // "4.2 GB"
  downloadUrl?: string;      // official link or undefined
  method: "odin" | "fastboot" | "miui" | "apple" | "recovery" | "sp-flash" | "other";
  flashTool?: string;        // "Odin 3.14.4"
  instructions: string[];    // step-by-step in Arabic
  requirements?: string[];
  notes?: string;
  isLatest?: boolean;
  isStable?: boolean;
  tags?: string[];
  packageFiles?: ModelPackageFile[];
}

export interface SoftwareEntry {
  id: string;
  brand: string;
  name: string;              // "Samsung Galaxy A12"
  modelNumber?: string;      // "SM-A125F"
  chipset: string;
  year: number;
  versions: SoftwareVersion[];
  tags?: string[];
}

// ─── Helper: build number URL for Samsung ───────────────────
const SAMMOBILE = "https://www.sammobile.com/samsung/firmware/";
const SAMFW = "https://samfw.com/firmware/";

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────
export const SOFTWARE_DATABASE: SoftwareEntry[] = [

  // ═══════════════════════════════════════════════
  //  SAMSUNG
  // ═══════════════════════════════════════════════

  {
    id: "samsung-a12",
    brand: "Samsung",
    name: "Samsung Galaxy A12",
    modelNumber: "SM-A125F",
    chipset: "MediaTek MT6765 Helio P35",
    year: 2020,
    tags: ["شائع", "أوبن-لاين"],
    versions: [
      {
        id: "a12-a13-latest",
        versionName: "Android 12 / One UI Core 4.1",
        buildNumber: "A125FXXU6EXC1",
        region: "الشرق الأوسط / الأردن (OJO)",
        fileSize: "3.8 GB",
        downloadUrl: `${SAMFW}SM-A125F/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "مستقر"],
        requirements: [
          "تفعيل وضع المطور Developer Options",
          "تفعيل USB Debugging",
          "بطارية لا تقل عن 50%",
          "تحميل Odin 3.14.4 على الكمبيوتر",
          "تثبيت Samsung USB Drivers",
        ],
        instructions: [
          "أوقف تشغيل الجهاز تماماً",
          "ادخل وضع Download Mode: اضغط مع الاستمرار (Volume Down + Volume Up) ثم وصّل كابل USB للكمبيوتر",
          "اضغط Volume Up للتأكيد عند ظهور شاشة التحذير",
          "افتح برنامج Odin على الكمبيوتر — ستظهر ID:COM باللون الأزرق",
          'اضغط على AP ثم اختر ملف الفلاش (.tar.md5) الذي قمت بتحميله',
          "تأكد أن Re-Partition غير مفعّل (Auto Reboot يمكن تركه مفعلاً)",
          'اضغط Start وانتظر — لا تفصل الكابل أثناء الفلاش',
          'سيعيد الجهاز التشغيل تلقائياً وتظهر شاشة PASS باللون الأخضر في Odin',
          "أول تشغيل بعد الفلاش قد يستغرق 3-5 دقائق — لا تقاطعه",
        ],
        notes: "إذا ظهر FAIL في Odin، تأكد من صحة الملف وسلامة كابل USB. جرب منفذ USB 2.0 بدلاً من 3.0",
      },
      {
        id: "a12-android11",
        versionName: "Android 11 / One UI Core 3.1",
        buildNumber: "A125FXXU4BUH1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "3.1 GB",
        downloadUrl: `${SAMFW}SM-A125F/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: false,
        isStable: true,
        tags: ["قديم", "مستقر"],
        requirements: [
          "تفعيل USB Debugging",
          "بطارية لا تقل عن 40%",
          "Odin 3.14.4",
          "Samsung USB Drivers",
        ],
        instructions: [
          "أوقف تشغيل الجهاز",
          "ادخل Download Mode (Volume Down + Volume Up + USB)",
          "افتح Odin وتأكد من ظهور ID:COM",
          "حمّل ملف الفلاش في خانة AP",
          "اضغط Start وانتظر اكتمال العملية",
          "الجهاز سيُعيد التشغيل تلقائياً",
        ],
      },
    ],
  },

  {
    id: "samsung-a32",
    brand: "Samsung",
    name: "Samsung Galaxy A32",
    modelNumber: "SM-A325F",
    chipset: "MediaTek MT6769V Helio G80",
    year: 2021,
    tags: ["شائع", "4G"],
    versions: [
      {
        id: "a32-android13",
        versionName: "Android 13 / One UI 5.1",
        buildNumber: "A325FXXS6EXB1",
        region: "الشرق الأوسط / الأردن (OJO)",
        fileSize: "4.1 GB",
        downloadUrl: `${SAMFW}SM-A325F/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "مستقر"],
        requirements: [
          "USB Debugging مفعّل",
          "بطارية ≥ 50%",
          "Odin 3.14.4",
          "Samsung USB Drivers",
        ],
        instructions: [
          "أوقف الجهاز تماماً",
          "ادخل Download Mode: (Volume Down + Volume Up) ثم وصّل USB",
          "اضغط Volume Up للموافقة على التحذير",
          "افتح Odin — تأكد من ظهور ID:COM بالأزرق",
          "اضغط AP واختر ملف الفرمتة",
          "اضغط Start ولا تقاطع العملية",
          "بعد انتهاء الفلاش، الجهاز يُعيد التشغيل — أول بوت أطول من المعتاد",
        ],
        notes: "الفلاش يمحو جميع البيانات، احتفظ بنسخة احتياطية مسبقاً",
      },
      {
        id: "a32-android12",
        versionName: "Android 12 / One UI 4.1",
        buildNumber: "A325FXXS4CVG1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "3.6 GB",
        downloadUrl: `${SAMFW}SM-A325F/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: false,
        isStable: true,
        tags: ["مستقر"],
        requirements: ["USB Debugging", "بطارية ≥ 40%", "Odin 3.14.4"],
        instructions: [
          "أوقف الجهاز وادخل Download Mode",
          "افتح Odin وحمّل ملف AP",
          "اضغط Start وانتظر إعادة التشغيل",
        ],
      },
    ],
  },

  {
    id: "samsung-a23",
    brand: "Samsung",
    name: "Samsung Galaxy A23",
    modelNumber: "SM-A235F",
    chipset: "Qualcomm Snapdragon 680",
    year: 2022,
    tags: ["4G", "Snapdragon"],
    versions: [
      {
        id: "a23-android13",
        versionName: "Android 13 / One UI 5.1",
        buildNumber: "A235FXXU4CXB1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "4.0 GB",
        downloadUrl: `${SAMFW}SM-A235F/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "مستقر", "Snapdragon"],
        requirements: ["USB Debugging", "بطارية ≥ 50%", "Odin 3.14.4", "Samsung USB Drivers"],
        instructions: [
          "أوقف الجهاز",
          "ادخل Download Mode: Volume Down + Volume Up + USB",
          "افتح Odin وتحقق من ID:COM",
          "حمّل ملف الفلاش في AP",
          "اضغط Start وانتظر",
          "الجهاز يُعيد التشغيل تلقائياً",
        ],
        notes: "يدعم Odin الإصدار 3.13+ لهذا الموديل",
      },
    ],
  },

  {
    id: "samsung-a14",
    brand: "Samsung",
    name: "Samsung Galaxy A14",
    modelNumber: "SM-A145F",
    chipset: "MediaTek MT6769 Helio G80",
    year: 2023,
    tags: ["شائع", "4G", "2023"],
    versions: [
      {
        id: "a14-android14",
        versionName: "Android 14 / One UI 6.0",
        buildNumber: "A145FXXU5EXC1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "4.3 GB",
        downloadUrl: `${SAMFW}SM-A145F/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "Android 14"],
        requirements: ["USB Debugging", "بطارية ≥ 50%", "Odin 3.14.4"],
        instructions: [
          "أوقف الجهاز تماماً",
          "ادخل Download Mode: Volume Down + Volume Up + USB",
          "افتح Odin — تأكد من ID:COM",
          "حمّل الفلاش في AP",
          "اضغط Start ولا تقاطع",
          "الجهاز يُعيد التشغيل — أول تشغيل 3-5 دقائق",
        ],
      },
      {
        id: "a14-android13",
        versionName: "Android 13 / One UI 5.1",
        buildNumber: "A145FXXU2BWK1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "3.7 GB",
        downloadUrl: `${SAMFW}SM-A145F/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: false,
        isStable: true,
        tags: ["مستقر"],
        requirements: ["USB Debugging", "بطارية ≥ 40%", "Odin 3.14.4"],
        instructions: [
          "أوقف الجهاز وادخل Download Mode",
          "افتح Odin وحمّل ملف AP",
          "اضغط Start وانتظر إعادة التشغيل",
        ],
      },
    ],
  },

  {
    id: "samsung-a22",
    brand: "Samsung",
    name: "Samsung Galaxy A22",
    modelNumber: "SM-A225F",
    chipset: "MediaTek MT6769V Helio G80",
    year: 2021,
    tags: ["4G", "شائع"],
    versions: [
      {
        id: "a22-android13",
        versionName: "Android 13 / One UI 5.1",
        buildNumber: "A225FXXS5EXB1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "3.9 GB",
        downloadUrl: `${SAMFW}SM-A225F/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "مستقر"],
        requirements: ["USB Debugging", "بطارية ≥ 50%", "Odin 3.14.4"],
        instructions: [
          "أوقف الجهاز",
          "ادخل Download Mode (Volume Down + Volume Up + USB)",
          "افتح Odin وتحقق من ID:COM",
          "حمّل الفلاش في AP",
          "اضغط Start وانتظر إعادة التشغيل",
        ],
      },
    ],
  },

  {
    id: "samsung-a53",
    brand: "Samsung",
    name: "Samsung Galaxy A53 5G",
    modelNumber: "SM-A536E",
    chipset: "Exynos 1280",
    year: 2022,
    tags: ["5G", "Exynos"],
    versions: [
      {
        id: "a53-android14",
        versionName: "Android 14 / One UI 6.1",
        buildNumber: "A536EXXS8EXC1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "4.6 GB",
        downloadUrl: `${SAMFW}SM-A536E/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "Android 14", "5G"],
        requirements: ["USB Debugging", "بطارية ≥ 50%", "Odin 3.14.4"],
        instructions: [
          "أوقف الجهاز تماماً",
          "ادخل Download Mode: Volume Down + Volume Up + USB",
          "افتح Odin وتأكد من ID:COM",
          "حمّل الملف في AP",
          "اضغط Start ولا تقاطع",
          "الجهاز يُعيد التشغيل — أول تشغيل 3-5 دقائق",
        ],
      },
    ],
  },

  {
    id: "samsung-a34",
    brand: "Samsung",
    name: "Samsung Galaxy A34 5G",
    modelNumber: "SM-A346E",
    chipset: "MediaTek Dimensity 1080",
    year: 2023,
    tags: ["5G", "2023", "Dimensity"],
    versions: [
      {
        id: "a34-android14",
        versionName: "Android 14 / One UI 6.1",
        buildNumber: "A346EXXS5EXC1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "4.8 GB",
        downloadUrl: `${SAMFW}SM-A346E/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "Android 14", "5G"],
        requirements: ["USB Debugging", "بطارية ≥ 50%", "Odin 3.14.4"],
        instructions: [
          "أوقف الجهاز",
          "ادخل Download Mode (Volume Down + Volume Up + USB)",
          "افتح Odin وتحقق من ID:COM",
          "حمّل الفلاش في AP",
          "اضغط Start وانتظر إعادة التشغيل",
        ],
      },
    ],
  },

  {
    id: "samsung-a54",
    brand: "Samsung",
    name: "Samsung Galaxy A54 5G",
    modelNumber: "SM-A546E",
    chipset: "Exynos 1380",
    year: 2023,
    tags: ["5G", "2023", "Exynos"],
    versions: [
      {
        id: "a54-android14",
        versionName: "Android 14 / One UI 6.1",
        buildNumber: "A546EXXS5EXC1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "4.9 GB",
        downloadUrl: `${SAMFW}SM-A546E/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "Android 14", "5G"],
        requirements: ["USB Debugging", "بطارية ≥ 50%", "Odin 3.14.4"],
        instructions: [
          "أوقف الجهاز تماماً",
          "ادخل Download Mode: Volume Down + Volume Up + USB",
          "افتح Odin وتأكد من ID:COM",
          "حمّل الملف في AP",
          "اضغط Start ولا تقاطع",
          "الجهاز يُعيد التشغيل — أول تشغيل 3-5 دقائق",
        ],
      },
    ],
  },

  {
    id: "samsung-s23ultra",
    brand: "Samsung",
    name: "Samsung Galaxy S23 Ultra",
    modelNumber: "SM-S918B",
    chipset: "Qualcomm Snapdragon 8 Gen 2",
    year: 2023,
    tags: ["فلاجشيب", "5G", "Snapdragon", "S-Series"],
    versions: [
      {
        id: "s23u-android14",
        versionName: "Android 14 / One UI 6.1",
        buildNumber: "S918BXXS4EXC1",
        region: "الشرق الأوسط (OJO)",
        fileSize: "5.2 GB",
        downloadUrl: `${SAMFW}SM-S918B/OJO`,
        method: "odin",
        flashTool: "Odin 3.14.4",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "فلاجشيب", "Android 14"],
        requirements: [
          "USB Debugging مفعّل",
          "OEM Unlocking مفعّل في Developer Options",
          "بطارية ≥ 60%",
          "Odin 3.14.4",
          "Samsung USB Drivers",
        ],
        instructions: [
          "أوقف الجهاز تماماً",
          "ادخل Download Mode: Volume Down + Volume Up + USB",
          "في شاشة التحذير اضغط Volume Up للمتابعة",
          "افتح Odin وتأكد من ظهور ID:COM بالأزرق",
          "اضغط AP وحمّل ملف الفرمتة",
          "لا تعدّل أي إعداد آخر في Odin",
          "اضغط Start وانتظر إعادة التشغيل",
          "أول بوت قد يستغرق 5-7 دقائق — طبيعي جداً",
        ],
        notes: "الفلاجشيب يحتاج OEM Unlocking مفعّلاً مسبقاً وإلا سيفشل الفلاش",
      },
    ],
  },

  // ═══════════════════════════════════════════════
  //  APPLE
  // ═══════════════════════════════════════════════

  {
    id: "apple-iphone13",
    brand: "Apple",
    name: "iPhone 13",
    modelNumber: "A2633",
    chipset: "Apple A15 Bionic",
    year: 2021,
    tags: ["iOS", "شائع"],
    versions: [
      {
        id: "iphone13-ios17",
        versionName: "iOS 17.4.1",
        buildNumber: "21E236",
        region: "عالمي",
        fileSize: "6.9 GB",
        downloadUrl: "https://ipsw.me/iPhone14,5",
        method: "apple",
        flashTool: "iTunes / Finder (macOS)",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "iOS 17"],
        requirements: [
          "كمبيوتر Windows أو Mac",
          "iTunes (Windows) أو Finder (macOS Catalina+)",
          "كابل USB أصلي من Apple",
          "بطارية ≥ 50%",
          "نسخة احتياطية iCloud أو iTunes",
        ],
        instructions: [
          "احتفظ بنسخة احتياطية كاملة على iCloud أو iTunes/Finder",
          "افتح iTunes على Windows أو Finder على Mac",
          "وصّل الآيفون بالكابل الأصلي وثق بالكمبيوتر",
          "اضغط على أيقونة الجهاز في iTunes/Finder",
          'اضغط "تحديث" للتحديث مع الاحتفاظ بالبيانات، أو "استعادة" للفرمتة الكاملة',
          "انتظر التحميل التلقائي والتثبيت",
          "بعد الانتهاء الجهاز يُعيد التشغيل تلقائياً",
        ],
        notes: "وضع Recovery يُدخَل بـ: (Volume Up → Volume Down → Power طويل). DFU Mode: نفس الخطوات لكن انتظر 8 ثوانٍ ثم أفلت Power مع استمرار Home/Volume Down",
      },
      {
        id: "iphone13-ios16",
        versionName: "iOS 16.7.8",
        buildNumber: "20H343",
        region: "عالمي",
        fileSize: "5.8 GB",
        downloadUrl: "https://ipsw.me/iPhone14,5",
        method: "apple",
        flashTool: "iTunes / Finder",
        isLatest: false,
        isStable: true,
        tags: ["iOS 16", "مستقر"],
        requirements: ["iTunes أو Finder", "كابل أصلي", "بطارية ≥ 40%"],
        instructions: [
          "احتفظ بنسخة احتياطية",
          "افتح iTunes/Finder ووصّل الجهاز",
          "اختر الملف IPSW يدوياً (Shift+Click على تحديث في Windows)",
          "انتظر اكتمال التثبيت",
        ],
      },
    ],
  },

  {
    id: "apple-iphone12",
    brand: "Apple",
    name: "iPhone 12",
    modelNumber: "A2403",
    chipset: "Apple A14 Bionic",
    year: 2020,
    tags: ["iOS", "شائع"],
    versions: [
      {
        id: "iphone12-ios17",
        versionName: "iOS 17.4.1",
        buildNumber: "21E236",
        region: "عالمي",
        fileSize: "6.7 GB",
        downloadUrl: "https://ipsw.me/iPhone13,2",
        method: "apple",
        flashTool: "iTunes / Finder",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "iOS 17"],
        requirements: ["iTunes أو Finder", "كابل USB أصلي", "بطارية ≥ 50%"],
        instructions: [
          "احتفظ بنسخة احتياطية iCloud",
          "افتح iTunes/Finder",
          "وصّل الآيفون وثق بالكمبيوتر",
          "اضغط تحديث أو استعادة حسب الحاجة",
          "انتظر اكتمال التثبيت",
        ],
        notes: "Recovery Mode: Volume Up → Volume Down → Power (طويل). DFU Mode: Volume Up → Volume Down → Power 8 ثانية → أفلت Power → استمر في Volume Down",
      },
    ],
  },

  {
    id: "apple-iphone14",
    brand: "Apple",
    name: "iPhone 14",
    modelNumber: "A2649",
    chipset: "Apple A15 Bionic",
    year: 2022,
    tags: ["iOS", "2022"],
    versions: [
      {
        id: "iphone14-ios17",
        versionName: "iOS 17.4.1",
        buildNumber: "21E236",
        region: "عالمي",
        fileSize: "7.1 GB",
        downloadUrl: "https://ipsw.me/iPhone14,7",
        method: "apple",
        flashTool: "iTunes / Finder",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "iOS 17"],
        requirements: ["iTunes أو Finder", "كابل USB-C أصلي", "بطارية ≥ 50%"],
        instructions: [
          "احتفظ بنسخة احتياطية iCloud أو Finder",
          "افتح iTunes/Finder وصّل الجهاز",
          "ثق بالكمبيوتر على الجهاز",
          "اختر تحديث أو استعادة",
          "انتظر اكتمال التثبيت التلقائي",
        ],
        notes: "iPhone 14 يستخدم كابل USB-C — تأكد من استخدام الكابل الأصلي للحصول على أفضل أداء",
      },
    ],
  },

  // ═══════════════════════════════════════════════
  //  XIAOMI
  // ═══════════════════════════════════════════════

  {
    id: "xiaomi-redmi-note12",
    brand: "Xiaomi",
    name: "Xiaomi Redmi Note 12",
    modelNumber: "23028RA60L",
    chipset: "Qualcomm Snapdragon 685",
    year: 2023,
    tags: ["شائع", "4G", "Snapdragon"],
    versions: [
      {
        id: "note12-miui14",
        versionName: "MIUI 14 / Android 13",
        buildNumber: "V14.0.4.0.TMWMIXM",
        region: "Global / Middle East",
        fileSize: "3.5 GB",
        downloadUrl: "https://c.mi.com/global/miuidownload/index",
        method: "miui",
        flashTool: "MiFlash Tool",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "MIUI 14", "Stabble"],
        requirements: [
          "فتح Bootloader (Mi Unlock Tool)",
          "تحميل MiFlash Tool",
          "تثبيت Xiaomi USB Drivers",
          "بطارية ≥ 50%",
          "الملف بصيغة .tgz أو مجلد مفكوك",
        ],
        instructions: [
          "فتح الـ Bootloader: في Developer Options فعّل OEM Unlocking + Mi Unlock Status",
          "حمّل Mi Unlock Tool وسجّل الدخول بحساب Xiaomi",
          "وصّل الجهاز في Fastboot Mode: اضغط Power + Volume Down",
          "في Mi Unlock اضغط Unlock وانتظر تأكيد فتح الـ Bootloader",
          "بعد فتح الـ Bootloader، افتح MiFlash وحدد مجلد الرومة",
          "اختر 'flash_all' لفرمتة كاملة أو 'flash_all_lock' للحفاظ على البيانات",
          "اضغط Flash وانتظر اكتمال العملية",
          "الجهاز يُعيد التشغيل تلقائياً",
        ],
        notes: "فتح الـ Bootloader يمسح البيانات ويُنبّه: بعض الوظائف مثل Google Pay قد لا تعمل بعد الفتح",
      },
      {
        id: "note12-miui13",
        versionName: "MIUI 13 / Android 12",
        buildNumber: "V13.0.3.0.SMWMIXM",
        region: "Global",
        fileSize: "3.1 GB",
        downloadUrl: "https://c.mi.com/global/miuidownload/index",
        method: "miui",
        flashTool: "MiFlash Tool",
        isLatest: false,
        isStable: true,
        tags: ["MIUI 13", "مستقر"],
        requirements: ["Bootloader مفتوح", "MiFlash Tool", "بطارية ≥ 40%"],
        instructions: [
          "تأكد من فتح Bootloader مسبقاً",
          "افتح MiFlash وحدد مجلد الرومة",
          "اختر نوع الفلاش وأضغط Flash",
          "انتظر إعادة التشغيل",
        ],
      },
    ],
  },

  {
    id: "xiaomi-redmi9",
    brand: "Xiaomi",
    name: "Xiaomi Redmi 9",
    modelNumber: "M2004J19G",
    chipset: "MediaTek MT6769 Helio G80",
    year: 2020,
    tags: ["شائع", "4G", "Helio"],
    versions: [
      {
        id: "redmi9-miui14",
        versionName: "MIUI 14 / Android 11",
        buildNumber: "V14.0.1.0.RJOMIXM",
        region: "Global",
        fileSize: "2.9 GB",
        downloadUrl: "https://c.mi.com/global/miuidownload/index",
        method: "miui",
        flashTool: "MiFlash Tool",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "MIUI 14"],
        requirements: ["Bootloader مفتوح", "MiFlash Tool", "Xiaomi USB Drivers", "بطارية ≥ 50%"],
        instructions: [
          "فتح الـ Bootloader عبر Mi Unlock Tool",
          "ادخل Fastboot Mode: Power + Volume Down",
          "افتح MiFlash وحدد مجلد الرومة",
          "اختر flash_all وأضغط Flash",
          "انتظر إعادة التشغيل التلقائي",
        ],
        notes: "Redmi 9 يستخدم SP Flash Tool أيضاً لفلاش أعمق (Scatter file) إذا لم يستجب Fastboot",
      },
    ],
  },

  {
    id: "xiaomi-redmi-note13",
    brand: "Xiaomi",
    name: "Xiaomi Redmi Note 13",
    modelNumber: "23090RA98G",
    chipset: "Qualcomm Snapdragon 685",
    year: 2024,
    tags: ["2024", "4G", "Snapdragon"],
    versions: [
      {
        id: "note13-hyp",
        versionName: "HyperOS 1.0 / Android 13",
        buildNumber: "OS1.0.3.0.TMWMIXM",
        region: "Global / Middle East",
        fileSize: "3.8 GB",
        downloadUrl: "https://c.mi.com/global/miuidownload/index",
        method: "miui",
        flashTool: "MiFlash Tool",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "HyperOS", "2024"],
        requirements: ["Bootloader مفتوح", "MiFlash Tool", "بطارية ≥ 50%"],
        instructions: [
          "تأكد من فتح Bootloader مسبقاً",
          "ادخل Fastboot Mode: Power + Volume Down",
          "افتح MiFlash وحدد المجلد",
          "اختر flash_all وأضغط Flash",
          "انتظر إعادة التشغيل",
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  //  INFINIX
  // ═══════════════════════════════════════════════

  {
    id: "infinix-hot30",
    brand: "Infinix",
    name: "Infinix Hot 30",
    modelNumber: "X6831",
    chipset: "MediaTek MT6769H Helio G88",
    year: 2023,
    tags: ["شائع", "4G", "2023"],
    versions: [
      {
        id: "hot30-android13",
        versionName: "Android 13 / XOS 13",
        buildNumber: "X6831-H6180TN2MP-X-231101V17",
        region: "Global",
        fileSize: "3.2 GB",
        downloadUrl: "https://www.infinixmobility.com/support/rom",
        method: "sp-flash",
        flashTool: "SP Flash Tool",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "XOS 13"],
        requirements: [
          "SP Flash Tool (MTK)",
          "MediaTek USB Drivers",
          "ملف Scatter",
          "بطارية ≥ 30% أو وصّل الشاحن",
          "تعطيل Driver Signature Enforcement في Windows",
        ],
        instructions: [
          "حمّل SP Flash Tool وثبّت MediaTek USB Drivers",
          "في Windows: Settings → Update → Recovery → Advanced Startup → Disable Driver Signature",
          "افتح SP Flash Tool واختر Download Only أو Firmware Upgrade",
          "اضغط Choose واختر ملف scatter.txt من مجلد الرومة",
          "أوقف الجهاز تماماً (لا تُدخله في أي وضع خاص)",
          "اضغط Download في SP Flash Tool ثم وصّل كابل USB",
          "سيكتشف الجهاز تلقائياً ويبدأ الفلاش",
          "عند ظهور الدائرة الخضراء — اكتمل الفلاش بنجاح",
          "افصل الكابل وأعد التشغيل",
        ],
        notes: "إذا لم يُكتشف الجهاز: جرب منفذ USB 2.0 آخر، وتأكد من تعطيل Driver Signature في Windows",
      },
    ],
  },

  {
    id: "infinix-note30",
    brand: "Infinix",
    name: "Infinix Note 30",
    modelNumber: "X6833B",
    chipset: "MediaTek Helio G99",
    year: 2023,
    tags: ["2023", "Helio G99", "Note"],
    versions: [
      {
        id: "note30-android13",
        versionName: "Android 13 / XOS 13",
        buildNumber: "X6833B-H6181TN2MP-X-231201V15",
        region: "Global",
        fileSize: "3.5 GB",
        downloadUrl: "https://www.infinixmobility.com/support/rom",
        method: "sp-flash",
        flashTool: "SP Flash Tool",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "Helio G99"],
        requirements: ["SP Flash Tool", "MediaTek USB Drivers", "ملف Scatter", "بطارية ≥ 30%"],
        instructions: [
          "حمّل SP Flash Tool وثبّت MediaTek USB Drivers",
          "افتح SP Flash Tool واختر ملف scatter.txt",
          "أوقف الجهاز تماماً",
          "اضغط Download ووصّل كابل USB",
          "انتظر الدائرة الخضراء",
          "أعد تشغيل الجهاز",
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════
  //  TECNO
  // ═══════════════════════════════════════════════

  {
    id: "tecno-spark10",
    brand: "Tecno",
    name: "Tecno Spark 10 Pro",
    modelNumber: "KI7",
    chipset: "MediaTek MT6765 Helio G37",
    year: 2023,
    tags: ["شائع", "4G", "2023"],
    versions: [
      {
        id: "spark10-android13",
        versionName: "Android 13 / HiOS 13",
        buildNumber: "KI7-H6111-M-230901V23",
        region: "Global",
        fileSize: "3.0 GB",
        downloadUrl: "https://www.tecno-mobile.com/support/",
        method: "sp-flash",
        flashTool: "SP Flash Tool",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "HiOS 13"],
        requirements: [
          "SP Flash Tool (MTK)",
          "MediaTek USB Drivers",
          "ملف Scatter",
          "بطارية ≥ 30%",
        ],
        instructions: [
          "حمّل SP Flash Tool وثبّت MTK Drivers",
          "افتح SP Flash Tool واختر ملف scatter.txt",
          "أوقف الجهاز تماماً",
          "اضغط Download ووصّل الكابل",
          "انتظر الدائرة الخضراء للاكتمال",
          "أعد تشغيل الجهاز",
        ],
        notes: "Tecno يشترك مع Infinix في chipset MTK — نفس خطوات SP Flash Tool",
      },
    ],
  },

  {
    id: "tecno-camon20",
    brand: "Tecno",
    name: "Tecno Camon 20",
    modelNumber: "CK6n",
    chipset: "MediaTek Helio G85",
    year: 2023,
    tags: ["2023", "كاميرا", "Helio G85"],
    versions: [
      {
        id: "camon20-android13",
        versionName: "Android 13 / HiOS 13.6",
        buildNumber: "CK6n-H6111-M-231101V18",
        region: "Global",
        fileSize: "3.3 GB",
        downloadUrl: "https://www.tecno-mobile.com/support/",
        method: "sp-flash",
        flashTool: "SP Flash Tool",
        isLatest: true,
        isStable: true,
        tags: ["الأحدث", "كاميرا"],
        requirements: ["SP Flash Tool", "MTK USB Drivers", "ملف Scatter", "بطارية ≥ 30%"],
        instructions: [
          "حمّل SP Flash Tool وثبّت MTK Drivers",
          "افتح SP Flash Tool واختر ملف scatter.txt",
          "أوقف الجهاز",
          "اضغط Download ووصّل الكابل",
          "انتظر الدائرة الخضراء",
          "أعد تشغيل الجهاز",
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

export const SOFTWARE_BRANDS = ["All", "Samsung", "Apple", "Xiaomi", "Infinix", "Tecno"] as const;
export type SoftwareBrand = typeof SOFTWARE_BRANDS[number];

export const METHOD_LABELS: Record<SoftwareVersion["method"], string> = {
  odin: "Odin",
  fastboot: "Fastboot",
  miui: "MiFlash",
  apple: "iTunes / Finder",
  recovery: "Recovery",
  "sp-flash": "SP Flash Tool",
  other: "أداة خاصة",
};

export const METHOD_COLORS: Record<SoftwareVersion["method"], string> = {
  odin: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  fastboot: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  miui: "bg-orange-400/20 text-orange-200 border-orange-400/30",
  apple: "bg-neutral-400/20 text-neutral-200 border-neutral-400/30",
  recovery: "bg-green-500/20 text-green-300 border-green-500/30",
  "sp-flash": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  other: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
};

export function getSoftwareByBrand(brand: string): SoftwareEntry[] {
  if (brand === "All") return SOFTWARE_DATABASE;
  return SOFTWARE_DATABASE.filter((e) => e.brand === brand);
}

export function getSoftwareById(id: string): SoftwareEntry | undefined {
  return SOFTWARE_DATABASE.find((e) => e.id === id);
}

// ─────────────────────────────────────────────────────────────
//  Official Tools & Drivers (الأدوات والتعاريف الرسمية)
// ─────────────────────────────────────────────────────────────

export interface OfficialUtility {
  id: string;
  name: string;
  category: "tool" | "driver";
  brandTarget: string;
  version: string;
  fileSize: string;
  downloadUrl: string;
  description: string;
  badge?: string;
}

export const OFFICIAL_UTILITIES: OfficialUtility[] = [
  // ── الأدوات (Flash Tools) ──
  {
    id: "odin-latest",
    name: "Samsung Odin Flasher",
    category: "tool",
    brandTarget: "Samsung",
    version: "v3.14.4 (Latest)",
    fileSize: "3.2 MB",
    downloadUrl: "https://odindownload.com/download/Odin3_v3.14.4.zip",
    description: "الأداة الرسمية لتفليش هواتف سامسونج عبر منافذ BL, AP, CP, CSC ودعم Android 10 إلى 14.",
    badge: "الأكثر طلباً",
  },
  {
    id: "miflash-tool",
    name: "Xiaomi MiFlash Tool",
    category: "tool",
    brandTarget: "Xiaomi",
    version: "v20200314",
    fileSize: "66.7 MB",
    downloadUrl: "https://xiaomiflashtool.com/download/mi-flash-tool-20200314",
    description: "أداة تفليش رومات شاومي Fastboot لجميع هواتف ريدمي وبوكو وشاومي مع خيارات القفل والفرمتة.",
    badge: "شاومي رسمي",
  },
  {
    id: "sp-flash-tool",
    name: "SP Flash Tool (Smart Phone)",
    category: "tool",
    brandTarget: "MTK / Multi",
    version: "v5.2124",
    fileSize: "58.4 MB",
    downloadUrl: "https://spflashtools.com/download/sp-flash-tool-v5-2124",
    description: "أداة تفليش معالجات ميدياتك MTK الأساسية لأجهزة إنفينيكس وتكنو وشاومي MTK عبر ملفات Scatter.",
    badge: "معالجات MTK",
  },
  {
    id: "3utools-apple",
    name: "3uTools All-In-One",
    category: "tool",
    brandTarget: "Apple",
    version: "v3.05 (2024)",
    fileSize: "115 MB",
    downloadUrl: "https://url.3u.com/zmAJ3faa",
    description: "أداة الفلاش والجيلبريك وفحص قطع الآيفون والبطارية وقراءة تقارير الفحص الأصلية بضغطة زر.",
    badge: "شامل للآيفون",
  },
  {
    id: "qfil-qualcomm",
    name: "QFIL Qualcomm Flash Tool",
    category: "tool",
    brandTarget: "Qualcomm",
    version: "v2.0.3.5",
    fileSize: "28.5 MB",
    downloadUrl: "https://qualcommflashtool.com/download/qfil-v2-0-3-5",
    description: "أداة تفليش معالجات سناب دراجون عبر وضع EDL (9008) لإحياء الهواتف الميتة وفك حماية FRP.",
    badge: "وضع EDL 9008",
  },

  // ── التعاريف (Drivers) ──
  {
    id: "samsung-driver",
    name: "Samsung Android USB Driver",
    category: "driver",
    brandTarget: "Samsung",
    version: "v1.7.59.0 (Official)",
    fileSize: "35.3 MB",
    downloadUrl: "https://developer.samsung.com/android-usb-driver",
    description: "حزمة التعاريف الرسمية من سامسونج للتعرف على وضع Download Mode و ADB بدون أخطاء ID:COM.",
    badge: "رسمي من سامسونج",
  },
  {
    id: "mtk-vcom-driver",
    name: "MediaTek MTK VCOM / Preloader Driver",
    category: "driver",
    brandTarget: "MTK / Multi",
    version: "v1.0.8 (Auto-Installer)",
    fileSize: "12.4 MB",
    downloadUrl: "https://androidmtk.com/download-mtk-usb-all-drivers",
    description: "تعاريف التثبيت التلقائي لمعالجات ميدياتك لتعريف بورت Preloader و BROM لتفليش إنفينيكس وتكنو.",
    badge: "ضروري لـ MTK",
  },
  {
    id: "qualcomm-qdloader-driver",
    name: "Qualcomm HS-USB QDLoader 9008",
    category: "driver",
    brandTarget: "Qualcomm",
    version: "x64 / x86 Official",
    fileSize: "19.8 MB",
    downloadUrl: "https://qualcommflashtool.com/download/qualcomm-usb-driver-v1-0",
    description: "التعريف الأساسي للتعرف على وضع الطوارئ EDL 9008 لهواتف شاومي وسامسونج بمعالجات كوالكوم.",
    badge: "تعريف EDL 9008",
  },
  {
    id: "xiaomi-fastboot-driver",
    name: "Xiaomi Fastboot & ADB Drivers",
    category: "driver",
    brandTarget: "Xiaomi",
    version: "v1.4.3 Installer",
    fileSize: "8.9 MB",
    downloadUrl: "https://xiaomidriver.com/download/xiaomi-usb-driver",
    description: "تعريف أوضاع Fastboot و Recovery لهواتف شاومي وريدمي لتفادي تعليق أداة MiFlash.",
    badge: "تعاريف شاومي",
  },
];

// ─────────────────────────────────────────────────────────────
//  Helper: Get Model Package Files (حزمة الموديل الشاملة)
// ─────────────────────────────────────────────────────────────

export function getModelPackageFiles(entry: SoftwareEntry, version: SoftwareVersion): ModelPackageFile[] {
  if (version.packageFiles && version.packageFiles.length > 0) {
    return version.packageFiles;
  }

  const modelCode = entry.modelNumber || entry.name.replace(/\s+/g, "_");
  const build = version.buildNumber || "LATEST";

  // 1. Samsung Devices
  if (entry.brand === "Samsung") {
    return [
      {
        id: `${entry.id}-rom`,
        category: "rom",
        name: `الفلاشة الرسمية الكاملة (${entry.name})`,
        fileName: `${modelCode}_${build}_OJO_4Files.zip`,
        fileSize: version.fileSize || "4.1 GB",
        downloadUrl: version.downloadUrl || `${SAMFW}${modelCode}/OJO`,
        description: "حزمة الفلاش الكاملة المكونة من 4 ملفات (AP + BL + CP + CSC) لإعادة ضبط المصنع وإحياء الجهاز.",
        isEssential: true,
      },
      {
        id: `${entry.id}-tool`,
        category: "tool",
        name: "برنامج Odin 3.14.4 الرسمي",
        fileName: "Odin3_v3.14.4.zip",
        fileSize: "3.2 MB",
        downloadUrl: "https://odindownload.com/download/Odin3_v3.14.4.zip",
        description: "الأداة المعتمدة لتفليش هذا الموديل مع تفعيل Auto Reboot و F.Reset Time.",
        isEssential: true,
      },
      {
        id: `${entry.id}-pit`,
        category: "pit",
        name: `ملف الـ PIT لإصلاح التقسيم (${modelCode})`,
        fileName: `${modelCode}_Partition.pit`,
        fileSize: "140 KB",
        downloadUrl: version.downloadUrl || `${SAMFW}${modelCode}/OJO`,
        description: "ملف جدول تقسيم الذاكرة (Partition Information Table) لحل مشاكل FAIL وتعليق الشعار والذاكرة التالفة.",
        isEssential: false,
      },
      {
        id: `${entry.id}-driver`,
        category: "driver",
        name: "تعريف Samsung Android USB Driver",
        fileName: "SAMSUNG_USB_Driver_v1.7.59.0.exe",
        fileSize: "35.3 MB",
        downloadUrl: "https://developer.samsung.com/android-usb-driver",
        description: "التعريف الرسمي المعتمد للتعرف الفوري على الهاتف في وضع Download Mode وتجنب انقطاع التفليش.",
        isEssential: true,
      },
    ];
  }

  // 2. Apple Devices
  if (entry.brand === "Apple") {
    return [
      {
        id: `${entry.id}-rom`,
        category: "rom",
        name: `ملف الاستعادة الرسمي IPSW (${version.versionName})`,
        fileName: `${entry.name.replace(/\s+/g, "_")}_${version.buildNumber || "Restore"}.ipsw`,
        fileSize: version.fileSize || "6.8 GB",
        downloadUrl: version.downloadUrl || "https://ipsw.me",
        description: "الفيرموير الرسمي الموقّع من سيرفرات آبل المباشرة (Apple CDN) بدون أي تعديل أو ضغط.",
        isEssential: true,
      },
      {
        id: `${entry.id}-tool`,
        category: "tool",
        name: "برنامج 3uTools الشامل للآيفون",
        fileName: "3uTools_v3.05_Setup.exe",
        fileSize: "115 MB",
        downloadUrl: "https://url.3u.com/zmAJ3faa",
        description: "أداة الفلاش الذكي (Smart Flash) مع خيار الحفاظ على البيانات (Retain User's Data) وفحص قطع الجهاز.",
        isEssential: true,
      },
      {
        id: `${entry.id}-fix`,
        category: "fix",
        name: "أداة الخروج من وضع الريكفري DFU",
        fileName: "Exit_Recovery_DFU_Kit.zip",
        fileSize: "1.8 MB",
        downloadUrl: "https://url.3u.com/zmAJ3faa",
        description: "أداة سريعة بنقرة واحدة لإخراج أجهزة الآيفون العالقة على علامة الكابل أو شعار التفاحة.",
        isEssential: false,
      },
      {
        id: `${entry.id}-driver`,
        category: "driver",
        name: "حزمة تعريفات Apple Mobile Device",
        fileName: "Apple_Mobile_Device_Support.msi",
        fileSize: "48.2 MB",
        downloadUrl: "https://support.apple.com/downloads/itunes",
        description: "تعاريف ويندوز الرسمية للتعرف على الآيفون في أوضاع Normal و Recovery و DFU.",
        isEssential: true,
      },
    ];
  }

  // 3. Xiaomi Devices
  if (entry.brand === "Xiaomi") {
    return [
      {
        id: `${entry.id}-rom`,
        category: "rom",
        name: `روم الفاست بوت الرسمي (${version.versionName})`,
        fileName: `${modelCode}_${build}_Fastboot.tgz`,
        fileSize: version.fileSize || "3.8 GB",
        downloadUrl: version.downloadUrl || "https://c.mi.com/global/miuidownload/index",
        description: "روم الفاست بوت الكامل للتفليش الشامل وحل مشاكل التعليق مع خيارات flash_all.",
        isEssential: true,
      },
      {
        id: `${entry.id}-tool`,
        category: "tool",
        name: "أداة Xiaomi MiFlash Tool",
        fileName: "MiFlash20200314.zip",
        fileSize: "66.7 MB",
        downloadUrl: "https://xiaomiflashtool.com/download/mi-flash-tool-20200314",
        description: "الأداة الرسمية لتفليش رومات شاومي Fastboot مع ميزة القفل التلقائي للبوتلودر.",
        isEssential: true,
      },
      {
        id: `${entry.id}-pit`,
        category: "pit",
        name: "ملفات التقسيم والباتش (Rawprogram/Patch XML)",
        fileName: "rawprogram_unsparse_patch0.xml",
        fileSize: "220 KB",
        downloadUrl: version.downloadUrl || "https://c.mi.com",
        description: "ملفات برمجة الذاكرة لوضع EDL كوالكوم لتفادي موت الجهاز أثناء التفليش.",
        isEssential: false,
      },
      {
        id: `${entry.id}-driver`,
        category: "driver",
        name: "تعاريف شاومي Fastboot & ADB Drivers",
        fileName: "Xiaomi_Fastboot_ADB_Driver.zip",
        fileSize: "8.9 MB",
        downloadUrl: "https://xiaomidriver.com/download/xiaomi-usb-driver",
        description: "التعريف الأساسي لضمان ظهور الجهاز كـ Android Bootloader Interface في إدارة الأجهزة.",
        isEssential: true,
      },
    ];
  }

  // 4. Infinix / Tecno / MTK Devices
  return [
    {
      id: `${entry.id}-rom`,
      category: "rom",
      name: `الروم الرسمي مع ملف الـ Scatter (${entry.name})`,
      fileName: `${modelCode}_${build}_Scatter_Firmware.zip`,
      fileSize: version.fileSize || "3.2 GB",
      downloadUrl: version.downloadUrl || "https://spflashtools.com",
      description: "حزمة السوفتوير الرسمية الشاملة لمعالج ميدياتك مع ملف scatter.txt و preloader.",
      isEssential: true,
    },
    {
      id: `${entry.id}-tool`,
      category: "tool",
      name: "برنامج SP Flash Tool v5.2124",
      fileName: "SP_Flash_Tool_v5.2124_Win.zip",
      fileSize: "58.4 MB",
      downloadUrl: "https://spflashtools.com/download/sp-flash-tool-v5-2124",
      description: "الأداة المعتمدة لتفليش معالجات MTK بخيارات Firmware Upgrade و Download Only.",
      isEssential: true,
    },
    {
      id: `${entry.id}-pit`,
      category: "pit",
      name: "ملف الـ Scatter المعتمد لهذا الإصدار",
      fileName: `${entry.chipset.replace(/\s+/g, '_')}_Android_scatter.txt`,
      fileSize: "85 KB",
      downloadUrl: version.downloadUrl || "https://spflashtools.com",
      description: "خريطة تقسيم ذواكر EMMC/UFS لمعالجات ميدياتك لتحديد عناوين الذاكرة الصحيحة.",
      isEssential: false,
    },
    {
      id: `${entry.id}-driver`,
      category: "driver",
      name: "تعريف MediaTek MTK VCOM Preloader",
      fileName: "MediaTek_MTK_USB_All_Drivers.zip",
      fileSize: "12.4 MB",
      downloadUrl: "https://androidmtk.com/download-mtk-usb-all-drivers",
      description: "التعريف الحيوي لضمان استقرار بورت الـ MTK USB Port وعدم فصل الكابل أثناء الفلاش.",
      isEssential: true,
    },
  ];
}


