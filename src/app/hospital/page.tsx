"use client";

import { useState } from "react";
import { FAULTS_DATABASE, FaultItem } from "@/lib/faults-data";
import {
  Stethoscope,
  Search,
  Loader2,
  Zap,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Activity,
  Database,
} from "lucide-react";

export default function HospitalPage() {
  const [model, setModel] = useState("Galaxy A12");
  const [powerDraw, setPowerDraw] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FaultItem | null>(null);
  const [similarityNote, setSimilarityNote] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const quickDraws = [
    { label: "0.80->0 (لا يشتغل)", val: "0.80->0" },
    { label: "0.00->0.05 (قطع نهائي)", val: "0.00->0.05" },
    { label: "Short->2.00A+ (قصر حاد)", val: "Short->2.00+" },
    { label: "0.20->0.25 (شنطة بطيء)", val: "0.20->0.25 ثابت" },
    { label: "0.15->0 (شاشة/تاتش)", val: "0.15->0" },
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
        setSimilarityNote(json.error || "لا يوجد تشخيص لهذه القراءة");
      }
    } catch {
      const clean = (s: string) => s.toLowerCase().replace(/[\s\-\>_]/g, "");
      const target = clean(drawToUse);
      const match = FAULTS_DATABASE.find((f) => clean(f.powerDraw) === target) || FAULTS_DATABASE[0];
      setResult(match);
      setSimilarityNote("تم التشخيص من الكاش المحلي (Offline Cache)");
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
            <Stethoscope className="w-3.5 h-3.5" />
            <span>AI Doctor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>مستشفى الأجهزة الذكي</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Offline Ready
            </span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            أدخل قراءة الأمبير من مزود الطاقة لتشخيص العطل وتحديد المكون المعطل واحتساب سعر الإصلاح
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#141414] border border-[#262626] p-2 rounded-xl text-xs">
          <Database className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-400">قاعدة الأعطال:</span>
          <span className="font-bold text-[#FFC400]">{FAULTS_DATABASE.length} عطل مسجل</span>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-[#121212] border border-[#222] rounded-2xl p-6 shadow-xl space-y-6">
        {/* Model selection */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#FFC400]" />
            اختر موديل الجهاز:
          </label>
          <div className="flex flex-wrap gap-2">
            {modelsList.map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  model === m
                    ? "bg-[#FFC400] text-black shadow-[0_0_15px_rgba(255,196,0,0.3)]"
                    : "border-2 border-neutral-700 text-neutral-300 hover:border-[#FFC400]/50 hover:text-[#FFC400] bg-transparent"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Power Draw Input */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#FFC400]" />
            قراءة الأمبير (Power Draw):
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={powerDraw}
              onChange={(e) => setPowerDraw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDiagnose()}
              placeholder="مثال: 0.80 أو Short أو 0.00->0.05"
              className="flex-1 bg-[#1A1A1A] border border-[#2E2E2E] rounded-xl px-4 py-3 text-white font-mono text-sm outline-none focus:border-[#FFC400] transition-colors placeholder-neutral-600"
            />
            <button
              onClick={() => handleDiagnose()}
              disabled={loading || !powerDraw.trim()}
              className="px-6 py-3 rounded-xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black transition-all font-black text-sm disabled:opacity-40 flex items-center gap-2 shadow-[0_0_15px_rgba(255,196,0,0.2)]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">تشخيص</span>
            </button>
          </div>
        </div>

        {/* Quick Draw Buttons */}
        <div>
          <label className="block text-[11px] font-bold text-neutral-500 mb-2 uppercase tracking-wider">
            قراءات شائعة (اضغط للتشخيص الفوري):
          </label>
          <div className="flex flex-wrap gap-2">
            {quickDraws.map((q) => (
              <button
                key={q.val}
                onClick={() => {
                  setPowerDraw(q.val);
                  handleDiagnose(q.val);
                }}
                className="px-3 py-1.5 rounded-lg border-2 border-neutral-700 text-neutral-400 hover:border-[#FFC400] hover:text-[#FFC400] bg-transparent transition-all text-xs font-bold"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Section */}
      {searched && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-neutral-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#FFC400]" />
              <span className="font-bold">جاري التشخيص...</span>
            </div>
          ) : result ? (
            <div className="bg-[#121212] border border-emerald-500/20 rounded-2xl p-6 space-y-5 shadow-xl">
              {/* Result Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[11px] text-neutral-400 block">تم التشخيص:</span>
                    <span className="text-lg font-black text-white">{result.brand} {result.model}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs">
                    <span className="text-neutral-400">القراءة: </span>
                    <span className="font-bold text-[#FFC400] font-mono">{result.powerDraw}</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    نسبة النجاح: {result.successRate}%
                  </div>
                </div>
              </div>

              {/* Similarity Note */}
              {similarityNote && (
                <div className="flex items-center gap-2 text-xs text-neutral-400 bg-[#1A1A1A] px-3 py-2 rounded-lg border border-neutral-800">
                  <Activity className="w-3.5 h-3.5 text-[#FFC400]" />
                  <span>{similarityNote}</span>
                </div>
              )}

              {/* Diagnosis */}
              <div>
                <h3 className="text-xs font-bold text-neutral-400 mb-1 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  التشخيص بالعامية الأردنية:
                </h3>
                <p className="text-base sm:text-lg font-bold text-neutral-100 bg-[#1A1A1A] p-4 rounded-xl border border-[#2B2B2B] leading-relaxed">
                  {result.diagnosisAr}
                </p>
              </div>

              {/* Component & Testpoint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#181818] border border-[#262626] p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    المكون المعطل / المشتبه به:
                  </span>
                  <p className="text-sm font-black text-white">{result.faultyComponent}</p>
                </div>

                <div className="bg-[#181818] border border-[#262626] p-4 rounded-xl space-y-1">
                  <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    نقطة القياس (Test Point):
                  </span>
                  <p className="text-sm font-semibold text-neutral-200">{result.testPoint}</p>
                </div>
              </div>

              {/* Pricing & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#262626]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">سعر الإصلاح المقدر حسب السوق المحلي:</span>
                  <span className="text-xl font-black text-[#FFC400]">
                    {result.fixPriceJOD} JOD
                  </span>
                </div>

                <button
                  onClick={() => {
                    const shareText = `تشخيص عطل ${result.model}\nالقراءة: ${result.powerDraw}\nالعطل: ${result.diagnosisAr}\nالمكون: ${result.faultyComponent}\nسعر الإصلاح: ${result.fixPriceJOD} د.أ\n- عالم الصيانة PRO`;
                    navigator.clipboard.writeText(shareText);
                    alert("تم نسخ التشخيص للحافظة — شاركه مع الزبون أو على الواتساب!");
                  }}
                  className="px-4 py-2 rounded-xl border-2 border-neutral-700 text-neutral-300 hover:border-[#FFC400] hover:text-[#FFC400] bg-transparent transition-all text-xs font-bold flex items-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  نسخ التشخيص
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#262626] rounded-2xl p-8 text-center text-neutral-400">
              <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-neutral-600" />
              <p className="text-sm font-bold text-white mb-1">لا يوجد تشخيص لهذه القراءة</p>
              <p className="text-xs">جرب إدخال قراءة مثل "0.80" أو اختر أحد الأمثلة أعلاه لتجربة التشخيص الفوري.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
