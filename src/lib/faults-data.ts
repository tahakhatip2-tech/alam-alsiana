export interface FaultItem {
  id: string;
  brand: string;
  model: string;
  powerDraw: string; // e.g., "0.80->0", "0.05", "Short 0.00->2.5A"
  diagnosisAr: string;
  faultyComponent: string;
  testPoint: string;
  successRate: number;
  fixPriceJOD: number;
  tags: string[];
}

export const FAULTS_DATABASE: FaultItem[] = [
  // Samsung Galaxy A12 (A125F / A127F)
  {
    id: "f-a12-01",
    brand: "Samsung",
    model: "Galaxy A12",
    powerDraw: "0.80->0",
    diagnosisAr: "فصل باور مفاجئ بعد ضغطة زر الباور. خط VDD_MAIN مسرّب أو تلف في آيسي الباور المساعد.",
    faultyComponent: "PMIC S2MU106X01 (أو مكثف C5014 بجوار الآيسي)",
    testPoint: "فحص ممانعة خط VDD_MAIN حول U5002 - القراءة السليمة 380-450mV",
    successRate: 92,
    fixPriceJOD: 15,
    tags: ["power", "pmic", "a12"]
  },
  {
    id: "f-a12-02",
    brand: "Samsung",
    model: "Galaxy A12",
    powerDraw: "0.00->0.05",
    diagnosisAr: "سحبة ضعيفة وثابتة عند 0.05A تدل على انقطاع خط التغذية الأولي لزر الباور أو تلف كرستالة التوقيت 32kHz.",
    faultyComponent: "Crystal OSC OSC5000 أو مقاومة سحب زر الباور",
    testPoint: "قياس الفولت على كونكتر الفلاتة ومفتاح التشغيل (1.8V PWR_KEY)",
    successRate: 85,
    fixPriceJOD: 12,
    tags: ["power", "crystal", "a12"]
  },
  {
    id: "f-a12-03",
    brand: "Samsung",
    model: "Galaxy A12",
    powerDraw: "Short->2.00+",
    diagnosisAr: "شورت صريح ومباشر على خط البطارية VPH_PWR فور شبك الباور سبلاي.",
    faultyComponent: "مكثف حماية على مدخل تغذية الشحن OVP أو آيسي الشحن الرئيسي",
    testPoint: "حقن 3.8V بـ 2A على خط الموجب بالتبخير بالروزين لمعرفة المكثف الساخن",
    successRate: 98,
    fixPriceJOD: 10,
    tags: ["short", "vbat", "a12"]
  },
  {
    id: "f-a12-04",
    brand: "Samsung",
    model: "Galaxy A12",
    powerDraw: "0.20->0.25 ثابت",
    diagnosisAr: "تعليق على مرحلة السوفت وير الباكر (Bootloop or Boot Stuck). المعالج MT6765 لا يتعرف على الذاكرة eMMC.",
    faultyComponent: "ذاكرة eMMC KMQE10013M أو فصل نقاط تحت المعالج",
    testPoint: "فحص خطوط VCC (3.0V) و VCCQ (1.8V) المغذية للذاكرة",
    successRate: 70,
    fixPriceJOD: 22,
    tags: ["emmc", "cpu", "a12"]
  },
  {
    id: "f-a12-05",
    brand: "Samsung",
    model: "Galaxy A12",
    powerDraw: "0.15->0",
    diagnosisAr: "تراجع السحبة بعد بدء الإقلاع بسبب عطل دائرة إضاءة الشاشة واكتشاف قصر في خط الأنود.",
    faultyComponent: "ديود الإضاءة D7001 أو ملف الرفع L7001",
    testPoint: "فحص خط LED_ANODE على كونكتر الشاشة",
    successRate: 90,
    fixPriceJOD: 12,
    tags: ["light", "display", "a12"]
  },

  // Samsung Galaxy A32 (A325F 4G / A326B 5G)
  {
    id: "f-a32-01",
    brand: "Samsung",
    model: "Galaxy A32",
    powerDraw: "0.60->0",
    diagnosisAr: "سقوط الإقلاع عند تحميل خطوط تغذية الكاميرا أو الشاشة، قصر في منظم الجهد LDO.",
    faultyComponent: "LDO تغذية الكاميرا الرئيسية أو شورت بمكثفات الفلاتر",
    testPoint: "فحص مسار VDD_1.8V_AP على المكثف C4102",
    successRate: 88,
    fixPriceJOD: 14,
    tags: ["ldo", "power", "a32"]
  },
  {
    id: "f-a32-02",
    brand: "Samsung",
    model: "Galaxy A32",
    powerDraw: "0.12->0.18 متذبذب",
    diagnosisAr: "محاولة إعادة تشغيل مستمرة (Restart Loop) بسبب كسر أو فصل في مسار ريست الذاكرة UFS.",
    faultyComponent: "مقاومة مسار RST_N الخاصة بذاكرة UFS",
    testPoint: "فحص إشارة UFS_RST_N بالمتر 1.8V مستقرة",
    successRate: 75,
    fixPriceJOD: 18,
    tags: ["ufs", "bootloop", "a32"]
  },
  {
    id: "f-a32-03",
    brand: "Samsung",
    model: "Galaxy A32",
    powerDraw: "0.00->0.02",
    diagnosisAr: "فصل خط بطارية التيرمستور BATT_THERM أو تلف بمقاومة الحساس الحراري يمنع الإقلاع تماماً.",
    faultyComponent: "مقاومة الثيرمستور TH3001 بقيمة 100K",
    testPoint: "قياس مسار TH3001 ومقارنتها مع حرارة الغرفة (حوالي 1.2V)",
    successRate: 94,
    fixPriceJOD: 10,
    tags: ["thermistor", "battery", "a32"]
  },
  {
    id: "f-a32-04",
    brand: "Samsung",
    model: "Galaxy A32",
    powerDraw: "0.90->0",
    diagnosisAr: "سحبة شحن وهمية وسقوط فوري، خلل في دائرة IF PMIC MT6358W المسؤولة عن الشحن وإدارة الطاقة الثانوية.",
    faultyComponent: "آيسي MT6358W (Sub-PMIC)",
    testPoint: "قياس ملفات البك المحيطة L6001 و L6002 ممانعة ضد الأرضي",
    successRate: 87,
    fixPriceJOD: 17,
    tags: ["charging", "pmic", "a32"]
  },
  {
    id: "f-a32-05",
    brand: "Samsung",
    model: "Galaxy A32",
    powerDraw: "Short->1.80A",
    diagnosisAr: "شورت في خط التغذية الرئيسي بعد آيسي الشحن VSYS الناتج عن ماء أو شاحن سيارة رديء.",
    faultyComponent: "مكثف الترشيح الرئيسي بجانب آيسي الشحن",
    testPoint: "رفع الملف الرئيسي وعزل الجهة التي بها القصر",
    successRate: 96,
    fixPriceJOD: 13,
    tags: ["short", "vsys", "a32"]
  },

  // Samsung Galaxy A23 (A235F)
  {
    id: "f-a23-01",
    brand: "Samsung",
    model: "Galaxy A23",
    powerDraw: "0.08->0",
    diagnosisAr: "المعالج كوالكوم Snapdragon 680 يحاول البدء في الـ Secondary Boot ثم ينطفئ لانعدام إشارة التشغيل PS_HOLD.",
    faultyComponent: "PM6125 (آيسي الباور الرئيسي كوالكوم)",
    testPoint: "قياس إشارة PS_HOLD على نقطة التيست TP_PS_HOLD (0V تعني تلف الآيسي)",
    successRate: 82,
    fixPriceJOD: 20,
    tags: ["qualcomm", "pm6125", "a23"]
  },
  {
    id: "f-a23-02",
    brand: "Samsung",
    model: "Galaxy A23",
    powerDraw: "0.35->0.40 ثابت",
    diagnosisAr: "تعليق بوضع الـ Qualcomm EDL 9008 Mode دون ظهور أي شيء على الشاشة.",
    faultyComponent: "انفصال كرات اللحام تحت ذاكرة UFS أو تلف الفيرموير",
    testPoint: "شبك الجهاز بالكمبيوتر: فحص ظهور منفذ Qualcomm HS-USB QDLoader 9008",
    successRate: 78,
    fixPriceJOD: 22,
    tags: ["edl", "ufs", "a23"]
  },
  {
    id: "f-a23-03",
    brand: "Samsung",
    model: "Galaxy A23",
    powerDraw: "0.00 (لا استجابة)",
    diagnosisAr: "فصل كامل في مسار زر الباور أو قطع في فلاتة الربط بين البوردة السفلية والعلوية.",
    faultyComponent: "فلاتة الربط الرئيسية Main FPC أو سوكت FPC العلوي",
    testPoint: "قصر طرف PWR_KEY مباشرة إلى الأرضي على البوردة العلوية",
    successRate: 95,
    fixPriceJOD: 8,
    tags: ["button", "fpc", "a23"]
  },
  {
    id: "f-a23-04",
    brand: "Samsung",
    model: "Galaxy A23",
    powerDraw: "0.75->0",
    diagnosisAr: "سقوط الباور لحظة إقلاع مضخم الصوت Audio PA أو الترددات اللاسلكية RF.",
    faultyComponent: "آيسي الصوت AW882XX أو مكثف المسار المتصل به",
    testPoint: "فحص ممانعة خط SPK_VDD على طرف المكثف C5301",
    successRate: 90,
    fixPriceJOD: 15,
    tags: ["audio", "short", "a23"]
  },

  // Xiaomi Redmi 9 (M2004J19G / Prime)
  {
    id: "f-redmi9-01",
    brand: "Xiaomi",
    model: "Redmi 9",
    powerDraw: "0.10->0.14 ثابت",
    diagnosisAr: "تعليق على شعار ريدمي أو شاشة سوداء مع سحبة ثابتة. عيب مصنعي شهير: انفصال نقاط معالج Helio G80.",
    faultyComponent: "المعالج الرئيسي MT6769V بحاجة لإعادة شبلنة (Reballing)",
    testPoint: "الضغط الخفيف على المعالج بالأصبع أثناء الضغط على الباور سبلاي وملاحظة تغير السحبة",
    successRate: 85,
    fixPriceJOD: 20,
    tags: ["cpu", "reballing", "redmi9"]
  },
  {
    id: "f-redmi9-02",
    brand: "Xiaomi",
    model: "Redmi 9",
    powerDraw: "0.00->0.03",
    diagnosisAr: "تلف في آيسي الشحن والباور الثانوي MT6371P المسؤول عن رفع فولتية الشحن وإنتاج خط النظام.",
    faultyComponent: "Sub-PMIC MT6371P",
    testPoint: "فحص جهد خط VSYS على المكثف بجانب ملف الشحن الكبير L3001 (يجب أن يكون 3.8V-4.2V)",
    successRate: 89,
    fixPriceJOD: 15,
    tags: ["charging", "pmic", "redmi9"]
  },
  {
    id: "f-redmi9-03",
    brand: "Xiaomi",
    model: "Redmi 9",
    powerDraw: "Short->3.00A",
    diagnosisAr: "شورت صريح فور تركيب كابل الباور، احتراق ديود الحماية أو مكثفات VBUS بسبب شاحن تجاري.",
    faultyComponent: "ديود الزنر لحماية مدخل الشحن TVS Diode",
    testPoint: "رفع ديود الحماية بجانب سوكت الفلاتة العلوية",
    successRate: 99,
    fixPriceJOD: 8,
    tags: ["short", "diode", "redmi9"]
  },
  {
    id: "f-redmi9-04",
    brand: "Xiaomi",
    model: "Redmi 9",
    powerDraw: "0.45->0",
    diagnosisAr: "إقلاع طبيعي يصل نصف ثانية ثم يفصل. غالباً تلف مجس الكاميرا الأمامية أو سنسور التقارب يسبب شورت على خط I2C.",
    faultyComponent: "مكثف خط I2C أو حساس التقارب Proximity Sensor",
    testPoint: "فصل الكاميرات وفلاتة الحساسات وتجربة الباور لوحده",
    successRate: 93,
    fixPriceJOD: 10,
    tags: ["camera", "sensor", "redmi9"]
  },

  // Xiaomi Redmi Note 11 (2201117TG)
  {
    id: "f-rn11-01",
    brand: "Xiaomi",
    model: "Redmi Note 11",
    powerDraw: "0.22->0.28 متذبذب",
    diagnosisAr: "إعادة إقلاع متكررة بدون ظهور الشعار. تلف مسار مفتاح التشغيل مع البصمة الجانبية (زر الباور ملمس دائم).",
    faultyComponent: "فلاتة البصمة ومفتاح الباور الجانبي Side Key Flex",
    testPoint: "فصل فلاتة البصمة الجانبية وتشغيل البوردة من التيست بوينت PWR_ON على اللوحة",
    successRate: 98,
    fixPriceJOD: 10,
    tags: ["powerkey", "flex", "note11"]
  },
  {
    id: "f-rn11-02",
    brand: "Xiaomi",
    model: "Redmi Note 11",
    powerDraw: "0.06->0",
    diagnosisAr: "فشل خرج فولتيات البك الرئيسية من آيسي الباور Qualcomm PM6225.",
    faultyComponent: "آيسي باور كوالكوم PM6225",
    testPoint: "فحص ممانعات ملفات البك S1, S2, S3 المحيطة بـ PM6225",
    successRate: 84,
    fixPriceJOD: 18,
    tags: ["pmic", "qualcomm", "note11"]
  },
  {
    id: "f-rn11-03",
    brand: "Xiaomi",
    model: "Redmi Note 11",
    powerDraw: "0.70->0",
    diagnosisAr: "شورت خط تغذية شاشة الأموليد AMOLED Power IC (+4.6V / -4.0V). الجهاز يقلع ويهتز ثم ينطفئ لحماية الدائرة.",
    faultyComponent: "آيسي تغذية الأموليد SM3010 أو مكثفات الخرج",
    testPoint: "فحص خط ELVDD و ELVSS على مكثفات تغذية الشاشة بجوار السوكت",
    successRate: 88,
    fixPriceJOD: 16,
    tags: ["amoled", "display", "note11"]
  },
  {
    id: "f-rn11-04",
    brand: "Xiaomi",
    model: "Redmi Note 11",
    powerDraw: "0.00->0.02 ثابت",
    diagnosisAr: "عطل شبكة السيريال لخط التغذية I2C SPMI بين المعالج وآيسي الباور.",
    faultyComponent: "مقاومة مسار SPMI_DATA أو SPMI_CLK",
    testPoint: "قياس مسار SPMI على التيست بوينت المجاورة لـ PM6225 (القراءة 1.8V)",
    successRate: 79,
    fixPriceJOD: 14,
    tags: ["spmi", "bus", "note11"]
  },

  // أعطال إضافية شائعة جداً (سامسونج وشاومي)
  {
    id: "f-gen-01",
    brand: "Samsung",
    model: "Galaxy A12",
    powerDraw: "0.03->0",
    diagnosisAr: "تسريب طاقة داخلي في مسار الـ RTC أو تلف بآيسي الشحن الصغير.",
    faultyComponent: "آيسي الشحن BQ25601 أو ما يعادله",
    testPoint: "فحص حرارة آيسي الشحن تحت الكاميرا الحرارية عند وصل 4V",
    successRate: 91,
    fixPriceJOD: 12,
    tags: ["charging", "leak", "a12"]
  },
  {
    id: "f-gen-02",
    brand: "Samsung",
    model: "Galaxy A32",
    powerDraw: "0.04->0.08",
    diagnosisAr: "شحن بطيء وتفريغ سريع مع حرارة خفيفة أسفل اللوحة. تلف آيسي الفايبريتور أو درايفر الهابتك.",
    faultyComponent: "Haptic Driver IC",
    testPoint: "رفع آيسي الهابتك وفحص سحب الباور من دونه",
    successRate: 95,
    fixPriceJOD: 10,
    tags: ["haptic", "leak", "a32"]
  },
  {
    id: "f-gen-03",
    brand: "Xiaomi",
    model: "Redmi 9",
    powerDraw: "0.85->0",
    diagnosisAr: "فصل عند تشغيل الواي فاي أو البلوتوث فور إقلاع الواجهة، شورت بآيسي الـ WCN.",
    faultyComponent: "آيسي الواي فاي MT6631N",
    testPoint: "ممانعة مكثفات خط تغذية 1.8V و 3.3V لآيسي الواي فاي",
    successRate: 88,
    fixPriceJOD: 15,
    tags: ["wifi", "short", "redmi9"]
  },
  {
    id: "f-gen-04",
    brand: "Samsung",
    model: "Galaxy A23",
    powerDraw: "0.18->0.22",
    diagnosisAr: "الجهاز يدخل في وضع التفليش الذاتي CrashDump Mode ناتج عن تلف مسار قراءة بطاقة الذاكرة أو الـ UFS.",
    faultyComponent: "سوكت بطاقة الذاكرة SD أو شورت في مكثفات مسار التغذية VDD_EMMC",
    testPoint: "فحص فتحات سوكت الميموري كارد من أي تلامس أو انحناء في الأرجل",
    successRate: 87,
    fixPriceJOD: 12,
    tags: ["sdcard", "crashdump", "a23"]
  },
  {
    id: "f-gen-05",
    brand: "Xiaomi",
    model: "Redmi Note 11",
    powerDraw: "Short->1.50A",
    diagnosisAr: "شورت صريح ناتج عن دخول سوائل حول كونكتر الكاميرا الخلفية العريضة.",
    faultyComponent: "مكثف ترشيح خط 2.8V لكاميرا الـ 50MP",
    testPoint: "فحص الممانعات حول كونكتر الكاميرا الخلفية Main Cam FPC",
    successRate: 97,
    fixPriceJOD: 11,
    tags: ["camera", "water", "note11"]
  }
];

