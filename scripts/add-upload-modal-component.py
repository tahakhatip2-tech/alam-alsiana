import re

with open('src/app/schematic/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

modal_jsx = '''      {/* ── Custom Board Upload Modal ─────────────────────────────────────── */}
      {uploadModalOpen && (
        <CustomBoardUploadModal
          onClose={() => setUploadModalOpen(false)}
          onSave={handleSaveCustomBoard}
        />
      )}
    </div>
  );
}'''

# Replace the closing of the return block
code = code.replace('    </div>\n  );\n}', modal_jsx)

# Now define CustomBoardUploadModal at the bottom of the file
modal_component = '''
// ─────────────────────────────────────────────────────────────────────────────
// Custom Board & Schematic Upload Modal Component
// ─────────────────────────────────────────────────────────────────────────────
interface CustomBoardUploadModalProps {
  onClose: () => void;
  onSave: (board: BoardModelConfig) => void;
}

function CustomBoardUploadModal({ onClose, onSave }: CustomBoardUploadModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState<"Samsung" | "Xiaomi" | "Apple" | "Tecno" | "Other">("Samsung");
  const [chipset, setChipset] = useState("");
  const [year, setYear] = useState(2024);
  const [imageType, setImageType] = useState<"upload" | "generic" | "url">("upload");
  const [uploadedImageData, setUploadedImageData] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"quick" | "json">("quick");

  // Quick tracks builder
  const [quickTracks, setQuickTracks] = useState<BoardTrack[]>([
    {
      id: "tr-vbus-custom",
      name: "مسار شحن رئيسي VBUS 5V",
      net: "VBUS_5V_IN",
      voltage: "5.0V",
      color: "#EF4444",
      pathD: "M 160 540 L 160 360 L 340 360",
      startPoint: { x: 160, y: 540, label: "موصل الشحن Sub-FPC", refNumber: "CON1", type: "connector", voltage: "5.0V" },
      endPoint: { x: 340, y: 360, label: "شريحة الشحن Charger IC", refNumber: "U1", type: "IC", voltage: "5.0V" },
      category: "power",
      diodeValue: "0.520V",
      resistanceGround: "480Ω",
      expectedState: "5V ثابت عند توصيل الشاحن",
      symptoms: ["عدم الإحساس بالشاحن", "هبوط شحن البطارية"],
    },
    {
      id: "tr-vsys-custom",
      name: "خط جهد النظام الرئيسي VSYS",
      net: "VSYS_PWR",
      voltage: "3.7V - 4.2V",
      color: "#F59E0B",
      pathD: "M 340 360 L 480 360 L 480 220 L 580 220",
      startPoint: { x: 340, y: 360, label: "ملف الشحن الرئيسي L1", refNumber: "L1", type: "component", voltage: "4.0V" },
      endPoint: { x: 580, y: 220, label: "آيسي الباور الرئيسي PMIC", refNumber: "U2", type: "IC", voltage: "4.0V" },
      category: "power",
      diodeValue: "0.340V",
      resistanceGround: "12Ω",
      expectedState: "جهد البطارية دائماً",
      symptoms: ["الجهاز ميت تماماً", "شورت صريح عند ربط البطارية"],
    },
  ]);

  // JSON mode
  const [jsonInput, setJsonInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setUploadedImageData(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddQuickTrack = () => {
    const newId = `tr-custom-${Date.now()}`;
    const newTrack: BoardTrack = {
      id: newId,
      name: "مسار فحص جديد",
      net: "NET_" + Math.floor(Math.random() * 1000),
      voltage: "1.8V",
      color: "#3B82F6",
      pathD: "M 580 220 L 680 220 L 680 480",
      startPoint: { x: 580, y: 220, label: "نقطة انطلاق (Source)", refNumber: "TP1", type: "testpoint", voltage: "1.8V" },
      endPoint: { x: 680, y: 480, label: "نقطة وصول (Target)", refNumber: "CON2", type: "connector", voltage: "1.8V" },
      category: "display",
      diodeValue: "0.450V",
      resistanceGround: "OL",
      expectedState: "1.8V منطقي",
      symptoms: ["عطل في الدائرة المرتبطة"],
    };
    setQuickTracks([...quickTracks, newTrack]);
  };

  const handleRemoveTrack = (index: number) => {
    setQuickTracks(quickTracks.filter((_, i) => i !== index));
  };

  const handleUpdateTrack = (index: number, field: keyof BoardTrack, val: any) => {
    const copy = [...quickTracks];
    copy[index] = { ...copy[index], [field]: val };
    setQuickTracks(copy);
  };

  const handleLoadSampleJson = () => {
    const sample = JSON.stringify(quickTracks, null, 2);
    setJsonInput(sample);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("يرجى كتابة اسم موديل الهاتف أو البوردة");
      return;
    }

    let boardImage = "/boards/_generic_pcb.jpg";
    if (imageType === "upload" && uploadedImageData) {
      boardImage = uploadedImageData;
    } else if (imageType === "url" && imageUrl.trim()) {
      boardImage = imageUrl.trim();
    }

    let finalTracks: BoardTrack[] = quickTracks;
    if (activeTab === "json" && jsonInput.trim()) {
      try {
        const parsed = JSON.parse(jsonInput.trim());
        if (Array.isArray(parsed)) {
          finalTracks = parsed;
        } else {
          setErrorMsg("بيانات JSON يجب أن تكون مصفوفة مسارات [ { ... } ]");
          return;
        }
      } catch (err) {
        setErrorMsg("صيغة JSON غير صحيحة، تأكد من إغلاق الأقواس والفواصل");
        return;
      }
    }

    const customId = `custom-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-4)}`;
    const newBoard: BoardModelConfig = {
      id: customId,
      name: `${name.trim()} (مخصص)`,
      brand,
      chipset: chipset.trim() || "غير محدد",
      year: Number(year) || 2024,
      image: boardImage,
      tags: [name, brand, "Custom", "Uploaded"],
      tracks: finalTracks,
    };

    onSave(newBoard);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-auto bg-[#101010] border-2 border-blue-500/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(59,130,246,0.25)] p-5 sm:p-7 overflow-hidden text-right">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>رفع وإضافة كروكي بوردة أو مخطط مخصص</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                  CUSTOM BRD
                </span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                أدخل بيانات الموديل، وارفع صورة البوردة مع مسارات الفحص ليتم حفظها وتفعيلها في الملتيميتر والعارض فوراً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-neutral-300 font-bold mb-1">اسم الموديل الكامل *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: Samsung Galaxy S24 Ultra"
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">الماركة المصنعة</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as any)}
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition-all"
              >
                <option value="Samsung">Samsung</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Apple">Apple</option>
                <option value="Tecno">Tecno</option>
                <option value="Other">Honor / Infinix / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">المعالج الرئيسي (Chipset)</label>
              <input
                type="text"
                value={chipset}
                onChange={(e) => setChipset(e.target.value)}
                placeholder="مثال: Snapdragon 8 Gen 3 أو Helio G99"
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-600 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-bold mb-1">سنة الإصدار</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min="2015"
                max="2026"
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Section 2: Board Image */}
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 space-y-3">
            <label className="block text-xs font-black text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>صورة اللوحة الأم (Motherboard PCB Image)</span>
            </label>

            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setImageType("upload")}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  imageType === "upload"
                    ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    : "border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                رفع من الجهاز (PNG/JPG)
              </button>
              <button
                type="button"
                onClick={() => setImageType("generic")}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  imageType === "generic"
                    ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    : "border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                استخدام قالب PCB عالي الدقة
              </button>
              <button
                type="button"
                onClick={() => setImageType("url")}
                className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                  imageType === "url"
                    ? "bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                    : "border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                رابط صورة خارجي (URL)
              </button>
            </div>

            {imageType === "upload" && (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="w-full text-xs text-neutral-400 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
                />
                {uploadedImageData && (
                  <div className="w-16 h-16 rounded-xl border border-blue-500/50 overflow-hidden bg-black shrink-0">
                    <img src={uploadedImageData} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}

            {imageType === "url" && (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/pcb-board.jpg"
                className="w-full bg-[#181818] border border-neutral-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-600 outline-none"
              />
            )}

            {imageType === "generic" && (
              <p className="text-[11px] text-neutral-400">
                ✓ سيتم استخدام خلفية بوردة إلكترونية احترافية عالية الدقة 4K مع مسارات افتراضية جاهزة.
              </p>
            )}
          </div>

          {/* Section 3: Interactive Tracks */}
          <div className="bg-[#141414] border border-[#222] rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFC400]" />
                <span>مسارات الفحص التفاعلية ونقاط القياس (Traces & Diode Values)</span>
              </label>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("quick")}
                  className={`px-2.5 py-1 rounded-lg border font-bold transition-all ${
                    activeTab === "quick"
                      ? "bg-[#FFC400] text-black border-[#FFC400]"
                      : "border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  البناء السريع ({quickTracks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("json")}
                  className={`px-2.5 py-1 rounded-lg border font-bold transition-all ${
                    activeTab === "json"
                      ? "bg-[#FFC400] text-black border-[#FFC400]"
                      : "border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  استيراد كود JSON / BRD
                </button>
              </div>
            </div>

            {activeTab === "quick" ? (
              <div className="space-y-3">
                <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                  {quickTracks.map((tr, idx) => (
                    <div
                      key={tr.id}
                      className="p-3 rounded-xl bg-black/40 border border-neutral-800/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={tr.name}
                            onChange={(e) => handleUpdateTrack(idx, "name", e.target.value)}
                            placeholder="اسم المسار (مثل: خط الشحن VBUS)"
                            className="bg-[#181818] border border-neutral-800 rounded-lg px-2.5 py-1 text-white font-bold flex-1"
                          />
                          <input
                            type="text"
                            value={tr.net}
                            onChange={(e) => handleUpdateTrack(idx, "net", e.target.value)}
                            placeholder="الاسم الفني Net"
                            className="bg-[#181818] border border-neutral-800 rounded-lg px-2 py-1 text-neutral-300 font-mono w-28 text-[11px]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTrack(idx)}
                          className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors"
                          title="حذف المسار"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <span className="text-neutral-500 block mb-0.5">الجهد:</span>
                          <input
                            type="text"
                            value={tr.voltage}
                            onChange={(e) => handleUpdateTrack(idx, "voltage", e.target.value)}
                            className="w-full bg-[#181818] border border-neutral-800 rounded px-2 py-1 text-white font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-neutral-500 block mb-0.5">قيمة الدايود:</span>
                          <input
                            type="text"
                            value={tr.diodeValue || "0.520V"}
                            onChange={(e) => handleUpdateTrack(idx, "diodeValue", e.target.value)}
                            className="w-full bg-[#181818] border border-neutral-800 rounded px-2 py-1 text-[#FFC400] font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-neutral-500 block mb-0.5">المقاومة للأرضي:</span>
                          <input
                            type="text"
                            value={tr.resistanceGround || "480Ω"}
                            onChange={(e) => handleUpdateTrack(idx, "resistanceGround", e.target.value)}
                            className="w-full bg-[#181818] border border-neutral-800 rounded px-2 py-1 text-white font-mono"
                          />
                        </div>
                        <div>
                          <span className="text-neutral-500 block mb-0.5">الفئة:</span>
                          <select
                            value={tr.category}
                            onChange={(e) => handleUpdateTrack(idx, "category", e.target.value)}
                            className="w-full bg-[#181818] border border-neutral-800 rounded px-1.5 py-1 text-white"
                          >
                            <option value="power">باور</option>
                            <option value="display">شاشة</option>
                            <option value="memory">ذاكرة</option>
                            <option value="rf">RF</option>
                            <option value="audio">صوت</option>
                            <option value="camera">كاميرا</option>
                            <option value="cpu">معالج</option>
                            <option value="peripheral">ملحقات</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddQuickTrack}
                  className="w-full py-2 rounded-xl border border-dashed border-neutral-700 hover:border-[#FFC400] text-neutral-400 hover:text-[#FFC400] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة مسار فحص ونقطة ملتيميتر جديدة</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">الصق مصفوفة المسارات بصيغة JSON:</span>
                  <button
                    type="button"
                    onClick={handleLoadSampleJson}
                    className="text-[#FFC400] hover:underline flex items-center gap-1 font-bold"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>تحميل نموذج تجريبي</span>
                  </button>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="[ { id: 'tr-1', name: 'VBUS', voltage: '5V', diodeValue: '0.520V', ... } ]"
                  rows={7}
                  className="w-full bg-[#181818] border border-neutral-800 focus:border-[#FFC400] rounded-xl p-3 text-xs font-mono text-emerald-400 outline-none"
                />
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white font-bold text-xs transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>حفظ وعرض في المخططات فوراً</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
'''

code += modal_component

with open('src/app/schematic/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Appended CustomBoardUploadModal successfully!")
