// ─────────────────────────────────────────────────────────────────
//  Test Point Database — قاعدة بيانات نقاط التيست بوينت
//  عالم الصيانة — ربط بين قسم السوفتوير والمخططات
// ─────────────────────────────────────────────────────────────────

export type TestPointMode =
  | "edl_9008"    // Qualcomm Emergency Download Mode
  | "brom"        // MediaTek Boot ROM Mode
  | "download"    // Samsung / Huawei Download Mode
  | "dfu"         // Apple DFU Mode
  | "fastboot";   // Fastboot / Bootloader Mode

export type TestPointMethod =
  | "short_pads"     // قصر نقطتين على البوردة
  | "volume_combo"   // ضغطة مفاتيح
  | "adb_command"    // أمر ADB
  | "test_cable";    // كابل خاص

export interface TestPointPin {
  id: string;
  label: string;           // "TP1" أو "GND"
  x: number;               // موقع X على SVG بوردة (0–100 %)
  y: number;               // موقع Y على SVG بوردة (0–100 %)
  color: string;           // "#EF4444"
  isPrimary?: boolean;     // النقطة الرئيسية (تومض)
  description?: string;    // "وصّل هذه النقطة بـ GND"
}

export interface TestPointEntry {
  id: string;
  brand: string;
  modelName: string;        // "Samsung Galaxy A12"
  modelNumber?: string;     // "SM-A125F"
  chipset: string;          // "MediaTek MT6765"
  softwareId: string;       // يربط بـ SOFTWARE_DATABASE id
  schematicId?: string;     // يربط بـ BOARDS_CONFIG id

  mode: TestPointMode;
  modeLabel: string;        // "وضع EDL 9008"
  method: TestPointMethod;

  // --- Board diagram (SVG viewBox 0 0 300 500) ---
  boardWidth: number;
  boardHeight: number;
  boardColor: string;       // لون البوردة الخلفية "#1a2820"
  pins: TestPointPin[];

  // --- Step-by-step instructions ---
  steps: string[];
  warnings?: string[];
  requiredTools?: string[];

  // --- Extra info ---
  difficulty: "easy" | "medium" | "hard";
  successIndicator: string; // "الكمبيوتر يتعرف على الجهاز كـ Qualcomm 9008"
  notes?: string;
  youtubeSearch?: string;   // كلمات بحث يوتيوب
  tags?: string[];
}

