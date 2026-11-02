"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RolePickerModal from "@/components/RolePickerModal";
import {
  Stethoscope,
  Cpu,
  ShoppingBag,
  Coins,
  ShieldCheck,
  Search,
  Sliders,
  Zap,
  LogIn,
  ArrowLeft,
  Sparkles,
  Layers,
} from "lucide-react";

function HomePageInner() {
  const searchParams = useSearchParams();
  const [showRolePicker, setShowRolePicker] = useState(false);

  useEffect(() => {
    if (searchParams.get("auth") === "required") {
      setShowRolePicker(true);
    }
  }, [searchParams]);

  return (
    <>
      {showRolePicker && <RolePickerModal onClose={() => setShowRolePicker(false)} />}
      <HomeContent onOpenAuth={() => setShowRolePicker(true)} />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  );
}

function HomeContent({ onOpenAuth }: { onOpenAuth: () => void }) {
  const doors = [
    {
      href: "/hospital",
      title: "الدكتور الذكي",
      badge: "القلب النابض",
      subtitle: "AI Doctor - تشخيص فوري لسحبات الباور سبلاي",
      desc: "اكتب سحبة الباور للموديل (مثل 0.80->0) واعرف فوراً الآيسي التالف، نسبة النجاح، ونقطة الفحص بالعامية الأردنية.",
      icon: <Stethoscope className="w-8 h-8 text-[#FFC400]" />,
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
      icon: <Cpu className="w-8 h-8 text-blue-400" />,
      color: "from-blue-500/20 to-blue-900/10",
      border: "border-blue-500/30",
      accent: "text-blue-400",
    },
    {
      href: "/market",
      title: "السوق ومطلوب بوردة",
      badge: "بيع، شراء، وطلبات",
      subtitle: "The Market & Bounties - اللوحات الميتة",
      desc: "بيع وشراء بوردات ميتة أو اطلب بوردة معينة تبحث عنها. فلترة حسب المدينة مع احتساب عمولة 15% والتواصل عبر واتساب فوراً.",
      icon: <ShoppingBag className="w-8 h-8 text-emerald-400" />,
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
      icon: <Coins className="w-8 h-8 text-purple-400" />,
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
      icon: <ShieldCheck className="w-8 h-8 text-rose-400" />,
      color: "from-rose-500/20 to-rose-900/10",
      border: "border-rose-500/30",
      accent: "text-rose-400",
    },
    {
      href: "/track",
      title: "استعلام وتتبع الهاتف",
      badge: "خاص بالزبائن",
      subtitle: "Device Tracker - متابعة حالة الصيانة",
      desc: "استعلم برقم السند أو رقم IMEI لمعرفة أين وصل هاتفك في الفحص، القطع المستبدلة، وموعد جاهزيته للاستلام فوراً.",
      icon: <Search className="w-8 h-8 text-teal-400" />,
      color: "from-teal-500/20 to-emerald-900/10",
      border: "border-teal-500/30",
      accent: "text-teal-400",
    },
    {
      href: "/tools",
      title: "صندوق عدة الفني",
      badge: "ميزة جديدة",
      subtitle: "Benchtop Tools - بدائل الآيسيات وحقن الشورت",
      desc: "محول بدائل الآيسيات بين بوردات التشليح المختلفة (S2MU106X01، PM6125...) وحاسبة أقصى أمبير آمن لحقن الفولت.",
      icon: <Sliders className="w-8 h-8 text-cyan-400" />,
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
            <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
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
              href="/track"
              className="px-6 py-3 rounded-xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.45)] hover:scale-105 flex items-center gap-2"
            >
              <span>استعلام عن حالة هاتفك</span>
              <Search className="w-4 h-4" />
            </Link>
            <Link
              href="/hospital"
              className="px-6 py-3 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(255,196,0,0.2)] hover:shadow-[0_0_30px_rgba(255,196,0,0.45)] hover:scale-105 flex items-center gap-2"
            >
              <span>الدكتور الذكي</span>
              <Stethoscope className="w-4 h-4" />
            </Link>
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 rounded-xl border-2 border-neutral-700 bg-neutral-900/60 text-neutral-300 font-bold text-sm hover:border-[#FFC400] hover:text-[#FFC400] hover:bg-[#FFC400]/10 transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>دخول / حساب جديد</span>
            </button>
          </div>
        </div>
      </section>

      {/* The Doors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#FFC400]" />
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
                  <div className="p-2.5 rounded-xl bg-black/50 border border-white/5">
                    {door.icon}
                  </div>
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
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
