"use client";

import { useState, useEffect } from "react";
import { VaultRecord } from "@/app/api/vault/route";

export default function VaultPage() {
  const [records, setRecords] = useState<VaultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchImei, setSearchImei] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<VaultRecord | null>(null);

  // New Record Form
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [imei, setImei] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [faultDesc, setFaultDesc] = useState("");
  const [priceJOD, setPriceJOD] = useState("");

  const fetchRecords = async (query = "") => {
    try {
      const url = query ? `/api/vault?imei=${encodeURIComponent(query)}` : "/api/vault";
      const res = await fetch(url);
      const json = await res.json();
      if (json.data) setRecords(json.data);
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords(searchImei);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei || !deviceModel || !faultDesc) {
      alert("الرجاء ملء الـ IMEI والموديل ووصف العطل");
      return;
    }

    try {
      const res = await fetch("/api/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          imei,
          deviceModel,
          faultDesc,
          priceJOD: priceJOD ? Number(priceJOD) : undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setShowAddModal(false);
        setCustomerName("");
        setCustomerPhone("");
        setImei("");
        setDeviceModel("");
        setFaultDesc("");
        setPriceJOD("");
        fetchRecords();
        setSelectedReceipt(json.data); // Open receipt directly for printing
      }
    } catch {
      alert("حدث خطأ أثناء حفظ الجهاز");
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleStatusChange = async (id: string, newStatus: VaultRecord["status"]) => {
    try {
      const res = await fetch("/api/vault", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setRecords((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
      }
    } catch {
      alert("حدث خطأ أثناء تحديث حالة الجهاز");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 flex-1 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-6 print:hidden">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 text-xs font-bold mb-2">
            <span>الباب الخامس 🚪</span>
            <span>Customer Vault & Receipts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>🛡️ خزنة الزبائن وسندات الاستلام الحرارية</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            توثيق قانوني للأجهزة بالـ IMEI مع طباعة إيصال حراري (80mm/58mm) وبصيغة PDF يحتوي على QR كود لتتبع الزبون
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#FFC400] text-black font-black text-xs hover:bg-[#E0AC00] transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+ استلام وتوثيق جهاز جديد</span>
        </button>
      </div>

      {/* Search by IMEI Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 print:hidden">
        <input
          type="text"
          value={searchImei}
          onChange={(e) => setSearchImei(e.target.value)}
          placeholder="ابحث برقم الـ IMEI (15 خانة) لحماية المحل والتأكد من تاريخ الجهاز..."
          className="flex-1 bg-[#141414] border border-[#2B2B2B] focus:border-[#FFC400] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
        >
          بحث فوري 🔍
        </button>
      </form>

      {/* Vault Cards */}
      {loading ? (
        <div className="text-center py-12 text-neutral-400 print:hidden">جارِ فتح سجلات الخزنة... ⏳</div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-[#121212] rounded-2xl border border-[#222] print:hidden">
          <span className="text-4xl block mb-2">🛡️</span>
          <p className="text-sm font-bold text-white mb-1">لا يوجد أجهزة مسجلة بهذا الرقم</p>
          <p className="text-xs text-neutral-400">أدخل جهازاً جديداً الآن لحماية حقوق الورشة وإصدار سند استلام</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
          {records.map((rec) => {
            const waReadyText = encodeURIComponent(
              `مرحباً ${rec.customerName}، نبشرك بأن جهازك (${rec.deviceModel}) أصبح جاهزاً للاستلام في المحل. التكلفة: ${rec.priceJOD || 0} د.أ. نسعد بزيارتك!`
            );

            return (
              <div
                key={rec.id}
                className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-lg hover:border-[#FFC400]/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-neutral-800/80 pb-3">
                    <div>
                      <h3 className="text-base font-black text-white">{rec.deviceModel}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-neutral-400">IMEI:</span>
                        <span className="font-mono text-xs font-bold text-[#FFC400] bg-black/60 px-2 py-0.5 rounded border border-neutral-800">
                          {rec.imei}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          rec.status === "DELIVERED"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            : rec.status === "DONE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : rec.status === "IN_PROGRESS"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {rec.status === "DELIVERED"
                          ? "🤝 تم التسليم"
                          : rec.status === "DONE"
                          ? "✓ جاهز للتسليم"
                          : rec.status === "IN_PROGRESS"
                          ? "⚙️ قيد الفحص والإصلاح"
                          : "📥 تم الاستلام"}
                      </span>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#171717] p-3 rounded-xl border border-neutral-800">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">اسم الزبون:</span>
                      <span className="font-bold text-white">{rec.customerName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">الهاتف:</span>
                      <span className="font-bold text-neutral-300 font-mono">
                        {rec.customerPhone || "غير مسجل"}
                      </span>
                    </div>
                  </div>

                  {/* Fault description */}
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400 block mb-1">
                      حالة الجهاز والعطل عند الدخول:
                    </span>
                    <p className="text-xs text-neutral-200 bg-[#171717] p-3 rounded-xl border border-neutral-800 leading-relaxed">
                      {rec.faultDesc}
                    </p>
                  </div>

                  {/* Status Progression Control */}
                  <div className="p-3 rounded-xl bg-black/40 border border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-neutral-400 font-bold">تغيير الحالة:</span>
                      <select
                        value={rec.status}
                        onChange={(e) =>
                          handleStatusChange(rec.id, e.target.value as VaultRecord["status"])
                        }
                        className="bg-[#171717] border border-neutral-700 text-neutral-200 text-xs rounded-lg px-2 py-1 outline-none focus:border-[#FFC400]"
                      >
                        <option value="RECEIVED">📥 تم الاستلام</option>
                        <option value="IN_PROGRESS">⚙️ قيد الفحص والإصلاح</option>
                        <option value="DONE">✓ جاهز للتسليم</option>
                        <option value="DELIVERED">🤝 تم التسليم</option>
                      </select>
                    </div>

                    {rec.status === "RECEIVED" && (
                      <button
                        onClick={() => handleStatusChange(rec.id, "IN_PROGRESS")}
                        className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40 transition-colors"
                      >
                        بدء الفحص ⚙️
                      </button>
                    )}
                    {rec.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleStatusChange(rec.id, "DONE")}
                        className="text-xs font-bold px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
                      >
                        إتمام الصيانة ✅
                      </button>
                    )}
                    {rec.status === "DONE" && (
                      <button
                        onClick={() => handleStatusChange(rec.id, "DELIVERED")}
                        className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/40 transition-colors"
                      >
                        تسليم للزبون 🤝
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom actions: Print Receipt + WhatsApp Notify + Customer Tracking Link */}
                <div className="pt-4 border-t border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>تاريخ الاستلام: {new Date(rec.date).toLocaleDateString("ar-JO")}</span>
                    {rec.priceJOD && (
                      <span className="font-bold text-[#FFC400]">
                        المتفق عليه: {rec.priceJOD} JOD
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSelectedReceipt(rec)}
                      className="py-2.5 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-neutral-700"
                    >
                      <span>🖨️ سند / PDF</span>
                    </button>

                    <a
                      href={`/track?id=${rec.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1 transition-colors text-center"
                    >
                      <span>🌐 تتبع الزبون</span>
                    </a>

                    {rec.customerPhone ? (
                      <a
                        href={`https://wa.me/962${rec.customerPhone.replace(/^0/, "")}?text=${waReadyText}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors text-center"
                      >
                        <span>📲 واتساب</span>
                      </a>
                    ) : (
                      <span className="py-2.5 px-2 text-center text-[11px] text-neutral-500 bg-neutral-900 rounded-xl flex items-center justify-center">
                        بدون هاتف
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Thermal & PDF Receipt Print Modal / Sheet */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Controls (Hidden in actual print) */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 print:hidden">
              <h2 className="text-base font-black text-white">معاينة سند الاستلام</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintReceipt}
                  className="px-4 py-1.5 rounded-lg bg-[#FFC400] text-black font-black text-xs hover:bg-[#E0AC00] transition-colors"
                >
                  طباعة فورية 🖨️
                </button>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-neutral-400 hover:text-white px-2 py-1 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* The Actual Receipt Document (Designed for 80mm/58mm thermal rolls & PDF) */}
            <div
              id="thermal-receipt"
              className="bg-white text-black p-5 rounded-lg font-sans text-xs space-y-3.5 shadow-2xl border border-neutral-300"
            >
              {/* Receipt Header */}
              <div className="text-center border-b border-dashed border-gray-400 pb-3 space-y-1">
                <h3 className="text-base font-black tracking-wide">عالم الصيانة</h3>
                <p className="text-[11px] text-gray-700">ورشة الصيانة الاحترافية للأجهزة الذكية</p>
                <p className="text-[10px] text-gray-500">عمان - الأردن • هاتف: 0791234567</p>
                <div className="inline-block px-2 py-0.5 rounded bg-gray-100 font-bold text-[10px] border border-gray-300 mt-1">
                  سند استلام صيانة ورشة
                </div>
              </div>

              {/* Receipt Body Info */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم السند:</span>
                  <span className="font-mono font-bold">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التاريخ:</span>
                  <span>{new Date(selectedReceipt.date).toLocaleString("ar-JO")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الزبون:</span>
                  <span className="font-bold">{selectedReceipt.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الهاتف:</span>
                  <span className="font-mono">{selectedReceipt.customerPhone || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الجهاز:</span>
                  <span className="font-bold">{selectedReceipt.deviceModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">رقم IMEI:</span>
                  <span className="font-mono font-bold text-[10px]">{selectedReceipt.imei}</span>
                </div>
              </div>

              {/* Fault & Agreement */}
              <div className="border-t border-b border-dashed border-gray-400 py-2 space-y-1">
                <span className="text-[10px] font-bold text-gray-700 block">حالة الجهاز عند الدخول:</span>
                <p className="text-[11px] bg-gray-50 p-2 rounded border border-gray-200">
                  {selectedReceipt.faultDesc}
                </p>
                {selectedReceipt.priceJOD && (
                  <div className="flex justify-between items-center pt-1 font-bold">
                    <span>المبلغ التقديري:</span>
                    <span className="text-sm font-mono">{selectedReceipt.priceJOD} دينار أردني</span>
                  </div>
                )}
              </div>

              {/* QR Code For Customer Tracking */}
              <div className="text-center pt-1 pb-1 space-y-1">
                <div className="inline-block p-1.5 bg-white border border-gray-300 rounded shadow-sm">
                  {/* Google Chart API QR Generator */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
                      `${typeof window !== "undefined" ? window.location.origin : ""}/track?id=${selectedReceipt.id}`
                    )}`}
                    alt="Customer Tracking QR"
                    className="w-24 h-24 mx-auto"
                  />
                </div>
                <p className="text-[10px] text-gray-600 font-bold">
                  امسح الـ QR بكاميرا هاتفك لتتبع حالة جهازك مباشرة
                </p>
              </div>

              {/* Legal Disclaimer For Shop Protection */}
              <div className="border-t border-dashed border-gray-400 pt-2 text-[9px] text-gray-600 space-y-0.5 leading-relaxed">
                <p className="font-bold text-gray-800">شروط وقوانين الورشة:</p>
                <p>1. المحل غير مسؤول عن فقدان البيانات (Data Loss)، يرجى عمل نسخة احتياطية.</p>
                <p>2. تسليم الجهاز بموجب هذا السند أو إثبات هوية صاحب الجهاز.</p>
                <p>3. تسقط مسؤولية المحل عن أي جهاز يُترك لأكثر من 30 يوماً من تاريخ الإشعار بالجاهزية.</p>
              </div>

              <div className="text-center border-t border-gray-200 pt-2 text-[10px] font-bold text-gray-500">
                نتمنى لكم يوماً سعيداً
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-lg font-black text-white">توثيق جهاز واستخراج سند استلام</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-neutral-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    اسم الزبون:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد خليل"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    هاتف الزبون:
                  </label>
                  <input
                    type="text"
                    placeholder="07XXXXXXXX"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    موديل الجهاز:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Samsung A12"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">
                    رقم الـ IMEI (أدخل *#06#):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="35XXXXXXXXXXXXX"
                    value={imei}
                    onChange={(e) => setImei(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  حالة الجهاز والعطل عند الدخول (إقرار قانوني للحماية):
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="مثال: الشاشة مكسورة، شورت بالماذر بورد، لا يقبل شحن، توجد خدوش بالظهر..."
                  value={faultDesc}
                  onChange={(e) => setFaultDesc(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                ></textarea>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">
                  أجرة الإصلاح التقديرية (JOD):
                </label>
                <input
                  type="number"
                  placeholder="مثال: 20"
                  value={priceJOD}
                  onChange={(e) => setPriceJOD(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#FFC400] text-black font-black hover:bg-[#E0AC00]"
                >
                  حفظ وطباعة السند فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
