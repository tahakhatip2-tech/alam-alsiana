"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"TECH" | "TRADER" | "CUSTOMER">("TECH");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("عمان");
  const [shopName, setShopName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !phone) {
      setError("يرجى ملء الاسم ورقم الهاتف");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name,
          phone,
          role,
          city,
          shopName: role === "TRADER" ? shopName : undefined,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء إنشاء الحساب");
      } else {
        // Save user session in localStorage
        localStorage.setItem("alam_user", JSON.stringify(data.user));
        router.push("/dashboard");
      }
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 max-w-xl mx-auto w-full">
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 w-full shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC400]/15 text-[#FFC400] text-xs font-black border border-[#FFC400]/30">
            <span>انضم لمنظومة عالم الصيانة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">إنشاء حساب جديد</h1>
          <p className="text-xs text-neutral-400">
            اختر دورك المناسب للحصول على لوحة تحكم مخصصة لاحتياجاتك
          </p>
        </div>

        {/* Role Selector Cards */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-neutral-300">حدد نوع حسابك:</label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setRole("TECH")}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                role === "TECH"
                  ? "bg-[#FFC400]/15 border-[#FFC400] shadow-[0_0_15px_rgba(255,196,0,0.2)]"
                  : "bg-black/50 border-[#262626] hover:border-neutral-700"
              }`}
            >
              <span className="text-2xl block mb-1">🛠️</span>
              <div>
                <div className="font-black text-xs text-white">فني صيانة</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">خزنة + فحص + بوردات</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("TRADER")}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                role === "TRADER"
                  ? "bg-blue-500/15 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  : "bg-black/50 border-[#262626] hover:border-neutral-700"
              }`}
            >
              <span className="text-2xl block mb-1">🏬</span>
              <div>
                <div className="font-black text-xs text-white">تاجر / محل</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">متجر + جملة + جديد</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                role === "CUSTOMER"
                  ? "bg-emerald-500/15 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "bg-black/50 border-[#262626] hover:border-neutral-700"
              }`}
            >
              <span className="text-2xl block mb-1">👤</span>
              <div>
                <div className="font-black text-xs text-white">مستخدم عادي</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">بيع مستعمل + تتبع</div>
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-bold">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-bold mb-1.5">الاسم الكامل / اسم النشاط:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أحمد الخبير أو مركز المستقبل"
              className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 outline-none focus:border-[#FFC400]"
            />
          </div>

          {role === "TRADER" && (
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5">اسم المحل أو المعرض:</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="مثال: محلات النجم للخلويات"
                className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 outline-none focus:border-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-bold mb-1.5">رقم الهاتف (الواتساب):</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="079XXXXXXX"
                className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 font-mono outline-none focus:border-[#FFC400]"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1.5">المدينة / المحافظة:</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-3 text-white outline-none focus:border-[#FFC400]"
              >
                <option value="عمان">عمان</option>
                <option value="إربد">إربد</option>
                <option value="الزرقاء">الزرقاء</option>
                <option value="العقبة">العقبة</option>
                <option value="السلط">السلط</option>
                <option value="المفرق">المفرق</option>
                <option value="مأدبا">مأدبا</option>
                <option value="جرش">جرش</option>
                <option value="عجلون">عجلون</option>
                <option value="الكرك">الكرك</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-bold mb-1.5">كلمة المرور (اختياري للسرعة):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 outline-none focus:border-[#FFC400]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFC400] to-[#E0AC00] text-black font-black text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.3)] disabled:opacity-50 mt-2"
          >
            {loading ? "جارِ إنشاء الحساب... ⏳" : "تأكيد وإنشاء الحساب 🚀"}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-neutral-800">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="text-[#FFC400] font-bold hover:underline">
            تسجيل الدخول هنا
          </Link>
        </div>
      </div>
    </div>
  );
}