// ─────────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────────
export const TESTPOINT_DATABASE: TestPointEntry[] = [

  // ═══════════════════════════════════════════════════════════════
  //  SAMSUNG — Download Mode (لا يحتاج تيست بوينت في الغالب)
  // ═══════════════════════════════════════════════════════════════

  {
    id: "tp-samsung-a12",
    brand: "Samsung",
    modelName: "Samsung Galaxy A12",
    modelNumber: "SM-A125F",
    chipset: "MediaTek MT6765 Helio P35",
    softwareId: "samsung-a12",
    schematicId: "a12",
    mode: "brom",
    modeLabel: "وضع BROM — Boot ROM (MTK)",
    method: "short_pads",
    boardWidth: 300,
    boardHeight: 500,
    boardColor: "#0f1f15",
    pins: [
      {
        id: "tp1-a12",
        label: "TP_BROM",
        x: 42,
        y: 28,
        color: "#EF4444",
        isPrimary: true,
        description: "نقطة دخول BROM — وصّلها بـ GND قبل توصيل USB",
      },
      {
        id: "gnd-a12",
        label: "GND",
        x: 42,
        y: 72,
        color: "#6B7280",
        isPrimary: false,
        description: "أرضي البوردة — الوجه المعدني لموصل USB Sub-FPC",
      },
    ],
    steps: [
      "افصل البطارية تماماً وأزل أي مصدر طاقة",
      "افتح الجهاز وافصل الشاشة والبطارية",
      "جهّز كابل USB متصل بالكمبيوتر (لا تربطه بعد)",
      "باستخدام ملقط أو سلك رفيع، قصّر النقطة TP_BROM مع أقرب نقطة GND",
      "بينما تقصّر النقطتين، وصّل كابل USB للكمبيوتر",
      "ستسمع صوت تعرف Windows على جهاز جديد",
      "افتح SP Flash Tool — ستظهر COM Port جديدة تلقائياً",
      "أفلت النقطتين بعد ثانيتين من ظهور COM Port",
      "قم بتحميل ملف Scatter ثم اضغط Download لبدء التفليش",
    ],
    warnings: [
      "لا تقصّر نقاط خاطئة — قد يتلف آيسي PMIC",
      "تأكد من إيقاف Driver Signature Enforcement على Windows",
      "استخدم SP Flash Tool المتوافق مع MT6765 (v5.2244 أو أحدث)",
    ],
    requiredTools: ["SP Flash Tool", "MTK USB Driver (VCOM)", "ملف Scatter للموديل"],
    difficulty: "medium",
    successIndicator: "يظهر COM Port جديد في Device Manager ويتعرف عليه SP Flash Tool",
    notes: "بعض نسخ A12 (Exynos) تدعم Download Mode بضغط المفاتيح مباشرة دون تيست بوينت",
    youtubeSearch: "Samsung A12 SM-A125F MTK BROM test point SP Flash Tool",
    tags: ["MTK", "BROM", "SP Flash", "بوردة"],
  },

  {
    id: "tp-samsung-a32",
    brand: "Samsung",
    modelName: "Samsung Galaxy A32",
    modelNumber: "SM-A325F",
    chipset: "MediaTek MT6769V Helio G80",
    softwareId: "samsung-a32",
    mode: "brom",
    modeLabel: "وضع BROM — Boot ROM (MTK Helio G80)",
    method: "short_pads",
    boardWidth: 300,
    boardHeight: 500,
    boardColor: "#0f1f15",
    pins: [
      {
        id: "tp1-a32",
        label: "TP_BROM",
        x: 55,
        y: 22,
        color: "#EF4444",
        isPrimary: true,
        description: "نقطة BROM — الجانب العلوي من البوردة قرب آيسي Helio G80",
      },
      {
        id: "gnd-a32",
        label: "GND",
        x: 55,
        y: 68,
        color: "#6B7280",
        isPrimary: false,
        description: "أقرب نقطة GND لموصل الشاشة",
      },
    ],
    steps: [
      "افصل البطارية والشاشة",
      "جهّز كابل USB للكمبيوتر",
      "قصّر نقطة TP_BROM مع GND باستخدام ملقط دقيق",
      "وصّل USB أثناء تقصير النقطتين",
      "انتظر صوت التعرف على الجهاز في Windows",
      "افتح SP Flash Tool وحمّل Scatter File",
      "اضغط Download واتبع تعليمات التفليش",
    ],
    warnings: [
      "الجهاز يملك تقسيم A/B — تأكد من صحة ملف Scatter",
      "لا تستخدم Odin لتفليش MTK — استخدم SP Flash Tool حصراً",
    ],
    requiredTools: ["SP Flash Tool", "MTK VCOM Driver", "Scatter File SM-A325F"],
    difficulty: "medium",
    successIndicator: "COM Port يظهر في SP Flash Tool بشكل تلقائي",
    youtubeSearch: "Samsung A32 SM-A325F BROM test point SP Flash Tool",
    tags: ["MTK", "BROM", "Helio G80", "بوردة"],
  },

  {
    id: "tp-samsung-a23",
    brand: "Samsung",
    modelName: "Samsung Galaxy A23",
    modelNumber: "SM-A235F",
    chipset: "Qualcomm Snapdragon 680",
    softwareId: "samsung-a23",
    mode: "edl_9008",
    modeLabel: "وضع EDL 9008 — Qualcomm Emergency Download",
    method: "short_pads",
    boardWidth: 300,
    boardHeight: 500,
    boardColor: "#1a0f1f",
    pins: [
      {
        id: "tp1-a23-edl",
        label: "EDL_TP",
        x: 48,
        y: 30,
        color: "#8B5CF6",
        isPrimary: true,
        description: "نقطة EDL — قرب شريحة Snapdragon 680 (SD680) على يمين البوردة",
      },
      {
        id: "gnd-a23",
        label: "GND",
        x: 48,
        y: 70,
        color: "#6B7280",
        isPrimary: false,
        description: "أقرب نقطة أرضي لموصل الشاشة",
      },
    ],
    steps: [
      "أوقف الجهاز وافصل البطارية",
      "حدد نقطة EDL_TP على البوردة بمساعدة المخطط",
      "جهّز كابل USB متصل بالكمبيوتر",
      "قصّر نقطة EDL_TP مع GND",
      "وصّل USB أثناء تقصير النقطتين",
      "ستظهر الجهاز كـ 'Qualcomm HS-USB QDLoader 9008' في Device Manager",
      "افتح QFIL أو أي برنامج Qualcomm Flash وابدأ التفليش",
    ],
    warnings: [
      "وضع EDL 9008 يمحو جميع البيانات",
      "تأكد من تثبيت Qualcomm USB Driver قبل البدء",
      "بعض الأجهزة تحتاج كابل EDL خاص (Chimera / Octoplus)",
    ],
    requiredTools: ["QFIL Flash Tool", "Qualcomm USB Driver", "ملفات الفلاش (.elf / .mbn)"],
    difficulty: "hard",
    successIndicator: "يظهر 'Qualcomm HS-USB QDLoader 9008' في Device Manager",
    notes: "يمكن الدخول لـ EDL 9008 أيضاً عبر ADB: `adb reboot edl` إذا كان ADB مفعّلاً",
    youtubeSearch: "Samsung A23 SM-A235F EDL 9008 test point Qualcomm",
    tags: ["Qualcomm", "EDL", "9008", "Snapdragon 680", "بوردة"],
  },

  {
    id: "tp-samsung-a53",
    brand: "Samsung",
    modelName: "Samsung Galaxy A53 5G",
    modelNumber: "SM-A536B",
    chipset: "Samsung Exynos 1280",
    softwareId: "samsung-a53",
    mode: "download",
    modeLabel: "وضع Download Mode — Odin (مفاتيح فقط)",
    method: "volume_combo",
    boardWidth: 300,
    boardHeight: 500,
    boardColor: "#0f1a1f",
    pins: [
      {
        id: "vol-down-a53",
        label: "Volume Down",
        x: 15,
        y: 50,
        color: "#3B82F6",
        isPrimary: true,
        description: "زر خفض الصوت — الجانب الأيسر للجهاز",
      },
      {
        id: "usb-a53",
        label: "USB Type-C",
        x: 50,
        y: 95,
        color: "#10B981",
        isPrimary: false,
        description: "منفذ USB في الأسفل",
      },
    ],
    steps: [
      "أوقف الجهاز تماماً",
      "اضغط مع الاستمرار على (Volume Down + Volume Up) معاً",
      "بينما تضغط المفاتيح، وصّل كابل USB للكمبيوتر",
      "اضغط Volume Up للموافقة على التحذير",
      "ستدخل Download Mode وتظهر شاشة زرقاء",
      "افتح Odin على الكمبيوتر — ستظهر ID:COM بالأزرق",
      "حمّل ملف الفلاش في خانة AP ثم اضغط Start",
    ],
    warnings: [
      "Exynos A53 لا يحتاج تيست بوينت — ضغطة المفاتيح كافية",
      "لا تفصل USB أثناء التفليش",
    ],
    requiredTools: ["Odin 3.14.4 أو أحدث", "Samsung USB Driver"],
    difficulty: "easy",
    successIndicator: "شاشة Download Mode الزرقاء + ID:COM يظهر في Odin",
    youtubeSearch: "Samsung A53 SM-A536B Download Mode Odin flash",
    tags: ["Exynos", "Odin", "Download Mode", "بدون تيست بوينت"],
  },

  // ═══════════════════════════════════════════════════════════════
  //  XIAOMI — EDL 9008 Qualcomm
  // ═══════════════════════════════════════════════════════════════

  {
    id: "tp-xiaomi-redmi9",
    brand: "Xiaomi",
    modelName: "Xiaomi Redmi 9",
    modelNumber: "M2004J19G",
    chipset: "MediaTek Helio G85",
    softwareId: "xiaomi-redmi9",
    mode: "brom",
    modeLabel: "وضع BROM — Boot ROM (MTK Helio G85)",
    method: "short_pads",
    boardWidth: 300,
    boardHeight: 500,
    boardColor: "#1a0a0a",
    pins: [
      {
        id: "tp1-redmi9-brom",
        label: "TP_BROM",
        x: 60,
        y: 25,
        color: "#EF4444",
        isPrimary: true,
        description: "نقطة BROM — الزاوية العلوية اليمنى قرب آيسي Helio G85",
      },
      {
        id: "gnd-redmi9",
        label: "GND",
        x: 60,
        y: 65,
        color: "#6B7280",
        isPrimary: false,
        description: "نقطة GND — الحافة المعدنية لموصل الكاميرا الخلفية",
      },
    ],
    steps: [
      "افصل البطارية وافصل الشاشة بعناية",
      "حدد نقطة BROM على البوردة",
      "جهّز ملقط دقيق وكابل USB متصل بالكمبيوتر",
      "قصّر TP_BROM مع GND",
      "وصّل USB أثناء الاتصال",
      "يظهر COM Port في SP Flash Tool",
      "حمّل Scatter File الخاص بـ Redmi 9 وابدأ التفليش",
    ],
    warnings: [
      "Redmi 9 يملك نظام A/B — اختر Download Only لا Format+Download",
      "بعض النسخ تحتاج إلغاء تفعيل Driver Signature على Windows",
    ],
    requiredTools: ["SP Flash Tool", "MTK VCOM Driver", "Scatter File Redmi 9"],
    difficulty: "medium",
    successIndicator: "COM Port يظهر في SP Flash Tool عند الاتصال",
    youtubeSearch: "Xiaomi Redmi 9 BROM test point SP Flash Tool MTK",
    tags: ["MTK", "BROM", "Helio G85", "Redmi 9"],
  },

  {
    id: "tp-xiaomi-redminote8",
    brand: "Xiaomi",
    modelName: "Xiaomi Redmi Note 8",
    modelNumber: "M1908C3JG",
    chipset: "Qualcomm Snapdragon 665",
    softwareId: "xiaomi-note8",
    mode: "edl_9008",
    modeLabel: "وضع EDL 9008 — Qualcomm (Snapdragon 665)",
    method: "short_pads",
    boardWidth: 300,
    boardHeight: 500,
    boardColor: "#1a0f1f",
    pins: [
      {
        id: "tp1-note8-edl",
        label: "EDL_D+",
        x: 50,
        y: 72,
        color: "#8B5CF6",
        isPrimary: true,
        description: "نقطة D+ لمنفذ USB — أقرب PAD لموصل USB Type-C في الأسفل",
      },
      {
        id: "gnd-note8",
        label: "GND",
        x: 50,
        y: 85,
        color: "#6B7280",
        isPrimary: false,
        description: "الحافة المعدنية للموصل USB",
      },
    ],
    steps: [
      "أوقف الجهاز وافصل البطارية",
      "حدد PAD الـ D+ لموصل USB Type-C في أسفل البوردة",
      "جهّز كابل USB متصل بالكمبيوتر",
      "قصّر D+ مع GND الموصل",
      "وصّل كابل USB أثناء التقصير",
      "يظهر 'Qualcomm HS-USB QDLoader 9008' في Device Manager",
      "افتح QFIL وحمّل prog_firehose.mbn ثم ابدأ التفليش",
    ],
    warnings: [
      "الدخول عبر ADB أسهل: `adb reboot edl` إذا كان Bootloader مفتوحاً",
      "بعض الأجهزة تحتاج كابل EDL مع مقاومة 1kΩ بين D+ وGND",
      "9008 يمحو Userdata — احذر من فقدان بيانات الزبون",
    ],
    requiredTools: ["QFIL", "Qualcomm USB Driver", "prog_firehose.mbn لـ Snapdragon 665"],
    difficulty: "hard",
    successIndicator: "Qualcomm 9008 يظهر في Device Manager",
    notes: "يمكن الدخول عبر Volume Down + Power لمدة 15 ثانية على بعض النسخ",
    youtubeSearch: "Xiaomi Redmi Note 8 EDL 9008 test point Qualcomm",
    tags: ["Qualcomm", "EDL", "9008", "Snapdragon 665", "Redmi Note 8"],
  },

  // ═══════════════════════════════════════════════════════════════
  //  APPLE — DFU Mode
  // ═══════════════════════════════════════════════════════════════

  {
    id: "tp-apple-iphone12",
    brand: "Apple",
    modelName: "Apple iPhone 12",
    modelNumber: "A2403",
    chipset: "Apple A14 Bionic",
    softwareId: "apple-iphone12",
    mode: "dfu",
    modeLabel: "وضع DFU — Device Firmware Upgrade",
    method: "volume_combo",
    boardWidth: 300,
    boardHeight: 500,
    boardColor: "#1a1a1a",
    pins: [
      {
        id: "vol-up-ip12",
        label: "Volume Up ▲",
        x: 10,
        y: 35,
        color: "#10B981",
        isPrimary: false,
        description: "زر رفع الصوت — الجانب الأيسر",
      },
      {
        id: "vol-down-ip12",
        label: "Volume Down ▼",
        x: 10,
        y: 50,
        color: "#10B981",
        isPrimary: false,
        description: "زر خفض الصوت — الجانب الأيسر",
      },
      {
        id: "side-ip12",
        label: "Side Button",
        x: 90,
        y: 42,
        color: "#EF4444",
        isPrimary: true,
        description: "الزر الجانبي — الجانب الأيمن — اضغط 10 ثوانٍ",
      },
    ],
    steps: [
      "وصّل iPhone بالكمبيوتر بكابل USB",
      "اضغط Volume Up بسرعة ثم أفلته",
      "اضغط Volume Down بسرعة ثم أفلته",
      "اضغط مع الاستمرار على الزر الجانبي (Side Button) لمدة 10 ثوانٍ",
      "بعد 10 ثوانٍ، اضغط مع الاستمرار على Volume Down + Side Button معاً لـ 5 ثوانٍ",
      "أفلت الزر الجانبي فقط، واستمر في ضغط Volume Down لـ 5 ثوانٍ أخرى",
      "الشاشة ستبقى سوداء — هذا صحيح في وضع DFU",
      "ستسمع صوت تعرف Mac/iTunes على الجهاز كـ DFU",
      "افتح iTunes أو Finder واختر Restore/Update",
    ],
    warnings: [
      "الشاشة يجب أن تبقى سوداء — إذا ظهر شيء فأعد المحاولة",
      "DFU يمحو جميع البيانات",
      "يحتاج Mac أو Windows مع iTunes مثبّت",
    ],
    requiredTools: ["iTunes (Windows) أو Finder (Mac)", "كابل USB Lightning أو USB-C أصلي"],
    difficulty: "medium",
    successIndicator: "iTunes يعرض رسالة 'iPhone في وضع استعادة' مع شاشة سوداء",
    notes: "لوضع Recovery العادي: اضغط نفس الخطوات لكن أفلت الزر الجانبي عند ظهور شعار Apple",
    youtubeSearch: "iPhone 12 DFU mode how to enter restore iTunes",
    tags: ["Apple", "DFU", "iTunes", "Recovery", "A14 Bionic"],
  },

  // ═══════════════════════════════════════════════════════════════
  //  INFINIX / TECNO — MTK BROM
  // ═══════════════════════════════════════════════════════════════

  {
    id: "tp-infinix-hot12",
    brand: "Infinix",
    modelName: "Infinix Hot 12",
    modelNumber: "X6817",
    chipset: "MediaTek Helio G85",
    softwareId: "infinix-hot12",
    mode: "brom",
    modeLabel: "وضع BROM — Boot ROM (MTK Helio G85)",
    method: "short_pads",
    boardWidth: 300,
    boardHeight: 500,
    boardColor: "#0a1a0a",
    pins: [
      {
        id: "tp1-hot12",
        label: "TP_BROM",
        x: 38,
        y: 20,
        color: "#EF4444",
        isPrimary: true,
        description: "نقطة BROM — الزاوية العلوية اليسرى من البوردة",
      },
      {
        id: "gnd-hot12",
        label: "GND (Shield)",
        x: 38,
        y: 60,
        color: "#6B7280",
        isPrimary: false,
        description: "الغطاء المعدني لدرع آيسي الميموري",
      },
    ],
    steps: [
      "افصل البطارية والشاشة بعناية",
      "حدد نقطة BROM في الزاوية العلوية اليسرى",
      "قصّر BROM مع الغطاء المعدني لآيسي الميموري (GND)",
      "وصّل USB أثناء التقصير",
      "يظهر COM Port في SP Flash Tool",
      "حمّل Scatter File لـ Infinix Hot 12 (X6817)",
      "اختر Download Only وابدأ التفليش",
    ],
    warnings: [
      "تحقق من صحة Scatter File — الملف الخاطئ قد يبريك الجهاز",
      "استخدم SP Flash Tool v5.x وليس الإصدارات القديمة",
    ],
    requiredTools: ["SP Flash Tool", "MTK VCOM Driver", "Scatter File Infinix X6817"],
    difficulty: "medium",
    successIndicator: "COM Port يظهر في SP Flash Tool",
    youtubeSearch: "Infinix Hot 12 X6817 BROM test point SP Flash Tool",
    tags: ["MTK", "Infinix", "BROM", "X6817", "Helio G85"],
  },

  {
    id: "tp-tecno-spark8",
    brand: "Tecno",
    modelName: "Tecno Spark 8",
    modelNumber: "KG6p",
    chipset: "MediaTek Helio G35",
    softwareId: "tecno-spark8",
    mode: "brom",
    modeLabel: "وضع BROM — Boot ROM (MTK Helio G35)",
    method: "short_pads",
    boardWidth: 300,
    boardHeight: 500,
    boardColor: "#0a1a0a",
    pins: [
      {
        id: "tp1-spark8",
        label: "TP_BROM",
        x: 55,
        y: 18,
        color: "#EF4444",
        isPrimary: true,
        description: "نقطة BROM — أعلى البوردة بجانب فليكس الكاميرا الأمامية",
      },
      {
        id: "gnd-spark8",
        label: "GND",
        x: 55,
        y: 58,
        color: "#6B7280",
        isPrimary: false,
        description: "نقطة GND — الحافة المعدنية لموصل البطارية",
      },
    ],
    steps: [
      "افصل البطارية",
      "حدد نقطة BROM في أعلى البوردة",
      "قصّر BROM مع GND موصل البطارية",
      "وصّل USB أثناء التقصير",
      "يظهر COM Port في SP Flash Tool",
      "حمّل Scatter File KG6p وابدأ التفليش",
    ],
    warnings: [
      "Tecno Spark 8 لديه نسختان KG6 (3G) و KG6p (4G) — تأكد من الموديل الصحيح",
    ],
    requiredTools: ["SP Flash Tool", "MTK VCOM Driver", "Scatter File KG6p"],
    difficulty: "medium",
    successIndicator: "COM Port يظهر في SP Flash Tool",
    youtubeSearch: "Tecno Spark 8 KG6p BROM test point SP Flash Tool",
    tags: ["MTK", "Tecno", "BROM", "KG6p", "Helio G35"],
  },
];

