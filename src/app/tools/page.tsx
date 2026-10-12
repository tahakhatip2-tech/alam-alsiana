"use client";

import { useState, useEffect } from "react";
import { ICReplacement } from "@/lib/ic-database";

export default function ToolsPage() {
  // Tabs: "ic" for IC Cross-Reference, "injector" for Safe Short Injector
  const [activeTab, setActiveTab] = useState<"ic" | "injector">("ic");

  // IC Search State
  const [icQuery, setIcQuery] = useState("");
  const [icList, setIcList] = useState<ICReplacement[]>([]);
  const [loadingIc, setLoadingIc] = useState(false);

  // Safe Short Injector State
  const [injectVoltage, setInjectVoltage] = useState("3.8");
  const [injectResistance, setInjectResistance] = useState("1.5");
  const [injectorResult, setInjectorResult] = useState<{
    currentAmps: number;
    powerWatts: number;
    riskLevelAr: string;
    recommendedLimitAmps: number;
    adviceAr: string;
  } | null>(null);

  // Quick IC filter options
  const popularICs = ["S2MU106X01", "MT6358W", "PM6125", "PM6225", "MT6371P", "SM3010"];

  useEffect(() => {
    fetchICs();
    calculateInjector(3.8, 1.5);
  }, []);

  const fetchICs = async (query = "") => {
    setLoadingIc(true);
    try {
      const res = await fetch(`/api/tools?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      if (json.data) setIcList(json.data);
    } catch {
      // offline fallback
    } finally {
      setLoadingIc(false);
    }
  };

  const handleSearchIC = (e: React.FormEvent) => {
    e.preventDefault();
    fetchICs(icQuery);
  };

  const calculateInjector = async (v: number, r: number) => {
    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voltage: v, resistance: r }),
      });
      const json = await res.json();
      if (json.data) setInjectorResult(json.data);
    } catch {
      // fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 flex-1 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-500/10 text-[#FFC400] text-xs font-bold mb-2">
            <span>الباب السادس 🚪</span>
            <span>Benchtop Tools</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>🧰 صندوق عدة الفني وحاسبة حقن الشورت</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            دليل بدائل الآيسيات بين بوردات التشليح + حاسبة أقصى أمبير آمن لحقن الفولت لتفادي حرق طبقات البوردة
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#141414] border border-[#2B2B2B] p-1.5 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("ic")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "ic"
                ? "bg-[#FFC400] text-black shadow"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            🔍 محول بدائل الآيسيات (IC Cross)
          </button>
          <button
            onClick={() => setActiveTab("injector")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "injector"
                ? "bg-[#FFC400] text-black shadow"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            ⚡ حاسبة حقن الشورت الآمن
          </button>
        </div>
      </div>

      {/* TAB 1: IC Cross-Reference */}
      {activeTab === "ic" && (
        <div className="space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearchIC} className="flex gap-3">
            <input
              type="text"
              value={icQuery}
              onChange={(e) => setIcQuery(e.target.value)}
              placeholder="اكتب رقم الآيسي (مثال: S2MU106X01 أو PM6125) أو اسم الموديل..."
              className="flex-1 bg-[#141414] border border-[#2B2B2B] focus:border-[#FFC400] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#FFC400] hover:bg-[#E0AC00] text-black font-black text-xs transition-colors"
            >
              بحث في البدائل 🔍
            </button>
          </form>

          {/* Popular quick tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-neutral-400 font-bold whitespace-nowrap">آيسيات شائعة:</span>
            {popularICs.map((pic) => (
              <button
                key={pic}
                onClick={() => {
                  setIcQuery(pic);
                  fetchICs(pic);
                }}
                className="bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 hover:text-[#FFC400] px-2.5 py-1 rounded-lg border border-neutral-800 transition-colors whitespace-nowrap"
              >
                {pic}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          {loadingIc ? (
            <div className="text-center py-12 text-neutral-400">جارِ البحث في قاعدة بيانات المخططات... ⏳</div>
          ) : icList.length === 0 ? (
            <div className="text-center py-16 bg-[#121212] rounded-2xl border border-[#222]">
              <span className="text-4xl block mb-2">🤔</span>
              <p className="text-sm font-bold text-white mb-1">لم نجد بدائل مطابقة لهذا الآيسي حالياً</p>
              <p className="text-xs text-neutral-400">تأكد من كتابة الرقم بدقة أو جرب كتابة اسم الموديل</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {icList.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#121212] border border-[#262626] rounded-2xl p-5 space-y-4 hover:border-[#FFC400]/40 transition-colors shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-neutral-800 pb-3">
                      <div>
                        <span className="font-mono text-base font-black text-[#FFC400]">
                          {item.icNumber}
                        </span>
                        <p className="text-xs font-semibold text-neutral-300 mt-0.5">
                          {item.functionAr}
                        </p>
                      </div>
                      <span className="text-[10px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded border border-neutral-800">
                        IC Chip
                      </span>
                    </div>

                    {/* Compatible Models */}
                    <div>
                      <span className="text-[11px] font-bold text-neutral-400 block mb-2">
                        📱 يتوفر في بوردات التشليح التالية:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.compatibleModels.map((cm, cidx) => (
                          <span
                            key={cidx}
                            className="text-[11px] bg-neutral-900 border border-neutral-800 text-emerald-400 px-2 py-1 rounded-lg font-medium"
                          >
                            ✓ {cm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="pt-3 border-t border-neutral-850">
                    <p className="text-[11px] text-amber-300/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 leading-relaxed">
                      💡 {item.notesAr}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Safe Short Injector Calculator */}
      {activeTab === "injector" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>⚡ حاسبة فولتية وأمبير حقن الشورت الآمن</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                تساعدك على تحديد أقصى أمبير تضبطه على الباور سبلاي عند حقن خط شورت، حتى تسخن القطعة التالفة (مكثف/آيسي) دون تدمير المسارات النحاسية الداخلية للوحة.
              </p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  جهد الحقن المطلوب (فولت V):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="12"
                  value={injectVoltage}
                  onChange={(e) => {
                    setInjectVoltage(e.target.value);
                    calculateInjector(Number(e.target.value), Number(injectResistance));
                  }}
                  className="w-full bg-[#181818] border border-[#333] rounded-xl p-3 text-white text-base outline-none focus:border-[#FFC400]"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  أقصى حد لخطوط البطارية 4.0V ولخطوط المعالج 1.0V-1.2V
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  مقاومة خط الشورت المقاسة (أوم Ω):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="50"
                  value={injectResistance}
                  onChange={(e) => {
                    setInjectResistance(e.target.value);
                    calculateInjector(Number(injectVoltage), Number(e.target.value));
                  }}
                  className="w-full bg-[#181818] border border-[#333] rounded-xl p-3 text-white text-base outline-none focus:border-[#FFC400]"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  قراءة الأوميتر بالمتر بين الخط المصاب والأرضي
                </span>
              </div>
            </div>

            {/* Result Box */}
            {injectorResult && (
              <div className="bg-[#171717] border border-[#2B2B2B] rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="bg-black/50 p-3 rounded-lg border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block">التيار النظري المسحوب</span>
                    <span className="text-xl font-black text-neutral-200 font-mono">
                      {injectorResult.currentAmps} A
                    </span>
                  </div>

                  <div className="bg-black/50 p-3 rounded-lg border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block">الحد الأقصى الموصى به</span>
                    <span className="text-xl font-black text-[#FFC400] font-mono">
                      {injectorResult.recommendedLimitAmps} A
                    </span>
                  </div>

                  <div className="bg-black/50 p-3 rounded-lg border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block">الطاقة المتبددة (حرارة)</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {injectorResult.powerWatts} W
                    </span>
                  </div>
                </div>

                {/* Risk & Advice */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-400">مستوى الخطورة:</span>
                    <span className="text-amber-400">{injectorResult.riskLevelAr}</span>
                  </div>
                  <p className="text-xs text-neutral-200 bg-[#202020] p-3 rounded-lg border border-neutral-700 leading-relaxed">
                    💡 <strong className="text-[#FFC400]">نصيحة المهندس:</strong> {injectorResult.adviceAr}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
