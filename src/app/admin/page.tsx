"use client";

import { useState, useEffect } from "react";
import { FaultItem } from "@/lib/faults-data";
import { BoardModelConfig, BoardTrack } from "@/lib/schematic-data";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"hospital" | "schematic" | "agent">("hospital");
  const [stats, setStats] = useState<{ totalFaults: number; totalBoards: number; totalTracks: number; brands: string[] }>({
    totalFaults: 0,
    totalBoards: 0,
    totalTracks: 0,
    brands: []
  });

  // HOSPITAL (FAULTS) STATE
  const [faults, setFaults] = useState<FaultItem[]>([]);
  const [loadingFaults, setLoadingFaults] = useState(false);
  const [faultSearch, setFaultSearch] = useState("");
  const [showAddFaultModal, setShowAddFaultModal] = useState(false);

  // New Fault Form
  const [brand, setBrand] = useState("Samsung");
  const [model, setModel] = useState("");
  const [powerDraw, setPowerDraw] = useState("");
  const [diagnosisAr, setDiagnosisAr] = useState("");
  const [faultyComponent, setFaultyComponent] = useState("");
  const [testPoint, setTestPoint] = useState("");
  const [successRate, setSuccessRate] = useState("90");
  const [fixPriceJOD, setFixPriceJOD] = useState("15");

  // SCHEMATIC (BOARDS & TRACKS) STATE
  const [boards, setBoards] = useState<BoardModelConfig[]>([]);
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);

  // New Board Form
  const [boardIdInput, setBoardIdInput] = useState("");
  const [boardNameInput, setBoardNameInput] = useState("");
  const [boardBrandInput, setBoardBrandInput] = useState("Samsung");
  const [boardImageInput, setBoardImageInput] = useState("");

  // New Track Form
  const [trackName, setTrackName] = useState("");
  const [trackNet, setTrackNet] = useState("");
  const [trackVoltage, setTrackVoltage] = useState("5.0V");
  const [trackColor, setTrackColor] = useState("#EF4444");
  const [trackPathD, setTrackPathD] = useState("M 150 500 L 150 300 L 320 300");
  const [startLabel, setStartLabel] = useState("");
  const [startX, setStartX] = useState("150");
  const [startY, setStartY] = useState("500");
  const [endLabel, setEndLabel] = useState("");
  const [endX, setEndX] = useState("320");
  const [endY, setEndY] = useState("300");

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin?resource=stats");
      const json = await res.json();
      if (json.data) setStats(json.data);
    } catch {}
  };

  const fetchFaults = async () => {
    setLoadingFaults(true);
    try {
      const res = await fetch("/api/admin?resource=faults");
      const json = await res.json();
      if (json.data) setFaults(json.data);
    } catch {}
    finally {
      setLoadingFaults(false);
    }
  };

  const fetchBoards = async () => {
    setLoadingBoards(true);
    try {
      const res = await fetch("/api/admin?resource=boards");
      const json = await res.json();
      if (json.data) {
        setBoards(json.data);
        if (!selectedBoardId && json.data.length > 0) {
          setSelectedBoardId(json.data[0].id);
        }
      }
    } catch {}
    finally {
      setLoadingBoards(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchFaults();
    fetchBoards();
  }, []);

  // HANDLE FAULTS CRUD
  const handleCreateFault = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!model || !powerDraw || !diagnosisAr) {
      alert("الرجاء ملء الحقول الأساسية");
      return;
    }

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource: "faults",
          action: "create",
          brand,
          model,
          powerDraw,
          diagnosisAr,
          faultyComponent,
          testPoint,
          successRate: Number(successRate),
          fixPriceJOD: Number(fixPriceJOD)
        }),
      });

      if (res.ok) {
        setShowAddFaultModal(false);
        setModel("");
        setPowerDraw("");
        setDiagnosisAr("");
        setFaultyComponent("");
        setTestPoint("");
        fetchFaults();
        fetchStats();
      }
    } catch {
      alert("فشل إضافة العطل");
    }
  };

  const handleDeleteFault = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العطل من الدكتور الذكي؟")) return;
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "faults", action: "delete", id }),
      });
      if (res.ok) {
        setFaults((prev) => prev.filter((f) => f.id !== id));
        fetchStats();
      }
    } catch {
      alert("فشل الحذف");
    }
  };

  // HANDLE BOARDS & TRACKS CRUD
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardIdInput || !boardNameInput || !boardImageInput) {
      alert("الرجاء ملء بيانات اللوحة كاملة ورابط الصورة");
      return;
    }

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource: "boards",
          action: "create_board",
          id: boardIdInput,
          name: boardNameInput,
          brand: boardBrandInput,
          image: boardImageInput
        }),
      });

      if (res.ok) {
        setShowAddBoardModal(false);
        setBoardIdInput("");
        setBoardNameInput("");
        setBoardImageInput("");
        fetchBoards();
        fetchStats();
      }
    } catch {
      alert("فشل إضافة اللوحة");
    }
  };

  const handleAddTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoardId || !trackName || !trackPathD) {
      alert("الرجاء ملء اسم المسار ومسار الـ SVG");
      return;
    }

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource: "boards",
          action: "add_track",
          boardId: selectedBoardId,
          name: trackName,
          net: trackNet,
          voltage: trackVoltage,
          color: trackColor,
          pathD: trackPathD,
          startLabel,
          startX: Number(startX),
          startY: Number(startY),
          endLabel,
          endX: Number(endX),
          endY: Number(endY)
        }),
      });

      if (res.ok) {
        setShowAddTrackModal(false);
        setTrackName("");
        setTrackNet("");
        setStartLabel("");
        setEndLabel("");
        fetchBoards();
        fetchStats();
      }
    } catch {
      alert("فشل إضافة المسار");
    }
  };

  const handleDeleteTrack = async (boardId: string, trackId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المسار؟")) return;
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resource: "boards", action: "delete_track", boardId, trackId }),
      });
      if (res.ok) {
        fetchBoards();
        fetchStats();
      }
    } catch {
      alert("فشل حذف المسار");
    }
  };

  const filteredFaults = faults.filter(
    (f) =>
      f.model.toLowerCase().includes(faultSearch.toLowerCase()) ||
      f.powerDraw.toLowerCase().includes(faultSearch.toLowerCase()) ||
      f.diagnosisAr.includes(faultSearch)
  );

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 flex-1 w-full">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FFC400]/15 text-[#FFC400] text-xs font-bold mb-2">
            <span>لوحة التحكم الرئيسية ⚙️</span>
            <span>Master Admin Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>لوحة إدارة الدكتور الذكي والمخططات (ZXW)</span>
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            تحكم كامل في قاعدة بيانات أعطال وسحبات الباور سبلاي وإضافة لوحات PCB ومسارات الـ SVG التفاعلية
          </p>
        </div>

        {/* Live Counters Banner */}
        <div className="flex items-center gap-3">
          <div className="bg-[#141414] border border-[#282828] px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-neutral-400 block font-bold">أعطال الدكتور</span>
            <span className="text-lg font-black text-[#FFC400] font-mono">{stats.totalFaults}</span>
          </div>
          <div className="bg-[#141414] border border-[#282828] px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-neutral-400 block font-bold">اللوحات المسجلة</span>
            <span className="text-lg font-black text-blue-400 font-mono">{stats.totalBoards}</span>
          </div>
          <div className="bg-[#141414] border border-[#282828] px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-neutral-400 block font-bold">مسارات الـ Nets</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{stats.totalTracks}</span>
          </div>
        </div>
      </div>

      {/* Main Tabs: Hospital vs Schematic */}
      <div className="flex items-center justify-between border-b border-[#222] pb-4">
        <div className="flex items-center gap-3 bg-[#131313] p-1.5 rounded-xl border border-[#262626]">
          <button
            onClick={() => setActiveTab("hospital")}
            className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === "hospital"
                ? "bg-[#FFC400] text-black shadow-lg"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>🩺 الباب الأول: إدارة الدكتور الذكي</span>
            <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px]">{faults.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("schematic")}
            className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === "schematic"
                ? "bg-blue-500 text-white shadow-lg"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>🗺️ الباب الثاني: إدارة المخططات واللوحات (ZXW)</span>
            <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px]">{boards.length}</span>
          </button>

          <button
            onClick={() => setActiveTab("agent")}
            className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
              activeTab === "agent"
                ? "bg-emerald-500 text-black shadow-lg"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <span>🤖 الوكيل الذكي (عامر) وربط الواتساب</span>
            <span className="bg-emerald-400/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px] font-bold">AI</span>
          </button>
        </div>

        {/* Action Button depending on tab */}
        {activeTab === "hospital" ? (
          <button
            onClick={() => setShowAddFaultModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#FFC400] text-black font-black text-xs hover:bg-[#E0AC00] transition-all shadow-[0_0_15px_rgba(255,196,0,0.25)] flex items-center gap-1.5"
          >
            <span>+ إضافة عطل جديد للدكتور</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddBoardModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-colors flex items-center gap-1.5"
            >
              <span>+ إضافة لوحة هاتف جديدة</span>
            </button>
            <button
              onClick={() => setShowAddTrackModal(true)}
              disabled={!selectedBoardId}
              className="px-3.5 py-2.5 rounded-xl bg-[#FFC400] text-black font-black text-xs hover:bg-[#E0AC00] transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>+ إضافة مسار (Track/Net) للوحة</span>
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: HOSPITAL (AI DOCTOR) MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "hospital" && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              value={faultSearch}
              onChange={(e) => setFaultSearch(e.target.value)}
              placeholder="ابحث بالموديل، السحبة، أو التشخيص..."
              className="flex-1 bg-[#141414] border border-[#2A2A2A] focus:border-[#FFC400] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none"
            />
            <span className="text-xs text-neutral-400 font-bold whitespace-nowrap">
              يظهر: {filteredFaults.length} عطل
            </span>
          </div>

          {/* Faults Table */}
          <div className="bg-[#121212] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#181818] text-neutral-400 font-bold border-b border-neutral-800">
                  <tr>
                    <th className="p-4">الموديل / الشركة</th>
                    <th className="p-4">سحبة الباور سبلاي</th>
                    <th className="p-4">التشخيص بالعامية الأردنية</th>
                    <th className="p-4">المكوّن التالف</th>
                    <th className="p-4">نقطة الفحص (Test Point)</th>
                    <th className="p-4">نسبة النجاح</th>
                    <th className="p-4">السعر</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C1C]">
                  {loadingFaults ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-neutral-500">
                        جارِ تحميل الأعطال... ⏳
                      </td>
                    </tr>
                  ) : filteredFaults.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-neutral-500">
                        لا توجد أعطال مطابقة للبحث
                      </td>
                    </tr>
                  ) : (
                    filteredFaults.map((f) => (
                      <tr key={f.id} className="hover:bg-neutral-900/50 transition-colors">
                        <td className="p-4 font-bold text-white whitespace-nowrap">
                          {f.brand} {f.model}
                        </td>
                        <td className="p-4 font-mono font-bold text-[#FFC400] whitespace-nowrap">
                          {f.powerDraw}
                        </td>
                        <td className="p-4 text-neutral-300 max-w-xs">{f.diagnosisAr}</td>
                        <td className="p-4 text-rose-400 font-semibold">{f.faultyComponent}</td>
                        <td className="p-4 text-blue-300 text-[11px] max-w-xs">{f.testPoint}</td>
                        <td className="p-4 font-bold text-emerald-400 font-mono">{f.successRate}%</td>
                        <td className="p-4 font-bold text-[#FFC400] font-mono whitespace-nowrap">
                          {f.fixPriceJOD} JOD
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteFault(f.id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-[11px] font-bold transition-colors"
                          >
                            حذف 🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: SCHEMATIC (ZXW KILLER) MANAGEMENT */}
      {/* ======================================================== */}
      {activeTab === "schematic" && (
        <div className="space-y-6">
          {/* Boards List & Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-neutral-400 ml-2 whitespace-nowrap">
              📱 اختر اللوحة لتعديل مساراتها:
            </span>
            {boards.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBoardId(b.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  selectedBoardId === b.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                <span>{b.name}</span>
                <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded">
                  {b.tracks.length} مسار
                </span>
              </button>
            ))}
          </div>

          {/* Selected Board Preview & Track List */}
          {selectedBoard ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Board Info & Photo */}
              <div className="lg:col-span-1 bg-[#121212] border border-[#242424] rounded-2xl p-5 space-y-4 shadow-xl">
                <div>
                  <span className="text-[11px] font-bold text-blue-400 block mb-1">اللوحة النشطة:</span>
                  <h3 className="text-base font-black text-white">{selectedBoard.name}</h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">ID: {selectedBoard.id}</p>
                </div>

                <div className="relative h-48 rounded-xl overflow-hidden border border-neutral-800 bg-black">
                  <img
                    src={selectedBoard.image}
                    alt={selectedBoard.name}
                    className="w-full h-full object-cover filter brightness-90"
                  />
                </div>

                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-xs space-y-1.5 text-neutral-400">
                  <div className="flex justify-between">
                    <span>عدد المسارات الكهربائية (Nets):</span>
                    <span className="font-bold text-white">{selectedBoard.tracks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>رابط الصورة:</span>
                    <span className="truncate max-w-[150px] font-mono text-[10px]">{selectedBoard.image}</span>
                  </div>
                </div>
              </div>

              {/* Tracks Table for this board */}
              <div className="lg:col-span-2 bg-[#121212] border border-[#242424] rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>⚡ مسارات التغذية والشحن لهذه اللوحة</span>
                  </h3>
                  <button
                    onClick={() => setShowAddTrackModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#FFC400] text-black font-black text-xs hover:bg-[#E0AC00] transition-colors"
                  >
                    + إضافة مسار جديد
                  </button>
                </div>

                {selectedBoard.tracks.length === 0 ? (
                  <div className="text-center py-12 text-neutral-500 text-xs space-y-2">
                    <span className="text-3xl block">🗺️</span>
                    <p>لا توجد مسارات مرسومة لهذه اللوحة بعد</p>
                    <p className="text-[11px] text-neutral-600">
                      اضغط على "+ إضافة مسار جديد" لرسم مسار SVG مع نقاط الفحص
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#1C1C1C] space-y-2">
                    {selectedBoard.tracks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3.5 bg-[#171717] rounded-xl border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: t.color }}
                            ></span>
                            <span className="font-black text-white">{t.name}</span>
                            <span className="font-mono text-[#FFC400] text-[11px]">({t.net})</span>
                            <span className="text-emerald-400 font-mono text-[11px]">{t.voltage}</span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                            <span>البداية: <strong className="text-neutral-200">{t.startPoint.label}</strong></span>
                            <span>←</span>
                            <span>النهاية: <strong className="text-neutral-200">{t.endPoint.label}</strong></span>
                          </div>

                          <p className="text-[10px] text-neutral-500 font-mono truncate max-w-md">
                            SVG: {t.pathD}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteTrack(selectedBoard.id, t.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-[11px] font-bold self-end sm:self-auto transition-colors"
                        >
                          حذف المسار 🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-neutral-500">لا توجد لوحات محددة</div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: AGENT SETTINGS & WHATSAPP INTEGRATION (عامر)      */}
      {/* ======================================================== */}
      {activeTab === "agent" && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-black border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-3xl shadow-lg border border-emerald-400/40">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">إعدادات الوكيل الذكي (عامر)</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    نشط وفعّال
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                  عامر يعمل كمساعد شخصي ومدير رقمي لمحل الصيانة. يستطيع قراءة الخزنة، تحديث حالات الأجهزة، وإصدار روابط واتساب لإشعار الزبائن فوراً.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-bold">الحالة:</span>
              <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                موصول بالنظام
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: WhatsApp Configuration */}
            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                <span className="text-2xl">📲</span>
                <div>
                  <h3 className="text-sm font-black text-white">ربط واتساب المحل (WhatsApp Business)</h3>
                  <p className="text-[11px] text-neutral-400">إعداد الرقم التلقائي لإرسال إشعارات جاهزية الأجهزة</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">رقم هاتف الورشة المعتمد للواتساب:</label>
                  <input
                    type="text"
                    defaultValue="0791234567"
                    placeholder="079XXXXXXX"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">يُستخدم كرقم مرسل للتواصل مع الزبائن وتنسيق الاستلام.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-300 font-bold">نمط الإرسال المباشر (Direct wa.me):</span>
                    <span className="text-emerald-400 font-bold text-[11px]">مفعل تلقائياً ✅</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    يقوم عامر بإنشاء رابط رسالة واتساب مشفّرة ومصاغة باحترافية بضغطة زر واحدة دون الحاجة لاشتراكات مدفوعة.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                  <span className="text-emerald-400 font-bold block text-[11px]">قالب الرسالة المعتمد:</span>
                  <p className="text-[11px] text-neutral-300 font-mono bg-black/50 p-2 rounded-lg border border-neutral-800">
                    &quot;مرحباً [اسم الزبون]، نبشرك بأن جهازك ([الموديل]) أصبح جاهزاً للاستلام في محل عالم الصيانة. التكلفة: [السعر] د.أ. أهلاً بك!&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: AI Brain & Gemini Setup */}
            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-3">
                <span className="text-2xl">🧠</span>
                <div>
                  <h3 className="text-sm font-black text-white">محرك الذكاء الاصطناعي (Gemini 2.0 Flash)</h3>
                  <p className="text-[11px] text-neutral-400">تفعيل Tool Calling والأوامر الصوتية والنصية الذكية</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">مفتاح Google Gemini API Key:</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      defaultValue="••••••••••••••••••••••••••••••••"
                      readOnly
                      className="flex-1 bg-[#181818] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-neutral-400 font-mono outline-none"
                    />
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold transition-colors whitespace-nowrap"
                    >
                      تغيير المفتاح 🔑
                    </a>
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    المفتاح مجاني بالكامل من Google AI Studio ويدعم استدعاء الأدوات (Function Calling).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-neutral-800 space-y-2">
                  <span className="text-neutral-300 font-bold block">الصلاحيات الممنوحة لعامر:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>قراءة بيانات الخزنة والـ IMEI</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>تحديث حالة الأجهزة (DONE/IN_PROGRESS)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>إعداد رسائل الواتساب الفورية</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>إحصاء الأرباح والتقارير اليومية</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/vault"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#FFC400] hover:bg-[#E0AC00] text-black font-black text-xs flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <span>فتح الخزنة وتجربة عامر الآن 🤖🛡️</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD FAULT (الدكتور الذكي) */}
      {/* ======================================================== */}
      {showAddFaultModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl max-w-xl w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-base font-black text-white">إضافة عطل جديد في الدكتور الذكي</h2>
              <button onClick={() => setShowAddFaultModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateFault} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">الشركة:</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  >
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="iPhone">iPhone</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Tecno">Tecno</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">موديل الجهاز:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: Galaxy A12 أو Redmi Note 11"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">سحبة الباور سبلاي (Power Draw):</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: 0.80->0 أو Short 0.00->2.5A أو 0.05 ثابت"
                  value={powerDraw}
                  onChange={(e) => setPowerDraw(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">التشخيص (بالعامية الأردنية للفنيين):</label>
                <textarea
                  required
                  rows={2}
                  placeholder="مثال: فصل باور مفاجئ بعد ضغطة زر الباور، خط VDD_MAIN مسرب..."
                  value={diagnosisAr}
                  onChange={(e) => setDiagnosisAr(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">المكوّن التالف المشتبه به:</label>
                  <input
                    type="text"
                    placeholder="مثال: آيسي باور S2MU106X01"
                    value={faultyComponent}
                    onChange={(e) => setFaultyComponent(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">نقطة الفحص (Test Point):</label>
                  <input
                    type="text"
                    placeholder="مثال: فحص ممانعة خط VDD_MAIN حول U5002"
                    value={testPoint}
                    onChange={(e) => setTestPoint(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">نسبة نجاح الإصلاح (%):</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={successRate}
                    onChange={(e) => setSuccessRate(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">سعر الإصلاح التقديري (JOD):</label>
                  <input
                    type="number"
                    min="1"
                    value={fixPriceJOD}
                    onChange={(e) => setFixPriceJOD(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFaultModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#FFC400] text-black font-black hover:bg-[#E0AC00]"
                >
                  حفظ العطل في الدكتور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD BOARD (إضافة لوحة جديدة) */}
      {/* ======================================================== */}
      {showAddBoardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-base font-black text-white">إضافة لوحة هاتف جديدة للمخططات</h2>
              <button onClick={() => setShowAddBoardModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">معرّف اللوحة (ID بالإنجليزية):</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: a12 أو redmi-note11 أو s21"
                  value={boardIdInput}
                  onChange={(e) => setBoardIdInput(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">اسم اللوحة الكامل والموديل:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: Samsung Galaxy A12 (SM-A125F)"
                  value={boardNameInput}
                  onChange={(e) => setBoardNameInput(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">رابط صورة اللوحة (عالية الدقة):</label>
                <input
                  type="url"
                  required
                  placeholder="https://... رابط صورة اللوحة (PCB)"
                  value={boardImageInput}
                  onChange={(e) => setBoardImageInput(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBoardModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-black hover:bg-blue-500"
                >
                  إضافة اللوحة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD TRACK (إضافة مسار SVG للوحة) */}
      {/* ======================================================== */}
      {showAddTrackModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-base font-black text-white">إضافة مسار كهربائي (Net) للوحة</h2>
              <button onClick={() => setShowAddTrackModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddTrack} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">اسم المسار بالعربي:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: مسار الشحن الرئيسي VBUS"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">اسم الشبكة (Net Name):</label>
                  <input
                    type="text"
                    placeholder="مثال: VBUS_5V_IN"
                    value={trackNet}
                    onChange={(e) => setTrackNet(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">الجهد المتوقع:</label>
                  <input
                    type="text"
                    placeholder="5.0V أو 3.8V أو 1.8V"
                    value={trackVoltage}
                    onChange={(e) => setTrackVoltage(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white outline-none focus:border-[#FFC400]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">لون المسار (HEX):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={trackColor}
                      onChange={(e) => setTrackColor(e.target.value)}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={trackColor}
                      onChange={(e) => setTrackColor(e.target.value)}
                      className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">إحداثيات مسار SVG (Path D):</label>
                <input
                  type="text"
                  required
                  placeholder="M 150 500 L 150 300 L 320 300"
                  value={trackPathD}
                  onChange={(e) => setTrackPathD(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg p-2.5 text-white font-mono outline-none focus:border-[#FFC400]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#1A1A1A] p-2.5 rounded-xl border border-neutral-800">
                <div className="col-span-3 font-bold text-neutral-300">📍 نقطة البداية (Start Point):</div>
                <input
                  type="text"
                  placeholder="تسمية (سوكت الشحن)"
                  value={startLabel}
                  onChange={(e) => setStartLabel(e.target.value)}
                  className="bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-white"
                />
                <input
                  type="number"
                  placeholder="X (150)"
                  value={startX}
                  onChange={(e) => setStartX(e.target.value)}
                  className="bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-white"
                />
                <input
                  type="number"
                  placeholder="Y (500)"
                  value={startY}
                  onChange={(e) => setStartY(e.target.value)}
                  className="bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#1A1A1A] p-2.5 rounded-xl border border-neutral-800">
                <div className="col-span-3 font-bold text-neutral-300">🎯 نقطة النهاية (End Point):</div>
                <input
                  type="text"
                  placeholder="تسمية (آيسي الشحن)"
                  value={endLabel}
                  onChange={(e) => setEndLabel(e.target.value)}
                  className="bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-white"
                />
                <input
                  type="number"
                  placeholder="X (320)"
                  value={endX}
                  onChange={(e) => setEndX(e.target.value)}
                  className="bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-white"
                />
                <input
                  type="number"
                  placeholder="Y (300)"
                  value={endY}
                  onChange={(e) => setEndY(e.target.value)}
                  className="bg-[#242424] border border-[#3A3A3A] rounded p-1.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTrackModal(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-[#FFC400] text-black font-black hover:bg-[#E0AC00]"
                >
                  حفظ المسار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