export function diagnosePowerDraw(model: string, queryDraw: string): {
  exactMatch: boolean;
  item: FaultItem;
  similarityNote?: string;
} | null {
  if (!queryDraw || !queryDraw.trim()) return null;

  const clean = (s: string) => s.toLowerCase().replace(/[\s\-\>_]/g, "");
  const targetClean = clean(queryDraw);

  // 1. Exact match with model filter
  const modelFiltered = FAULTS_DATABASE.filter(
    (f) => !model || f.model.toLowerCase().includes(model.toLowerCase())
  );

  const exactInModel = modelFiltered.find((f) => clean(f.powerDraw) === targetClean);
  if (exactInModel) {
    return { exactMatch: true, item: exactInModel };
  }

  // 2. Partial match in model
  const partialInModel = modelFiltered.find(
    (f) => clean(f.powerDraw).includes(targetClean) || targetClean.includes(clean(f.powerDraw))
  );
  if (partialInModel) {
    return {
      exactMatch: false,
      item: partialInModel,
      similarityNote: `أقرب سحبة مطابقة لموديل ${partialInModel.model} (${partialInModel.powerDraw})`
    };
  }

  // 3. Fallback across all models
  const generalExact = FAULTS_DATABASE.find((f) => clean(f.powerDraw) === targetClean);
  if (generalExact) {
    return {
      exactMatch: false,
      item: generalExact,
      similarityNote: `سحبة مطابقة لموديل آخر: ${generalExact.model} (${generalExact.brand})`
    };
  }

  // 4. Closest overall fallback
  if (modelFiltered.length > 0) {
    return {
      exactMatch: false,
      item: modelFiltered[0],
      similarityNote: `عرض أكثر عطل شيوعاً لموديل ${modelFiltered[0].model}`
    };
  }

  return {
    exactMatch: false,
    item: FAULTS_DATABASE[0],
    similarityNote: "أقرب نمط عطل شائع في قاعدة البيانات"
  };
}
