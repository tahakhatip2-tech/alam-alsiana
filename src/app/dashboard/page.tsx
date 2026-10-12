"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserSession {
  id: string;
  name: string;
  phone: string;
  role: "TECH" | "TRADER" | "CUSTOMER" | "ADMIN";
  city: string;
  shopName?: string;
}

interface ListingItem {
  id: string;
  title: string;
  category: string;
  brand: string;
  model: string;
  priceJOD: number;
  city: string;
  condition: string;
  battery?: number;
  storage?: string;
  status: string;
  views: number;
  createdAt: string;
}

export default function UserDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [myListings, setMyListings] = useState<ListingItem[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Listing Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("USED_PHONE");
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("");
  const [priceJOD, setPriceJOD] = useState("");
  const [condition, setCondition] = useState("مستعمل نظيف جداً 95%");
  const [battery, setBattery] = useState("88");
  const [storage, setStorage] = useState("128GB");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("alam_user");
    if (!saved) {
      // Default demo session if not logged in
      const defaultUser: UserSession = {
        id: "demo-user",
        name: "فني ومستخدم المنصة",
        phone: "0790001122",
        role: "TECH",
        city: "عمان",
      };
      setUser(defaultUser);
      fetchUserListings(defaultUser.id);
    } else {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        fetchUserListings(parsed.id);
      } catch {
        // fallback
      }
    }
  }, []);

  const fetchUserListings = async (userId: string) => {
    setLoadingListings(true);
    try {
      const res = await fetch(`/api/listings?userId=${userId}`);
      const data = await res.json();
      if (data.data) setMyListings(data.data);
    } catch {
      // fallback
    } finally {
      setLoadingListings(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceJOD) {
      alert("الرجاء ملء عنوان الإعلان والسعر");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          title,
          category,
          brand,
          model: model || title,
          priceJOD: Number(priceJOD),
          city: user?.city || "عمان",
          description,
          condition,
          battery: battery ? Number(battery) : undefined,
          storage,
          contactPhone: user?.phone || "0790001122",
          whatsapp: user?.phone || "0790001122",
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setTitle("");
        setModel("");
        setPriceJOD("");
        setDescription("");
        if (user?.id) fetchUserListings(user.id);
      } else {
        alert("فشل نشر الإعلان، يرجى المحاولة مرة أخرى");
      }
    } catch {
      alert("حدث خطأ في الاتصال");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("alam_user");
    router.push("/auth/login");
  };

  const roleBadge = (r?: string) => {
    switch (r) {
      case "TRADER":
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/40 px-2.5 py-0.5 rounded-full text-xs font-black">🏬 تاجر معتمد</span>;
      case "CUSTOMER":
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-xs font-black">👤 مستخدم عادي</span>;
      default:
        return <span className="bg-[#FFC400]/20 text-[#FFC400] border border-[#FFC400]/40 px-2.5 py-0.5 rounded-full text-xs font-black">🛠️ فني صيانة محترف</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 flex-1 w-full">
      {/* User Hero Banner */}
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black border border-[#FFC400]/40 p-2 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(255,196,0,0.2)]">
            {user?.role === "TRADER" ? "🏬" : user?.role === "CUSTOMER" ? "👤" : "🛠️"}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name}</h1>
              {roleBadge(user?.role)}
            </div>
            <p className="text-xs text-neutral-400 flex items-center gap-3">
              <span>📍 {user?.city}</span>
              <span>•</span>
              <span className="font-mono text-neutral-300">📱 {user?.phone}</span>
              {user?.shopName && (
                <>
                  <span>•</span>
                  <span className="text-[#FFC400] font-bold">معرض: {user.shopName}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 z-10">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FFC400] to-[#E0AC00] text-black font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.3)] flex items-center gap-1.5"
          >
            <span>+ إضافة إعلان بيع جديد</span>
            <span>📱</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-2xl bg-neutral-900 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 border border-neutral-800 hover:border-rose-500/30 text-xs font-bold transition-colors"
          >
            خروج 🚪
          </button>
        </div>
      </div>

      {/* Role-Specific Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {user?.role === "CUSTOMER" ? (
          <>
            <Link
              href="/track"
              className="bg-[#121212] border border-[#262626] hover:border-emerald-500/40 p-5 rounded-2xl transition-all space-y-1 block group"
            >
              <span className="text-2xl block mb-2">🔍</span>
              <h3 className="font-black text-white text-sm group-hover:text-emerald-400 transition-colors">
                تتبع جهازي في الصيانة
              </h3>
              <p className="text-[11px] text-neutral-400">تابع مرحلة الفحص والإصلاح وسند الاستلام</p>
            </Link>

            <Link
              href="/chat"
              className="bg-[#121212] border border-[#262626] hover:border-amber-500/40 p-5 rounded-2xl transition-all space-y-1 block group"
            >
              <span className="text-2xl block mb-2">💬</span>
              <h3 className="font-black text-white text-sm group-hover:text-amber-400 transition-colors">
                المحادثات وصفقات البيع
              </h3>
              <p className="text-[11px] text-neutral-400">تواصل مباشر مع المشترين وأصحاب المحلات</p>
            </Link>

            <Link
              href="/market"
              className="bg-[#121212] border border-[#262626] hover:border-[#FFC400]/40 p-5 rounded-2xl transition-all space-y-1 block group"
            >
              <span className="text-2xl block mb-2">🛒</span>
              <h3 className="font-black text-white text-sm group-hover:text-[#FFC400] transition-colors">
                تصفح سوق الهواتف
              </h3>
              <p className="text-[11px] text-neutral-400">عروض الهواتف المستعملة والجديدة في الأردن</p>
            </Link>
          </>
        ) : user?.role === "TRADER" ? (
          <>
            <Link
              href="/market"
              className="bg-[#121212] border border-[#262626] hover:border-blue-500/40 p-5 rounded-2xl transition-all space-y-1 block group"
            >
              <span className="text-2xl block mb-2">🏬</span>
              <h3 className="font-black text-white text-sm group-hover:text-blue-400 transition-colors">
                سوق الأجهزة والقطع
              </h3>
              <p className="text-[11px] text-neutral-400">بيع أجهزة جديدة ومستعملة وبكجات صيانة</p>
            </Link>

            <Link
              href="/pricing"
              className="bg-[#121212] border border-[#262626] hover:border-[#FFC400]/40 p-5 rounded-2xl transition-all space-y-1 block group"
            >
              <span className="text-2xl block mb-2">💰</span>
              <h3 className="font-black text-white text-sm group-hover:text-[#FFC400] transition-colors">
                دكتور الأسعار (JOD)
              </h3>
              <p className="text-[11px] text-neutral-400">تسعيرة شاشات وقطع الهواتف المعتمدة بالسوق</p>
            </Link>

            <Link
              href="/chat"
              className="bg-[#121212] border border-[#262626] hover:border-emerald-500/40 p-5 rounded-2xl transition-all space-y-1 block group"
            >
              <span className="text-2xl block mb-2">💬</span>
              <h3 className="font-black text-white text-sm group-hover:text-emerald-400 transition-colors">
                طلبات الزبائن والمحادثات
              </h3>
              <p className="text-[11px] text-neutral-400">رسائل التفاوض الخاصة بمعرضك التجاري</p>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/vault"
              className="bg-[#121212] border border-[#262626] hover:border-[#FFC400]/40 p-5 rounded-2xl transition-all space-y-1 block group"
            >
              <span className="text-2xl block mb-2">🛡️</span>
              <h3 className="font-black text-white text-sm group-hover:text-[#FFC400] transition-colors">
                خزنة وسندات الاستلام
              </h3>
              <p className="text-[11px] text-neutral-400">توثيق IMEI للأجهزة وطباعة الإيصال الحراري</p>
            </Link>

            <Link
              href="/hospital"
              className="bg-[#121212] border border-[#262626] hover:border-rose-500/40 p-5 rounded-2xl transition-all space-y-1 block group"
            >
              <span className="text-2xl block mb-2">🩺</span>
              <h3 className="font-black text-white text-sm group-hover:text-rose-400 transition-colors">
                الدكتور الذكي للأعطال
              </h3>
              <p className="text-[11px] text-neutral-400">تشخيص سحب الباور سبلاي وحلول الصيانة</p>
            </Link>

            <Link
              href="/schematic"
              className="bg-[#121212] border border-[#262626] hover:border-blue-500/40 p-5 rounded-2xl transition-all space-y-1 block group"
            >
              <span className="text-2xl block mb-2">🗺️</span>
              <h3 className="font-black text-white text-sm group-hover:text-blue-400 transition-colors">
                عارض المخططات (ZXW)
              </h3>
              <p className="text-[11px] text-neutral-400">تتبع مسارات البوردات ونقاط الفحص الحية</p>
            </Link>
          </>
        )}
      </div>

      {/* User's Listings Section */}
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>📦 إعلاناتي المعروضة للبيع</span>
              <span className="text-xs bg-[#FFC400]/20 text-[#FFC400] font-bold px-2 py-0.5 rounded-full">
                {myListings.length} إعلان
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              إدارة الأجهزة والهواتف والقطع التي قمت بعرضها في المنصة
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
          >
            + نشر جهاز للبيع
          </button>
        </div>

        {loadingListings ? (
          <div className="text-center py-12 text-neutral-500 text-xs">جارِ تحميل إعلاناتك... ⏳</div>
        ) : myListings.length === 0 ? (
          <div className="text-center py-16 bg-black/40 rounded-2xl border border-dashed border-neutral-800 space-y-3">
            <span className="text-4xl block">📱</span>
            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">ليس لديك أي إعلانات منشورة حالياً</h3>
              <p className="text-xs text-neutral-400">
                اعرض هاتفك المستعمل، جهازك الجديد، أو قطع الصيانة للبيع بضغطة زر واحدة
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#FFC400] text-black font-black text-xs hover:bg-[#E0AC00] transition-colors"
            >
              + إضافة أول إعلان الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((item) => (
              <div
                key={item.id}
                className="bg-black/60 border border-neutral-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {item.category === "USED_PHONE" ? "مستعمل" : item.category === "NEW_PHONE" ? "جديد" : "قطع غيار"}
                    </span>
                    <span className="font-mono text-sm font-black text-[#FFC400]">
                      {item.priceJOD} د.أ
                    </span>
                  </div>
                  <h4 className="font-black text-white text-sm">{item.title}</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {item.condition} {item.battery ? `• بطارية ${item.battery}%` : ""} {item.storage ? `• ${item.storage}` : ""}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>📍 {item.city}</span>
                  <span className="text-emerald-400 font-bold">معروض للبيع ✅</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add New Listing */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-3xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-black text-white text-base">إضافة جهاز أو قطعة للبيع</h3>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">نوع الإعلان:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]"
                >
                  <option value="USED_PHONE">📱 هاتف مستعمل</option>
                  <option value="NEW_PHONE">✨ هاتف جديد بالكرتونة</option>
                  <option value="SPARE_PART">⚙️ قطع غيار / شاشات</option>
                  <option value="DEAD_BOARD">🛠️ بوردة ميتة تشليح</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">عنوان الإعلان:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: iPhone 13 Pro 128GB أزرق نظيف جداً"
                  className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">السعر المطلوب (دينار أردني):</label>
                  <input
                    type="number"
                    value={priceJOD}
                    onChange={(e) => setPriceJOD(e.target.value)}
                    placeholder="السعر بالدينار"
                    className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#FFC400]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">سعة التخزين:</label>
                  <select
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]"
                  >
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">حالة ونظافة الجهاز:</label>
                  <input
                    type="text"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="مثال: 95% نظيف بدون خدوش"
                    className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">صحة البطارية (%):</label>
                  <input
                    type="number"
                    value={battery}
                    onChange={(e) => setBattery(e.target.value)}
                    placeholder="85"
                    className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white font-mono outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">تفاصيل وملاحظات إضافية:</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="الملحقات المتوفرة، الكفالة، شاحن أصلي..."
                  className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFC400] to-[#E0AC00] text-black font-black text-xs hover:scale-[1.01] active:scale-95 transition-all shadow disabled:opacity-50 mt-2"
              >
                {submitting ? "جارِ النشر... ⏳" : "نشر الإعلان فوراً بالسوق 🚀"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
