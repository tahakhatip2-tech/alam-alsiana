"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, clearSession, isMaintenanceRole, UserSession } from "@/lib/auth";
import RolePickerModal from "@/components/RolePickerModal";
import {
  Search,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  Cpu,
  Sliders,
  Coins,
  Store,
  Plus,
  LogOut,
  Package,
  Eye,
  CheckCircle2,
  MapPin,
  User,
  Phone,
  Wrench,
  ArrowLeft,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";

interface ListingItem {
  id: string;
  title: string;
  category: string;
  priceJOD: number;
  city: string;
  condition: string;
  battery?: number;
  storage?: string;
  status: string;
  views: number;
  createdAt: string;
}

// ── Stat Card ──────────────────────────────────────
function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string | number; accent: string }) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>{icon}</div>
      <div>
        <p className="text-xs text-neutral-400">{label}</p>
        <p className="font-black text-white text-base">{value}</p>
      </div>
    </div>
  );
}

// ── Customer Dashboard ─────────────────────────────
function CustomerDashboard({ user, onLogout }: { user: UserSession; onLogout: () => void }) {
  const router = useRouter();
  const [quickImei, setQuickImei] = useState("");

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickImei.trim()) {
      router.push(`/track?imei=${encodeURIComponent(quickImei.trim())}`);
    } else {
      router.push("/track");
    }
  };

  const quickLinks = [
    { href: "/track", icon: <Search className="w-6 h-6 text-emerald-400" />, title: "الاستعلام عن هاتفي في الصيانة", desc: "تابع مرحلة الفحص والإصلاح وجاهزية الاستلام", color: "hover:border-emerald-500/50 hover:bg-emerald-500/5 text-emerald-400", badge: "مهم جداً" },
    { href: "/market", icon: <ShoppingBag className="w-6 h-6 text-[#FFC400]" />, title: "سوق الهواتف المستعملة والجديدة", desc: "تصفح وبيع وشراء الأجهزة بدون عمولات معقدة", color: "hover:border-amber-500/50 hover:bg-amber-500/5 text-[#FFC400]", badge: "عروض الأردن" },
    { href: "/chat", icon: <MessageSquare className="w-6 h-6 text-blue-400" />, title: "المحادثات وصفقات البيع", desc: "تواصل مباشر مع المشترين وأصحاب المحلات", color: "hover:border-blue-500/50 hover:bg-blue-500/5 text-blue-400", badge: "مباشر" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black text-white">{user.name}</h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>مستخدم عادي</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 flex items-center gap-2">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-neutral-500" /> {user.city}</span>
              <span>•</span>
              <span className="font-mono flex items-center gap-1"><Phone className="w-3 h-3 text-neutral-500" /> {user.phone}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-500/30 text-xs font-bold transition-colors self-start sm:self-auto flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>خروج</span>
        </button>
      </div>

      {/* Quick Search for Phone Repair */}
      <div className="bg-[#121212] border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5">
          <Search className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-black text-white">الاستعلام المباشر عن هاتفك</h2>
            <p className="text-[11px] text-neutral-400">أدخل رقم السند المطبوع على الوصل أو رقم الـ IMEI لمتابعة جهازك فوراً</p>
          </div>
        </div>
        <form onSubmit={handleQuickTrack} className="flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="text"
            value={quickImei}
            onChange={(e) => setQuickImei(e.target.value)}
            placeholder="مثال: vlt-001 أو رقم الـ IMEI المكوّن من 15 رقماً..."
            className="flex-1 bg-black border border-neutral-800 focus:border-emerald-500 rounded-2xl px-4 py-3 text-white placeholder-neutral-600 font-mono text-xs outline-none transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-black text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>استعلام عن الجهاز</span>
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-sm font-black text-neutral-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFC400]" />
          <span>خدمات المستخدم</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`bg-[#121212] border border-[#262626] p-5 rounded-2xl transition-all space-y-2 block group ${link.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0">{link.icon}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
                  {link.badge}
                </span>
              </div>
              <h3 className="font-black text-white text-sm">{link.title}</h3>
              <p className="text-[11px] text-neutral-400">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner about maintenance features */}
      <div className="bg-[#0E0E0E] border border-dashed border-[#2A2A2A] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="p-3 rounded-2xl bg-[#FFC400]/10 border border-[#FFC400]/20 text-[#FFC400]">
          <Wrench className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center sm:text-right">
          <p className="text-xs font-black text-white mb-1">هل تملك ورشة صيانة أو محلاً؟</p>
          <p className="text-[11px] text-neutral-400">سجّل كمركز صيانة للوصول إلى أدوات التشخيص، الخزنة، وعارض المخططات.</p>
        </div>
        <Link
          href="/auth/register?role=tech"
          className="px-4 py-2 rounded-xl bg-[#FFC400]/15 text-[#FFC400] border border-[#FFC400]/30 text-xs font-black hover:bg-[#FFC400]/25 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <span>تسجيل كمركز صيانة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ── Maintenance Dashboard ──────────────────────────
function MaintenanceDashboard({
  user,
  myListings,
  loadingListings,
  onLogout,
  onAddListing,
}: {
  user: UserSession;
  myListings: ListingItem[];
  loadingListings: boolean;
  onLogout: () => void;
  onAddListing: () => void;
}) {
  const techLinks = [
    { href: "/vault", icon: <ShieldCheck className="w-6 h-6 text-rose-400" />, title: "خزنة وسندات الاستلام", desc: "توثيق IMEI وطباعة إيصالات QR", accent: "hover:border-[#FFC400]/40 group-hover:text-[#FFC400]" },
    { href: "/hospital", icon: <Stethoscope className="w-6 h-6 text-amber-400" />, title: "تشخيص الأعطال", desc: "تشخيص سحبات الباور سبلاي", accent: "hover:border-rose-500/40 group-hover:text-rose-400" },
    { href: "/schematic", icon: <Cpu className="w-6 h-6 text-blue-400" />, title: "عارض المخططات (ZXW)", desc: "تتبع مسارات البوردات ونقاط الفحص", accent: "hover:border-blue-500/40 group-hover:text-blue-400" },
    { href: "/tools", icon: <Sliders className="w-6 h-6 text-cyan-400" />, title: "صندوق العدة والبدائل", desc: "حاسبة الحقن وبدائل الآيسيات", accent: "hover:border-cyan-500/40 group-hover:text-cyan-400" },
    { href: "/pricing", icon: <Coins className="w-6 h-6 text-[#FFC400]" />, title: "دكتور الأسعار", desc: "تسعير الشاشات وقطع الهواتف", accent: "hover:border-purple-500/40 group-hover:text-purple-400" },
    { href: "/market", icon: <ShoppingBag className="w-6 h-6 text-emerald-400" />, title: "السوق والبوردات الميتة", desc: "بيع وشراء البوردات والقطع", accent: "hover:border-emerald-500/40 group-hover:text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC400]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FFC400]/15 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400] shadow-[0_0_25px_rgba(255,196,0,0.2)]">
            {user.role === "TRADER" ? <Store className="w-8 h-8" /> : <Wrench className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
              <span className="bg-[#FFC400]/20 text-[#FFC400] border border-[#FFC400]/40 px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1">
                {user.role === "TRADER" ? <Store className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                <span>{user.role === "TRADER" ? "تاجر معتمد" : "فني صيانة محترف"}</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 flex items-center gap-3">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-neutral-500" /> {user.city}</span>
              <span>•</span>
              <span className="font-mono text-neutral-300 flex items-center gap-1"><Phone className="w-3 h-3 text-neutral-500" /> {user.phone}</span>
              {user.shopName && (
                <>
                  <span>•</span>
                  <span className="text-[#FFC400] font-bold">معرض: {user.shopName}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 z-10">
          <button
            onClick={onAddListing}
            className="px-5 py-3 rounded-2xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة إعلان بيع</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Package className="w-5 h-5 text-[#FFC400]" />} label="إعلاناتي" value={myListings.length} accent="bg-[#FFC400]/15" />
        <StatCard icon={<Eye className="w-5 h-5 text-blue-400" />} label="إجمالي المشاهدات" value={myListings.reduce((a, b) => a + (b.views || 0), 0)} accent="bg-blue-500/15" />
        <StatCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} label="إعلانات نشطة" value={myListings.filter(l => l.status === "ACTIVE").length} accent="bg-emerald-500/15" />
        <StatCard icon={<MapPin className="w-5 h-5 text-purple-400" />} label="مدينتك" value={user.city} accent="bg-purple-500/15" />
      </div>

      {/* Tool Grid */}
      <div>
        <h2 className="text-sm font-black text-neutral-300 mb-3 flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[#FFC400]" />
          <span>أدوات ورشتك الاحترافية</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group bg-[#121212] border border-[#262626] p-5 rounded-2xl transition-all space-y-2 block ${link.accent}`}
            >
              <div className="p-2 rounded-xl bg-white/5 border border-white/5 shrink-0 inline-block">{link.icon}</div>
              <h3 className="font-black text-white text-sm transition-colors">{link.title}</h3>
              <p className="text-[11px] text-neutral-400">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-[#FFC400]" />
              <span>إعلاناتي المعروضة</span>
              <span className="text-xs bg-[#FFC400]/20 text-[#FFC400] font-bold px-2 py-0.5 rounded-full">
                {myListings.length} إعلان
              </span>
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">الأجهزة والقطع التي عرضتها في السوق</p>
          </div>
          <button onClick={onAddListing} className="px-4 py-2 rounded-xl border border-neutral-700 bg-transparent hover:border-[#FFC400] text-neutral-300 hover:text-[#FFC400] font-bold text-xs transition-colors flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>نشر إعلان جديد</span>
          </button>
        </div>

        {loadingListings ? (
          <div className="text-center py-10 text-neutral-500 text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>جارِ تحميل إعلاناتك...</span>
          </div>
        ) : myListings.length === 0 ? (
          <div className="text-center py-12 bg-black/40 rounded-2xl border border-dashed border-neutral-800 space-y-3">
            <Package className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-bold text-white text-sm">لا توجد إعلانات منشورة حالياً</h3>
            <p className="text-xs text-neutral-400">اعرض بوردة أو قطعة للبيع بضغطة زر واحدة</p>
            <button onClick={onAddListing} className="px-5 py-2.5 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs transition-all shadow-[0_0_15px_rgba(255,196,0,0.2)] inline-flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              <span>إضافة أول إعلان الآن</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((item) => (
              <div key={item.id} className="bg-black/60 border border-neutral-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.category === "USED_PHONE" ? "مستعمل" : item.category === "NEW_PHONE" ? "جديد" : item.category === "DEAD_BOARD" ? "بوردة تشليح" : "قطع غيار"}
                    </span>
                    <span className="font-mono text-sm font-black text-[#FFC400]">{item.priceJOD} د.أ</span>
                  </div>
                  <h4 className="font-black text-white text-sm">{item.title}</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {item.condition} {item.battery ? `• بطارية ${item.battery}%` : ""} {item.storage ? `• ${item.storage}` : ""}
                  </p>
                </div>
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.city}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> معروض</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add Listing Modal ──────────────────────────────
function AddListingModal({ user, onClose, onSuccess }: { user: UserSession; onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("USED_PHONE");
  const [priceJOD, setPriceJOD] = useState("");
  const [condition, setCondition] = useState("مستعمل نظيف جداً 95%");
  const [battery, setBattery] = useState("88");
  const [storage, setStorage] = useState("128GB");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceJOD) { alert("الرجاء ملء العنوان والسعر"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id, title, category,
          brand: "غير محدد", model: title,
          priceJOD: Number(priceJOD), city: user.city,
          description, condition,
          battery: battery ? Number(battery) : undefined,
          storage, contactPhone: user.phone, whatsapp: user.phone,
        }),
      });
      if (res.ok) { onClose(); onSuccess(); }
      else alert("فشل نشر الإعلان، يرجى المحاولة مرة أخرى");
    } catch { alert("حدث خطأ في الاتصال"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#2B2B2B] rounded-3xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-black text-white text-base">إضافة جهاز أو قطعة للبيع</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-300 font-bold mb-1">نوع الإعلان:</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]">
              <option value="USED_PHONE">هاتف مستعمل</option>
              <option value="NEW_PHONE">هاتف جديد بالكرتونة</option>
              <option value="SPARE_PART">قطع غيار / شاشات</option>
              <option value="DEAD_BOARD">بوردة ميتة تشليح</option>
            </select>
          </div>
          <div>
            <label className="block text-neutral-300 font-bold mb-1">عنوان الإعلان:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: iPhone 13 Pro 128GB أزرق نظيف جداً" className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">السعر (دينار أردني):</label>
              <input type="number" value={priceJOD} onChange={(e) => setPriceJOD(e.target.value)} placeholder="السعر" className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#FFC400]" />
            </div>
            <div>
              <label className="block text-neutral-300 font-bold mb-1">سعة التخزين:</label>
              <select value={storage} onChange={(e) => setStorage(e.target.value)} className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]">
                {["64GB", "128GB", "256GB", "512GB", "1TB"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">حالة الجهاز:</label>
              <input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]" />
            </div>
            <div>
              <label className="block text-neutral-300 font-bold mb-1">صحة البطارية (%):</label>
              <input type="number" value={battery} onChange={(e) => setBattery(e.target.value)} className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#FFC400]" />
            </div>
          </div>
          <div>
            <label className="block text-neutral-300 font-bold mb-1">ملاحظات إضافية:</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="الملحقات، الكفالة، شاحن أصلي..." className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]" />
          </div>
          <button type="submit" disabled={submitting} className="w-full py-3 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-xs hover:scale-[1.01] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /><span>جارِ النشر...</span></> : <><Plus className="w-4 h-4" /><span>نشر الإعلان فوراً بالسوق</span></>}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Not logged in state ────────────────────────────
function GuestDashboard({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#121212] border border-[#262626] rounded-3xl p-10 text-center space-y-6 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-black border border-[#FFC400]/40 p-2 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(255,196,0,0.3)]">
          <img src="/logo.png" alt="عالم الصيانة" className="w-full h-full object-contain" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">أهلاً بك!</h2>
          <p className="text-sm text-neutral-400">سجّل دخولك للوصول إلى لوحة تحكمك المخصصة</p>
        </div>
        <button
          onClick={onLogin}
          className="w-full py-4 rounded-2xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)]"
        >
          تسجيل الدخول أو إنشاء حساب
        </button>
      </div>
    </div>
  );
}

// ── Main Dashboard Page ────────────────────────────
function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [user, setUser] = useState<UserSession | null | "loading">("loading");
  const [myListings, setMyListings] = useState<ListingItem[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRolePicker, setShowRolePicker] = useState(false);

  useEffect(() => {
    const session = getSession();
    setUser(session);
    if (session) fetchUserListings(session.id);

    if (searchParams.get("auth") === "required" && !session) {
      setShowRolePicker(true);
    }
  }, [searchParams]);

  const fetchUserListings = async (userId: string) => {
    setLoadingListings(true);
    try {
      const res = await fetch(`/api/listings?userId=${userId}`);
      const data = await res.json();
      if (data.data) setMyListings(data.data);
    } catch { /* fallback */ }
    finally { setLoadingListings(false); }
  };

  const handleLogout = useCallback(() => {
    clearSession();
    setUser(null);
    router.push("/");
  }, [router]);

  if (user === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <Loader2 className="w-8 h-8 text-[#FFC400] animate-spin" />
          <span className="text-xs font-bold">جارِ تحميل لوحة التحكم...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
      {!user ? (
        <GuestDashboard onLogin={() => setShowRolePicker(true)} />
      ) : isMaintenanceRole(user.role) ? (
        <MaintenanceDashboard
          user={user}
          myListings={myListings}
          loadingListings={loadingListings}
          onLogout={handleLogout}
          onAddListing={() => setShowAddModal(true)}
        />
      ) : (
        <CustomerDashboard user={user} onLogout={handleLogout} />
      )}

      {showAddModal && user && (
        <AddListingModal
          user={user}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => user && fetchUserListings(user.id)}
        />
      )}

      {showRolePicker && (
        <RolePickerModal onClose={() => setShowRolePicker(false)} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FFC400] animate-spin" />
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}
