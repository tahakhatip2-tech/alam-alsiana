import Link from "next/link";

export default function HomePage() {
  const doors = [
    {
      href: "/hospital",
      title: "الدكتور الذكي",
      badge: "القلب النابض",
      subtitle: "AI Doctor - تشخيص فوري لسحبات الباور سبلاي",
      desc: "اكتب سحبة الباور للموديل (مثل 0.80->0) واعرف فوراً الآيسي التالف، نسبة النجاح، ونقطة الفحص بالعامية الأردنية.",
      icon: "🩺",
      color: "from-amber-500/20 to-amber-900/10",
      border: "border-amber-500/30",
      accent: "text-[#FFC400]",
    },
    {
      href: "/schematic",
      title: "عارض اللوحات الذكي",
      badge: "ZXW Killer",
      subtitle: "Smart Schematic & Interactive PCB Viewer",
      desc: "تكبير، تحريك، وتتبع مسارات الشحن والتغذية (VBUS، IF PMIC) فوق صور اللوحات الحقيقية مع نقاط فحص تفاعلية.",
      icon: "🗺️",
      color: "from-blue-500/20 to-blue-900/10",
      border: "border-blue-500/30",
      accent: "text-blue-400",
    },
    {
      href: "/market",
      title: "سوق الدراج ومطلوب بوردة",
      badge: "بيع، شراء، وطلبات",
      subtitle: "Souq Al-Daraj & Bounties - اللوحات الميتة",
      desc: "بيع وشراء بوردات ميتة أو اطلب بوردة معينة تبحث عنها. فلترة حسب المدينة مع احتساب عمولة 15% والتواصل عبر واتساب فوراً.",
      icon: "🛒",
      color: "from-emerald-500/20 to-emerald-900/10",
      border: "border-emerald-500/30",
      accent: "text-emerald-400",
    },
    {
      href: "/pricing",
      title: "دكتور الأسعار",
      badge: "حاسبة الربح والأجور",
      subtitle: "Price Doctor - تسعير قطع الهواتف في الأردن",
      desc: "جدول أسعار الشراء والبيع وهامش الربح المقترح (+7 دنانير) وتنبيه تلقائي إذا كان سعرك أقل من متوسط السوق.",
      icon: "💰",
      color: "from-purple-500/20 to-purple-900/10",
      border: "border-purple-500/30",
      accent: "text-purple-400",
    },
    {
      href: "/vault",
      title: "خزنة الزبائن والسندات",
      badge: "طباعة حرارية + QR",
      subtitle: "Customer Vault & Thermal Receipts",
      desc: "وثّق حالة الجهاز برقم الـ IMEI مع إصدار سند استلام ورشة فوري لطابعات الفواتير أو PDF ومزود بـ QR كود لتتبع الزبون.",
      icon: "🛡️",
      color: "from-rose-500/20 to-rose-900/10",
      border: "border-rose-500/30",
      accent: "text-rose-400",
    },
    {
      href: "/tools",
      title: "صندوق عدة الفني",
      badge: "ميزة جديدة ⚡",
      subtitle: "Benchtop Tools - بدائل الآيسيات وحقن الشورت",
      desc: "محول بدائل الآيسيات بين بوردات التشليح المختلفة (S2MU106X01، PM6125...) وحاسبة أقصى أمبير آمن لحقن الفولت.",
      icon: "🧰",
      color: "from-cyan-500/20 to-cyan-900/10",
      border: "border-cyan-500/30",
      accent: "text-cyan-400",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#1C1C1C] py-14 px-4 bg-gradient-to-b from-[#141414] via-[#0E0E0E] to-[#0A0A0A]">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFC400]/10 border border-[#FFC400]/25 text-[#FFC400] text-xs font-bold">
            <span>🇯🇴</span>
            <span>المنصة الشاملة والمصممة خصيصاً لفنيي صيانة الهواتف في الأردن</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            عالم الصيانة
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-l from-[#FFC400] via-amber-300 to-yellow-500">
              منظومة هاردوير متكاملة على طاولة الفني
            </span>
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            تشخيص فوري لسحبات الباور سبلاي، عارض لوحات تفاعلي، طباعة سندات استلام حرارية برمز QR،
            بدائل الآيسيات وبوردات التشليح، وحاسبة حقن الشورت الآمن.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/hospital"
              className="px-6 py-3 rounded-xl bg-[#FFC400] text-black font-extrabold text-sm hover:bg-[#E0AC00] transition-all shadow-[0_0_25px_rgba(255,196,0,0.3)] hover:scale-105"
            >
              افتح الدكتور الذكي الآن 🩺
            </Link>
            <Link
              href="/vault"
              className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-bold text-sm hover:bg-neutral-800 transition-colors"
            >
              طباعة سند استلام لجهاز 🖨️
            </Link>
          </div>
        </div>
      </section>

      {/* The Doors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <span>🚪</span>
              <span>أقسام ومنظومة التطبيق</span>
            </h2>
            <p className="text-neutral-400 text-xs mt-1">
              اختر القسم المطلوب للبدء فوراً دون أي تعقيدات
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doors.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className={`group relative rounded-2xl p-6 bg-gradient-to-br ${door.color} bg-[#111111] border ${door.border} hover:border-[#FFC400]/60 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-4xl p-2 rounded-xl bg-black/40 border border-white/5">
                    {door.icon}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                    {door.badge}
                  </span>
                </div>

                <h3 className={`text-xl font-black mb-1 ${door.accent} group-hover:text-white transition-colors`}>
                  {door.title}
                </h3>
                <p className="text-xs font-semibold text-neutral-300 mb-3">
                  {door.subtitle}
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {door.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-neutral-300 group-hover:text-[#FFC400]">
                <span>دخول القسم</span>
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