// ─────────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────────

/** Returns the test-point entry that matches a given softwareId */
export function getTestPoint(softwareId: string): TestPointEntry | undefined {
  return TESTPOINT_DATABASE.find((tp) => tp.softwareId === softwareId);
}

/** Difficulty badge styling */
export const DIFFICULTY_CONFIG = {
  easy: { label: "سهل", color: "text-green-400 bg-green-400/10 border-green-400/30" },
  medium: { label: "متوسط", color: "text-amber-400 bg-amber-400/10 border-amber-400/30" },
  hard: { label: "صعب", color: "text-red-400 bg-red-400/10 border-red-400/30" },
} as const;

/** Mode badge styling */
export const MODE_CONFIG: Record<TestPointMode, { label: string; color: string; icon: string }> = {
  edl_9008: { label: "EDL 9008", color: "text-purple-400 bg-purple-400/10 border-purple-400/30", icon: "⚡" },
  brom: { label: "BROM MTK", color: "text-red-400 bg-red-400/10 border-red-400/30", icon: "🔴" },
  download: { label: "Download Mode", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", icon: "📥" },
  dfu: { label: "DFU Mode", color: "text-neutral-300 bg-white/5 border-white/20", icon: "🍎" },
  fastboot: { label: "Fastboot", color: "text-orange-400 bg-orange-400/10 border-orange-400/30", icon: "🚀" },
};
