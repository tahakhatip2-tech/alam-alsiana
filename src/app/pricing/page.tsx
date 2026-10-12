"use client";

import { useState, useEffect } from "react";
import { PriceItem } from "@/lib/market-pricing-data";

export default function PricingPage() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("الكل");
  const [customBuy, setCustomBuy] = useState("");
  const [calcMargin, setCalcMargin] = useState(7);

  const modelsList = ["الكل", "Galaxy A12", "Galaxy A32", "Galaxy A23", "Redmi 9", "Redmi Note 11"];

  useEffect(() => {
    fetch("/api/prices")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setPrices(json.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredPrices =
    selectedModel === "الكل"
      ? prices
      : prices.filter((p) => p.model.toLowerCase().includes(selectedModel.toLowerCase()));

  // Calculator logic
  const buyNum = Number(customBuy) || 0;
  const suggestedSell = buyNum > 0 ? buyNum + calcMargin : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 flex-1 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 text-xs font-bold mb-2">
            <span>الباب الرابع 🚪</span>
            <span>Price Doctor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>💰 دكتور الأسعار وهامش الربح الأردني</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            جدول استرشادي لأسعار الشراء وهامش الربح المقترح (+7 دنانير) وتنبيه فوري إذا كان سعرك دون السوق
          </p>
        </div>
      </div>

      {/* Quick Interactive Profit Calculator Widget */}
      <div className="bg-gradient-to-r from-[#171717] to-[#111111] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-black text-[#FFC400] flex items-center gap-2">
          <span>🧮 حاسبة التسعير السريع للفني:</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1">سعر شراء القطعة (JOD):</label>
            <input
              type="number"
              min="0"
              placeholder="مثال: 15"
              value={customBuy}
              onChange={(e) => setCustomBuy(e.target.value)}
              className="w-full bg-[#1F1F1F] border border-[#333] rounded-xl p-3 text-white text-sm outline-none focus:border-[#FFC400]"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">هامش ربح وأجرة اليد (JOD):</label>
            <input
              type="number"
              min="1"
              value={calcMargin}
              onChange={(e) => setCalcMargin(Number(e.target.value))}
              className="w-full bg-[#1F1F1F] border border-[#333] rounded-xl p-3 text-white text-sm outline-none focus:border-[#FFC400]"
            />
          </div>

          <div className="bg-[#141414] border border-[#2D2D2D] rounded-xl p-3 flex flex-col justify-center">
            <span className="text-neutral-400 text-[11px]">السعر المقترح للزبون:</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-400">
                {suggestedSell}
              </span>
              <span className="text-xs text-neutral-400">JOD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter by Model */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-neutral-400 ml-2 whitespace-nowrap">
          📱 تصفية حسب الموديل:
        </span>
        {modelsList.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedModel(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              selectedModel === m
                ? "bg-[#FFC400] text-black"
                : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Price Table */}
      {loading ? (
        <div className="text-center py-12 text-neutral-400">جارِ تحميل قائمة الأسعار... ⏳</div>
      ) : (
        <div className="bg-[#121212] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#181818] text-neutral-400 font-bold border-b border-neutral-800">
                <tr>
                  <th className="p-4">الموديل</th>
                  <th className="p-4">القطعة</th>
                  <th className="p-4">سعر الشراء (Buy)</th>
                  <th className="p-4">سعر البيع المقترح (Sell = Buy + 7)</th>
                  <th className="p-4">متوسط السوق</th>
                  <th className="p-4">حالة التسعير والتحذير</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F1F1F]">
                {filteredPrices.map((item) => {
                  const isBelowMarket = item.sellJOD < item.marketAvgJOD;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-neutral-900/60 transition-colors"
                    >
                      <td className="p-4 font-bold text-white">
                        {item.brand} {item.model}
                      </td>
                      <td className="p-4 text-neutral-300">{item.partType}</td>
                      <td className="p-4 font-mono font-bold text-neutral-200">
                        {item.buyJOD} JOD
                      </td>
                      <td className="p-4 font-mono font-bold text-[#FFC400]">
                        {item.sellJOD} JOD
                      </td>
                      <td className="p-4 font-mono text-neutral-400">
                        {item.marketAvgJOD} JOD
                      </td>
                      <td className="p-4">
                        {isBelowMarket ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                            ⚠️ أقل من متوسط السوق (ميزة تنافسية)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                            ✓ سعر متوازن ومربح
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
