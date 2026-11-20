with open(r"src/app/schematic/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_block = """      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-[#222] pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>ZXW Killer — منصة المخططات الاحترافية المجانية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <span>مخططات الدوائر وتتبع المسارات الحية</span>
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              خرائط PCB تفاعلية مع قياسات ممانعة الملتيميتر (Diode Mode) وجهود التشغيل ونقاط الفحص الحقيقية
            </p>
          </div>

          {/* Quick Multimeter Toggle Pill */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setMultimeterOpen((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                multimeterOpen
                  ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  : "bg-[#141414] text-neutral-300 border-[#333] hover:border-amber-500/50 hover:text-amber-400"
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>{multimeterOpen ? "إخفاء الملتيميتر" : "وضع فحص الملتيميتر"}</span>
            </button>

            {/* Custom Board / BRD Upload Button */}
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]"
              title="رفع مخطط أو كروكي بوردة مخصصة (.brd / .json / صورة)"
            >
              <Upload className="w-4 h-4" />
              <span>رفع كروكي / مخطط مخصص</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-3 flex-wrap text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <span>📱</span>
            <span className="text-white font-bold">{totalModels}</span>
            <span>موديل مكتمل</span>
          </span>
          <span className="text-neutral-700">|</span>
          <span className="flex items-center gap-1">
            <span>⚡</span>
            <span className="text-white font-bold">{totalTracks}+</span>
            <span>مسار جهد ونقطة فحص</span>
          </span>
          <span className="text-neutral-700">|</span>
          <span className="flex items-center gap-1">
            <span>🔬</span>
            <span className="text-white font-bold">100% قياسات ممانعة حقيقية</span>
          </span>
          <span className="text-neutral-700">|</span>
          <span className="flex items-center gap-1">
            <span>🔧</span>
            <span className="text-white font-bold">{uniqueBrands}</span>
          </span>
        </div>"""

new_block = """      {/* ── 3D Hero Header Banner ──────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden border border-[#FFC400]/25 bg-[#080808] shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_50px_rgba(255,196,0,0.08)] p-6 sm:p-8">
        {/* Background 3D Artwork with Visual Identity Overlays */}
        <div
          className="absolute inset-0 bg-cover bg-left sm:bg-center opacity-30 mix-blend-luminosity pointer-events-none transition-all duration-700 hover:opacity-40 scale-105"
          style={{ backgroundImage: "url('/schematic-hero-3d.jpg')" }}
        />
        {/* Dark & Gold Gradient Overlays for High Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/90 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-black/30 pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-72 h-72 rounded-full bg-[#FFC400]/12 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FFC400]/20 via-amber-500/15 to-transparent text-[#FFC400] text-xs font-bold mb-3 border border-[#FFC400]/30 backdrop-blur-md shadow-[0_0_15px_rgba(255,196,0,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-[#FFC400] animate-pulse" />
                <span>ZXW Killer — منصة المخططات وتتبع المسارات الاحترافية الحية</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
                <span>مخططات الدوائر وتتبع المسارات الحية</span>
              </h1>
              <p className="text-neutral-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                خرائط PCB تفاعلية مع قياسات ممانعة الملتيميتر (Diode Mode) وجهود التشغيل ونقاط الفحص الحقيقية
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                onClick={() => setMultimeterOpen((prev) => !prev)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-lg backdrop-blur-md ${
                  multimeterOpen
                    ? "bg-[#FFC400] text-black border-[#FFC400] shadow-[0_0_20px_rgba(255,196,0,0.5)] font-black"
                    : "bg-[#141414]/90 text-neutral-200 border-neutral-700 hover:border-[#FFC400]/60 hover:text-[#FFC400]"
                }`}
              >
                <Gauge className="w-4 h-4" />
                <span>{multimeterOpen ? "إخفاء الملتيميتر" : "وضع فحص الملتيميتر"}</span>
              </button>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] backdrop-blur-md"
                title="رفع مخطط أو كروكي بوردة مخصصة (.brd / .json / صورة)"
              >
                <Upload className="w-4 h-4" />
                <span>رفع كروكي مخصص</span>
              </button>
            </div>
          </div>

          {/* Glassmorphic Stats Pills */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs pt-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-neutral-300">
              <span>📱</span>
              <span className="text-[#FFC400] font-black">{totalModels}</span>
              <span>موديل مكتمل</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-neutral-300">
              <span>⚡</span>
              <span className="text-[#FFC400] font-black">{totalTracks}+</span>
              <span>مسار ونقطة فحص</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-neutral-300">
              <span>🔬</span>
              <span className="text-emerald-400 font-bold">100% قياسات ممانعة حقيقية</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-neutral-300">
              <span>🔧</span>
              <span className="text-neutral-200 font-medium">{uniqueBrands}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">"""

# Normalize newlines for replacement
c_norm = content.replace("\r\n", "\n")
old_norm = old_block.replace("\r\n", "\n")
new_norm = new_block.replace("\r\n", "\n")

if old_norm in c_norm:
    c_norm = c_norm.replace(old_norm, new_norm, 1)
    with open(r"src/app/schematic/page.tsx", "w", encoding="utf-8") as f:
        f.write(c_norm)
    print("Schematic Hero updated successfully!")
else:
    print("Could not find old_block in schematic/page.tsx")
