export interface ICReplacement {
  icNumber: string;
  functionAr: string;
  compatibleModels: string[];
  notesAr: string;
}

export const IC_COMPATIBILITY_DATABASE: ICReplacement[] = [
  {
    icNumber: "S2MU106X01",
    functionAr: "آيسي شحن وباور فرعي (Sub-PMIC & Charger)",
    compatibleModels: [
      "Samsung Galaxy A12 (SM-A125F)",
      "Samsung Galaxy A02s (SM-A025F)",
      "Samsung Galaxy M12 (SM-M127F)",
      "Samsung Galaxy A21s (SM-A217F)",
      "Samsung Galaxy A03s (SM-A037F)"
    ],
    notesAr: "يتوفر بكثرة في بوردات A12 و A02s التشليح، يتطلب حرارة هواء 340-350 درجة بدون فلوكس زائد."
  },
  {
    icNumber: "MT6358W",
    functionAr: "آيسي باور رئيسي لمعالجات ميدياتك Helio",
    compatibleModels: [
      "Samsung Galaxy A32 (SM-A325F)",
      "Samsung Galaxy A22 (SM-A225F)",
      "Xiaomi Redmi Note 8 Pro",
      "Xiaomi Redmi 9",
      "Realme 6 / 6s"
    ],
    notesAr: "حساس للحرارة الزائدة، يجب عزل المعالج المجاور بشريط حماية حراري (Kapton Tape)."
  },
  {
    icNumber: "PM6125",
    functionAr: "آيسي باور رئيسي كوالكوم (Qualcomm Power Management)",
    compatibleModels: [
      "Samsung Galaxy A23 (SM-A235F)",
      "Xiaomi Redmi Note 9S",
      "Xiaomi Redmi Note 8 (2019)",
      "Realme 5 / 5i",
      "Oppo A52 / A72"
    ],
    notesAr: "يمكن أخذه من بوردات ريدمي نوت 8 القديمة المتوفرة بكثرة بالسوق."
  },
  {
    icNumber: "PM6225",
    functionAr: "آيسي باور أحدث لمعالجات Snapdragon 680",
    compatibleModels: [
      "Xiaomi Redmi Note 11 (4G)",
      "Samsung Galaxy A23 4G (إصدارات معينة)",
      "Honor X7 / X8",
      "Realme 9i"
    ],
    notesAr: "انتبه لاتجاه النقطة (Pin 1 Dot) قبل التركيب."
  },
  {
    icNumber: "MT6371P",
    functionAr: "آيسي شحن سريع وتحكم إضاءة ميديا تيك",
    compatibleModels: [
      "Xiaomi Redmi 9",
      "Xiaomi Redmi Note 9",
      "Samsung Galaxy A31",
      "Samsung Galaxy A41"
    ],
    notesAr: "يسبب مشكلة الجهاز لا يفتح ولا يشحن وسحبته على الباور سبلاي 0.03A ثابت."
  },
  {
    icNumber: "SM3010",
    functionAr: "درايفر تغذية شاشات الأموليد (+4.6V / -4.0V)",
    compatibleModels: [
      "Xiaomi Redmi Note 11",
      "Xiaomi Redmi Note 10",
      "Samsung Galaxy A32 4G",
      "Samsung Galaxy A51"
    ],
    notesAr: "في حال احتراقه يعطي الجهاز رجة إقلاع دون صورة."
  }
];

export function findICReplacements(query: string): ICReplacement[] {
  if (!query || !query.trim()) return IC_COMPATIBILITY_DATABASE;
  const q = query.toLowerCase().trim();
  return IC_COMPATIBILITY_DATABASE.filter(
    (item) =>
      item.icNumber.toLowerCase().includes(q) ||
      item.compatibleModels.some((m) => m.toLowerCase().includes(q)) ||
      item.functionAr.toLowerCase().includes(q)
  );
}

// دالة حساب أمبير الحقن الآمن لتفادي حرق طبقات البوردة
export function calculateSafeInjection(voltageVolts: number, shortResistanceOhms: number) {
  if (voltageVolts <= 0 || shortResistanceOhms <= 0) {
    return {
      currentAmps: 0,
      powerWatts: 0,
      riskLevelAr: "قيمة غير صحيحة",
      recommendedLimitAmps: 0,
      adviceAr: "أدخل قيماً موجبة صحيحة للفولت والمقاومة."
    };
  }

  const theoreticalAmps = voltageVolts / shortResistanceOhms;
  let recommendedLimitAmps = 1.0;
  let riskLevelAr = "آمن (Low Risk)";
  let adviceAr = "ابدأ بجهد منخفض جداً (1.0V) وارفع تدريجياً مع استخدام Rosin أو كاميرا حرارية.";

  if (voltageVolts > 4.2) {
    riskLevelAr = "خطر شديد (Dangerous Voltage)";
    recommendedLimitAmps = 0.8;
    adviceAr = "تحذير: لا تحقن أكثر من 4.2V في خطوط VPH/VBAT، ولا أكثر من 1.8V في خطوط التغذية المنخفضة حتى لا تتلف المعالج!";
  } else if (theoreticalAmps > 3.0) {
    riskLevelAr = "متوسط إلى مرتفع (High Heat)";
    recommendedLimitAmps = 2.0;
    adviceAr = "حدد الأمبير على الباور سبلاي بحد أقصى 2.0A حتى يسخن المكثف الشورت دون ذوبان النحاس الداخلي للوحة.";
  } else {
    recommendedLimitAmps = Math.min(theoreticalAmps, 1.8);
  }

  const powerWatts = voltageVolts * Math.min(theoreticalAmps, recommendedLimitAmps);

  return {
    currentAmps: Number(theoreticalAmps.toFixed(2)),
    powerWatts: Number(powerWatts.toFixed(2)),
    riskLevelAr,
    recommendedLimitAmps: Number(recommendedLimitAmps.toFixed(2)),
    adviceAr
  };
}
