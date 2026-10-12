"use client";

import { useState } from "react";
import { FAULTS_DATABASE, FaultItem } from "@/lib/faults-data";

export default function HospitalPage() {
  const [model, setModel] = useState("Galaxy A12");
  const [powerDraw, setPowerDraw] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FaultItem | null>(null);
  const [similarityNote, setSimilarityNote] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Common quick selections
  const quickDraws = [
    { label: "0.80->0 (فصل مفاجئ)", val: "0.80->0" },
    { label: "0.00->0.05 (سحبة ضعيفة)", val: "0.00->0.05" },
    { label: "Short->2.00A+ (شورت صريح)", val: "Short->2.00+" },
    { label: "0.20->0.25 (تعليق بوت)", val: "0.20->0.25 ثابت" },
    { label: "0.15->0 (إضاءة/شاشة)", val: "0.15->0" },
  ];

  const modelsList = [
    "Galaxy A12",
    "Galaxy A32",
    "Galaxy A23",
    "Redmi 9",
    "Redmi Note 11",
  ];

  const handleDiagnose = async (overrideDraw?: string) => {
    const drawToUse = overrideDraw || powerDraw;
    if (!drawToUse.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, powerDraw: drawToUse }),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setResult(json.data);
        setSimilarityNote(json.similarityNote);
      } else {
        setResult(null);
        setSimilarityNote(json.error || "لم نعثر على تشخيص مطابق");
      }
    } catch {
      // Offline fallback: search local cache immediately
      const clean = (s: string) => s.toLowerCase().replace(/[\s\-\>_]/g, "");
      const target = clean(drawToUse);
      const match = FAULTS_DATABASE.find((f) => clean(f.powerDraw) === target) || FAULTS_DATABASE[0];
      setResult(match);
      setSimilarityNote("تم التشخيص من الذاكرة المحلية (Offline Cache)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 flex-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FFC400]/10 text-[#FFC400] text-xs font-bold mb-2">
            <span>الباب الأول 🚪</span>
            <span>AI Doctor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>🩺 الدكتور الذكي</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Offline Ready
            </span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            اكتب سحبة الباور سبلاي مباشرة — التشخيص فوري ويعطيك العطل بالعامية الأردنية ونقطة الفحص
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#141414] border border-[#262626] p-2 rounded-xl text-xs">
          <span className="text-neutral-400">قاعدة البيانات:</span>
          <span className="font-bold text-[#FFC400]">{FAULTS_DATABASE.length} عطل هاردوير موثق</span>
        </div>
      </div>

      {/* Input Box - The core requirement */}
      <div className="bg-[#121212] border border-[#222] rounded-2xl p-6 shadow-xl space-y-6">
        {/* Model selection */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-2">
            📱 اختر الموديل:
          </label>
          <div className="flex flex-wrap gap-2">
            {modelsList.map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  model === m
                    ? "bg-[#FFC400] text-black shadow-[0_0_15px_rgba(255,196,0,0.3)]"
                    : "bg-[#1A1A1A] text-neutral-300 hover:bg-[#252525] border border-[#2E2E2E]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Power draw input */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-2">
            ⚡ اكتب سحبة الباور (مثال: 0.80-&gt;0 أو Short أو 0.05):
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={powerDraw}
              onChange={(e) => setPowerDraw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDiagnose()}
              placeholder="اكتب سحبة الباور سبلاي هنا..."
              className="flex-1 bg-[#1A1A1A] border border-[#333] focus:border-[#FFC400] focus:ring-1 focus:ring-[#FFC400] rounded-xl px-4 py-3.5 text-base text-white placeholder-neutral-500 outline-none transition-all"
            />
            <button
              onClick={() => handleDiagnose()}
              disabled={loading || !powerDraw.trim()}
              className="px-8 py-3.5 rounded-xl bg-[#FFC400] hover:bg-[#E0AC00] disabled:opacity-50 text-black font-black text-sm transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>جارِ الفحص... ⏳</span>
              ) : (
                <>
                  <span>تشخيص العطل</span>
                  <span>⚡</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick buttons */}
        <div>
          <span className="text-[11px] font-semibold text-neutral-400 block mb-2">
            💡 أو اختر سحبة شائعة بضغطة واحدة:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickDraws.map((q) => (
              <button
                key={q.val}
                onClick={() => {
                  setPowerDraw(q.val);
                  handleDiagnose(q.val);
                }}
                className="text-xs bg-[#191919] hover:bg-[#252525] hover:text-[#FFC400] text-neutral-300 px-3 py-1.5 rounded-lg border border-[#2A2A2A] transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Card */}
      {searched && (
        <div>
          {result ? (
            <div className="bg-[#141414] border-2 border-[#FFC400]/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6 animate-in fade-in duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC400]/10 rounded-full blur-2xl -z-0"></div>

              {similarityNote && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs px-3 py-1.5 rounded-lg font-medium inline-block">
                  ℹ️ {similarityNote}
                </div>
              )}

              {/* Top Result Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#262626] pb-4">
                <div>
                  <span className="text-xs text-neutral-400 block">الجهاز المُشخَّص:</span>
                  <span className="text-lg font-black text-white">{result.brand} {result.model}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs">
                    <span className="text-neutral-400">السحبة: </span>
                    <span className="font-bold text-[#FFC400]">{result.powerDraw}</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    نسبة النجاح: {result.successRate}%
                  </div>
                </div>
              </div>

              {/* Diagnosis in Jordanian Slang */}
              <div>
                <h3 className="text-xs font-bold text-neutral-400 mb-1">
                  🔍 تشخيص الدكتور (بالعامية الأردنية):
                </h3>
                <p className="text-base sm:text-lg font-bold text-neutral-100 bg-[#1A1A1A] p-4 rounded-xl border border-[#2B2B2B] leading-relaxed">
                  {result.diagnosisAr}
                </p>
              </div>

              {/* Component & Testpoint Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#181818] border border-[#262626] p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <span>⚠️ المكوّن المشتبه به / التالف:</span>
                  </span>
                  <p className="text-sm font-black text-white">{result.faultyComponent}</p>
                </div>

                <div className="bg-[#181818] border border-[#262626] p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                    <span>🎯 نقطة الفحص والقياس (Test Point):</span>
                  </span>
                  <p className="text-sm font-semibold text-neutral-200">{result.testPoint}</p>
                </div>
              </div>

              {/* Pricing & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#262626]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">سعر التصليح التقديري بالسوق الأردني:</span>
                  <span className="text-xl font-black text-[#FFC400]">
                    {result.fixPriceJOD} JOD
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const shareText = `تشخيص عطل في ${result.model}\nالسحبة: ${result.powerDraw}\nالعطل: ${result.diagnosisAr}\nالمكون: ${result.faultyComponent}\nسعر التصليح: ${result.fixPriceJOD} د.أ\n- عبر تطبيق عالم الصيانة`;
                      navigator.clipboard.writeText(shareText);
                      alert("تم نسخ بطاقة التشخيص لمشاركتها مع الزبون أو الفنيين عبر الواتساب!");
                    }}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 border border-neutral-700 transition-colors"
                  >
                    📋 نسخ للواتساب
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 text-center text-neutral-400">
              <span className="text-3xl block mb-2">🤔</span>
              <p className="text-sm font-bold text-white mb-1">لم نجد سحبة مطابقة تماماً</p>
              <p className="text-xs">جرب كتابة السحبة بطريقة أخرى مثل "0.80" أو اختر أحد الأزرار السريعة بالأعلى.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
