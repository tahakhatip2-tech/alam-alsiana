"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone) {
      setError("يرجى إدخال رقم الهاتف المسجل");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "رقم الهاتف غير مسجل");
      } else {
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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 max-w-md mx-auto w-full">
      <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-black border border-[#FFC400]/40 p-1 mx-auto flex items-center justify-center shadow-[0_0_20px_rgba(255,196,0,0.3)]">
            <img src="/logo.png" alt="عالم الصيانة" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-white">تسجيل الدخول</h1>
          <p className="text-xs text-neutral-400">ادخل رقم هاتفك للوصول إلى لوحة تحكمك</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-bold mb-1.5">رقم الهاتف المسجل:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="079XXXXXXX"
              className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-3 text-white placeholder-neutral-500 font-mono outline-none focus:border-[#FFC400]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFC400] to-[#E0AC00] text-black font-black text-sm hover:scale-[1.01] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,196,0,0.3)] disabled:opacity-50 mt-2"
          >
            {loading ? "جارِ الدخول... ⏳" : "دخول إلى لوحة التحكم 🚀"}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-400 pt-2 border-t border-neutral-800">
          ليس لديك حساب بعد؟{" "}
          <Link href="/auth/register" className="text-[#FFC400] font-bold hover:underline">
            أنشئ حساباً جديداً مجاناً
          </Link>
        </div>
      </div>
    </div>
  );
}
