export interface CenterService {
  title: string;
  description: string;
  priceStartingFrom?: number;
  estimatedTime?: string;
}

export interface MaintenanceCenter {
  id: string;
  name: string;
  ownerName: string;
  leadTechTitle: string;
  logo: string;
  coverImage: string;
  city: "عمان" | "إربد" | "الزرقاء" | "العقبة" | "السلط" | "المفرق" | string;
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isOpenNow: boolean;
  workingHours: string;
  specialties: string[];
  services: CenterService[];
  features: string[];
  availableStockSnippet: {
    phonesForSaleCount: number;
    boardsCount: number;
  };
  googleMapsUrl?: string;
  bio: string;
}

export const INITIAL_MAINTENANCE_CENTERS: MaintenanceCenter[] = [
  {
    id: "center-gardens-pro",
    name: "مركز الأوائل لصيانة المايكرو هاردوير",
    ownerName: "م. أنس الخالدي",
    leadTechTitle: "خبير فحص الممانعات والمخططات الدقيقة",
    logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
    city: "عمان",
    area: "شارع الجاردنز",
    address: "شارع الجاردنز - مجمع العساف التجاري - الطابق 1",
    phone: "0798112233",
    whatsapp: "0798112233",
    rating: 4.9,
    reviewCount: 142,
    isVerified: true,
    isOpenNow: true,
    workingHours: "10:00 ص - 10:30 م",
    specialties: [
      "صيانة آيسيات وماذربورد",
      "إصلاح شورت الباور",
      "آيفون وبرمجة شاشات",
      "تبديل باغات وليزر الظهر",
    ],
    services: [
      {
        title: "تشخيص وإصلاح آيسي الباور والشحن (S2MU / PMIC)",
        description: "فحص بالمايكروسكوب والباور سبلاي واستبدال بالشبلنة الاحترافية",
        priceStartingFrom: 18,
        estimatedTime: "خلال 3 ساعات",
      },
      {
        title: "تبديل زجاج الشاشة الخارجي (باغة) مع العزل OCA",
        description: "حفظ الشاشة واللمس الأصلي 100% بأحدث ماكينات الضغط الحراري",
        priceStartingFrom: 15,
        estimatedTime: "ساعتان",
      },
      {
        title: "حل مشاكل شبكة الآيفون (Baseband / لا توجد خدمة)",
        description: "ريبولينج لطبقات اللوحة المزدوجة وإصلاح خطوط التغذية المفقودة",
        priceStartingFrom: 30,
        estimatedTime: "نفس اليوم",
      },
    ],
    features: [
      "كفالة شهر مع فاتورة إلكترونية",
      "فحص ممانعات مجاني فور الدخول",
      "قطع غيار مفكوكة أصلية وكالة",
      "تسجيل بـ IMEI وسند استلام حراري",
    ],
    availableStockSnippet: {
      phonesForSaleCount: 8,
      boardsCount: 19,
    },
    googleMapsUrl: "https://maps.google.com/?q=Amman+Gardens+Street",
    bio: "ورشة متخصصة ومجهزة بأحدث أجهزة لحام الأشعة تحت الحمراء ومايكروسكوبات ثلاثية الأبعاد. معتمدون من أكثر من 20 متجراً للهواتف في الأردن لأعطال البورد المستعصية.",
  },
  {
    id: "center-irbid-tech",
    name: "مختبر الشمال للدوائر المتكاملة",
    ownerName: "م. طارق الزعبي",
    leadTechTitle: "فني بوردات سامسونج وشاومي معتمد",
    logo: "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=200&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80",
    city: "إربد",
    area: "شارع الجامعة",
    address: "شارع الجامعة - مقابل البوابة الشمالية - عمارة الشناق",
    phone: "0785544332",
    whatsapp: "0785544332",
    rating: 4.8,
    reviewCount: 96,
    isVerified: true,
    isOpenNow: true,
    workingHours: "09:30 ص - 09:30 م",
    specialties: [
      "بوردات سامسونج الفاصلة",
      "حل مشاكل المعالج والرام CPU Reballing",
      "صيانة أجهزة شاومي وهونر",
      "بيع قطع تشليح أصلية",
    ],
    services: [
      {
        title: "شبلنة معالج ورام (CPU/RAM Reballing)",
        description: "إصلاح إعادة التشغيل التلقائي والموت المفاجئ في Poco X3 و Redmi Note 10",
        priceStartingFrom: 25,
        estimatedTime: "نفس اليوم",
      },
      {
        title: "تغيير سوكت شحن تايب سي (Type-C الأصلية)",
        description: "دعم الشحن السريع الفائق Super Fast Charging ونقل البيانات",
        priceStartingFrom: 8,
        estimatedTime: "40 دقيقة",
      },
    ],
    features: [
      "مخزن بوردات تشليح ضخم ونادر",
      "كفالة استبدال 20 يوماً",
      "أسعار خاصة للطلاب والفنيين",
      "خدمة استلام الأجهزة من محافظات الشمال",
    ],
    availableStockSnippet: {
      phonesForSaleCount: 5,
      boardsCount: 34,
    },
    googleMapsUrl: "https://maps.google.com/?q=Irbid+University+Street",
    bio: "أكبر مخزن لبوردات التشليح وقطع الغيار الأصلية في إربد ومحافظات الشمال. نوفر حلولاً هندسية للمشاكل الشائعة في معالجات كوالكوم وميدياتك.",
  },
  {
    id: "center-zarqa-gold",
    name: "رواد الصيانة - الزرقاء الحديثة",
    ownerName: "الأستاذ خالد العمري",
    leadTechTitle: "فني هاردوير أقدم - خبرة 14 سنة",
    logo: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=200&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    city: "الزرقاء",
    area: "الزرقاء الجديدة - شارع 36",
    address: "شارع 36 التجاري - بجانب مجمع البنوك",
    phone: "0796677889",
    whatsapp: "0796677889",
    rating: 4.7,
    reviewCount: 88,
    isVerified: true,
    isOpenNow: true,
    workingHours: "10:00 ص - 11:00 م",
    specialties: [
      "صيانة سريعة وفورية",
      "تبديل بطاريات وشاشات أصلية",
      "إصلاح بصمة وزر الباور",
      "أجهزة إنفينكس وتكنو",
    ],
    services: [
      {
        title: "استبدال بطاريات أصلية مع برمجة صحة البطارية",
        description: "بطاريات أصلية مكفولة تدوم يوم عمل كامل دون تنبيهات بالنظام",
        priceStartingFrom: 12,
        estimatedTime: "30 دقيقة",
      },
      {
        title: "فك حماية وسوفتوير رسمي وإصلاح البوت",
        description: "استعادة النظام عند الوقوف على الشعار دون فقدان البيانات قدر الإمكان",
        priceStartingFrom: 10,
        estimatedTime: "ساعة",
      },
    ],
    features: [
      "صيانة فورية مباشرة أمام الزبون",
      "كفالة 45 يوماً على البطاريات",
      "أسعار منافسة تناسب الجميع",
    ],
    availableStockSnippet: {
      phonesForSaleCount: 11,
      boardsCount: 14,
    },
    googleMapsUrl: "https://maps.google.com/?q=Zarqa+Street+36",
    bio: "مركزك الموثوق في الزرقاء لكل ما يخص أجهزة الهواتف الذكية. نتميز بالسرعة والأمانة وفحص الجهاز بحضور الزبون مع ضمان خطي.",
  },
  {
    id: "center-sweifieh-elite",
    name: "إيليت تيك فيكس (Elite TechFix)",
    ownerName: "م. حسام النجار",
    leadTechTitle: "أخصائي معتمد لأجهزة أبل والماك بوك",
    logo: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=200&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    city: "عمان",
    area: "الصويفية",
    address: "الصويفية - شارع الوكالات - مجمع غياث التجاري",
    phone: "0799988776",
    whatsapp: "0799988776",
    rating: 5.0,
    reviewCount: 165,
    isVerified: true,
    isOpenNow: true,
    workingHours: "10:30 ص - 09:30 م",
    specialties: [
      "متخصص أبل وماك بوك (Apple Ecosystem)",
      "نقل رقائق الشاشة وفايس آي دي (Face ID Repair)",
      "زيادة سعة الذاكرة NAND Upgrade",
      "أجهزة فلاجشيب وسامسونج ألترا",
    ],
    services: [
      {
        title: "إصلاح الفايس آي دي (Face ID) المنقطع",
        description: "إصلاح فلاتة البروكسيميتي والـ Dot Projector مع الحفاظ على التشفير",
        priceStartingFrom: 28,
        estimatedTime: "خلال 4 ساعات",
      },
      {
        title: "ترقية ذاكرة الآيفون (NAND Storage Upgrade)",
        description: "ترقية من 64GB إلى 256GB أو 512GB بأقراص NAND أصلية سريعة",
        priceStartingFrom: 45,
        estimatedTime: "24 ساعة",
      },
    ],
    features: [
      "غرفة عمليات خالية من الغبار (Clean Room)",
      "كفالة 60 يوماً على صيانة البورد",
      "استلام وتوصيل VIP من باب البيت في عمان",
      "تقرير فحص فني رقمي قبل وبعد الإصلاح",
    ],
    availableStockSnippet: {
      phonesForSaleCount: 6,
      boardsCount: 12,
    },
    googleMapsUrl: "https://maps.google.com/?q=Amman+Sweifieh",
    bio: "المختبر الرائد في الصويفية للإصلاحات الدقيقة للأجهزة الفاخرة. نمتلك أحدث ماكينات شبلنة الليزر ومبرمجات JCID المتطورة لأجهزة الآيفون والآيباد.",
  },
  {
    id: "center-aqaba-port",
    name: "مركز ثغر الأردن للصيانة السريعة",
    ownerName: "المهندس عمر ياسين",
    leadTechTitle: "فني أجهزة أندرويد وآيفون",
    logo: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=200&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80",
    city: "العقبة",
    area: "وسط البلد",
    address: "العقبة - شارع السعادة - قرب دوار الشريف الحسين",
    phone: "0770112244",
    whatsapp: "0770112244",
    rating: 4.8,
    reviewCount: 74,
    isVerified: true,
    isOpenNow: false,
    workingHours: "10:00 ص - 02:00 م | 05:00 م - 11:00 م",
    specialties: [
      "صيانة الأجهزة المتعرضة للماء المالح",
      "تنظيف بالألتراسونيك وإزالة الصدأ",
      "تبديل شاشات أصلية",
      "شحن سريع لزوار وسياح العقبة",
    ],
    services: [
      {
        title: "إنعاش الأجهزة الغارقة في مياه البحر",
        description: "تفكيك فوري، حمام ألتراسونيك بمواد متخصصة، وعزل خطوط التماس",
        priceStartingFrom: 20,
        estimatedTime: "خلال 6 ساعات",
      },
    ],
    features: [
      "خدمة طوارئ للأجهزة المغمورة بالماء",
      "كفالة رسمية لجميع قطع الغيار",
      "موقع استراتيجي وسط العقبة",
    ],
    availableStockSnippet: {
      phonesForSaleCount: 9,
      boardsCount: 15,
    },
    googleMapsUrl: "https://maps.google.com/?q=Aqaba+Center",
    bio: "المركز الأول في مدينة العقبة المتخصص في معالجة أضرار المياه والصدأ وتوفير قطع الغيار الأصلية لسكان وزوار المدينة الساحلية.",
  },
  {
    id: "center-salt-classic",
    name: "ورشة القلعة لصيانة الهواتف",
    ownerName: "فراس العطيات",
    leadTechTitle: "فني صيانة شامل - هاردوير وسوفتوير",
    logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    city: "السلط",
    area: "الميدان",
    address: "السلط - شارع الميدان - مجمع البلدية التجاري",
    phone: "0788776655",
    whatsapp: "0788776655",
    rating: 4.9,
    reviewCount: 62,
    isVerified: true,
    isOpenNow: true,
    workingHours: "09:00 ص - 09:00 م",
    specialties: [
      "صيانة جميع أنواع الأجهزة",
      "حل مشاكل الصوت والمايك والسماعة",
      "تغيير أزرار الباور والشحن",
      "شاشات أصلية وبدائل اقتصادية",
    ],
    services: [
      {
        title: "إصلاح عيوب الصوت والاتصال (Speaker / Mic)",
        description: "فحص مسارات الأوديو كوديك وتبديل فلاتات المايكروفون والسماعات الأصلية",
        priceStartingFrom: 8,
        estimatedTime: "40 دقيقة",
      },
    ],
    features: [
      "أمانة ودقة في المواعيد",
      "أسعار تنافسية ومناسبة",
      "كفالة شهر كامل على أي عملية صيانة",
    ],
    availableStockSnippet: {
      phonesForSaleCount: 7,
      boardsCount: 10,
    },
    googleMapsUrl: "https://maps.google.com/?q=Salt+Al+Midan",
    bio: "خدمة أهالي السلط الكرام بأعلى معايير الصيانة الشفافة. نوفر شاشات وبطاريات وقطع أصلية بأسعار مدروسة وبضمان حقيقي.",
  },
];
