with open(r"src/app/schematic/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_slider_block = """          {/* ── Two-Tier Brand + Model Sliders ── */}
          <div className="space-y-2">

            {/* ── Row 1: Brand Selector ── */}
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1 mb-1">
              <span className="font-bold flex items-center gap-1.5 text-neutral-300">
                <span>🏢</span>
                <span>اختر الشركة:</span>
              </span>
              <span className="text-[11px] text-neutral-500">👈 سحب للتنقل 👉</span>
            </div>
            <div
              className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1 snap-x scroll-smooth cursor-grab active:cursor-grabbing select-none"
              style={{ WebkitOverflowScrolling: "touch" }}
              onMouseDown={(e) => {
                const el = e.currentTarget;
                const startX = e.pageX - el.offsetLeft;
                const sl = el.scrollLeft;
                const onMove = (ev: MouseEvent) => { el.scrollLeft = sl - (ev.pageX - el.offsetLeft - startX); };
                const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
              }}
            >
              {brandGroups.map((group) => {
                const isActive = selectedBrand === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(group.id);
                      if (group.boards[0]) selectBoard(group.boards[0].id);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl shrink-0 snap-start border transition-all ${
                      isActive
                        ? "bg-[#FFC400] text-black border-[#FFC400] font-black shadow-[0_0_20px_rgba(255,196,0,0.35)]"
                        : "bg-[#141414] border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white"
                    }`}
                  >
                    <span className="text-lg shrink-0">{group.icon}</span>
                    <div className="flex flex-col text-right">
                      <span className="text-xs font-black whitespace-nowrap leading-tight">{group.nameAr}</span>
                      <span className={`text-[10px] font-mono ${isActive ? "text-black/70" : "text-neutral-500"}`}>
                        {group.boards.length} موديل
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Row 2: Model Selector (filtered by selectedBrand) ── */}
            {(() => {
              const activeGroup = brandGroups.find((g) => g.id === selectedBrand);
              const models = activeGroup?.boards ?? [];
              return (
                <>
                  <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                    <span className="font-bold flex items-center gap-1.5 text-neutral-300">
                      <span>📱</span>
                      <span>موديلات {activeGroup?.nameAr ?? ""}:</span>
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${activeGroup?.badgeColor ?? ""}`}>
                      {models.length} موديل
                    </span>
                  </div>
                  <div
                    className="flex gap-2 overflow-x-auto no-scrollbar py-1 px-1 snap-x scroll-smooth cursor-grab active:cursor-grabbing select-none"
                    style={{ WebkitOverflowScrolling: "touch" }}
                    onMouseDown={(e) => {
                      const el = e.currentTarget;
                      const startX = e.pageX - el.offsetLeft;
                      const sl = el.scrollLeft;
                      const onMove = (ev: MouseEvent) => { el.scrollLeft = sl - (ev.pageX - el.offsetLeft - startX); };
                      const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
                      document.addEventListener("mousemove", onMove);
                      document.addEventListener("mouseup", onUp);
                    }}
                  >
                    {models.map((b) => {
                      const isSelected = selectedBoardId === b.id;
                      const shortName = b.name
                        .replace(/Samsung Galaxy /i, "")
                        .replace(/Apple /i, "")
                        .replace(/Xiaomi /i, "")
                        .replace(/Redmi /i, "")
                        .replace(/Infinix /i, "")
                        .replace(/Tecno /i, "")
                        .split("(")[0].trim();
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => selectBoard(b.id)}
                          className={`flex flex-col items-end px-3.5 py-2.5 rounded-xl shrink-0 snap-start border transition-all text-right ${
                            isSelected
                              ? "bg-[#FFC400] text-black border-[#FFC400] font-black shadow-[0_0_15px_rgba(255,196,0,0.3)]"
                              : "bg-[#141414] border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white"
                          }`}
                        >
                          <span className="text-xs font-black whitespace-nowrap leading-tight">{shortName}</span>
                          <div className={`flex items-center gap-1.5 mt-0.5 ${isSelected ? "text-black/70" : "text-neutral-500"}`}>
                            <span className="text-[10px] font-mono">⚡{b.tracks.length}</span>
                            {b.year && <span className="text-[10px]">• {b.year}</span>}
                            {customBoards.some((cb) => cb.id === b.id) && (
                              <span
                                onClick={(e) => handleDeleteCustomBoard(b.id, e)}
                                title="حذف"
                                className={`p-0.5 rounded ${isSelected ? "hover:bg-black/20 text-black/60" : "hover:bg-red-500/20 text-red-400"}`}
                              >
                                <Trash2 className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>{/* end two-tier sliders */}"""

new_slider_block = """          {/* ── Two-Tier Brand + Model Sliders (Compact Filter-Style) ── */}
          <div className="space-y-2">

            {/* ── Row 1: Brand Selector (Matching Filter Pills Style) ── */}
            <div
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 snap-x scroll-smooth cursor-grab active:cursor-grabbing select-none"
              style={{ WebkitOverflowScrolling: "touch" }}
              onMouseDown={(e) => {
                const el = e.currentTarget;
                const startX = e.pageX - el.offsetLeft;
                const sl = el.scrollLeft;
                const onMove = (ev: MouseEvent) => { el.scrollLeft = sl - (ev.pageX - el.offsetLeft - startX); };
                const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
              }}
            >
              <span className="text-xs text-neutral-500 shrink-0 ml-1">الشركة:</span>
              {brandGroups.map((group) => {
                const isActive = selectedBrand === group.id;
                const displayName = group.id === "samsung" ? "سامسونج"
                  : group.id === "apple" ? "أبل"
                  : group.id === "xiaomi" ? "شاومي"
                  : group.id === "infinix" ? "إنفينكس"
                  : group.id === "tecno" ? "تكنو"
                  : group.id === "custom" ? "بورداتي"
                  : "غيرها";
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(group.id);
                      if (group.boards[0]) selectBoard(group.boards[0].id);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 snap-start whitespace-nowrap border ${
                      isActive
                        ? "bg-[#FFC400] text-black border-[#FFC400] shadow-[0_0_10px_rgba(255,196,0,0.25)] font-black"
                        : "border-neutral-700 text-neutral-400 hover:border-[#FFC400]/40 hover:text-[#FFC400] bg-transparent"
                    }`}
                  >
                    <span>{group.icon}</span>
                    <span>{displayName}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? "bg-black/20 text-black font-black" : "bg-neutral-800 text-neutral-400"}`}>
                      {group.boards.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Row 2: Model Selector (Matching Filter Pills Style) ── */}
            {(() => {
              const activeGroup = brandGroups.find((g) => g.id === selectedBrand);
              const models = activeGroup?.boards ?? [];
              return (
                <div
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 snap-x scroll-smooth cursor-grab active:cursor-grabbing select-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                  onMouseDown={(e) => {
                    const el = e.currentTarget;
                    const startX = e.pageX - el.offsetLeft;
                    const sl = el.scrollLeft;
                    const onMove = (ev: MouseEvent) => { el.scrollLeft = sl - (ev.pageX - el.offsetLeft - startX); };
                    const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
                    document.addEventListener("mousemove", onMove);
                    document.addEventListener("mouseup", onUp);
                  }}
                >
                  <span className="text-xs text-neutral-500 shrink-0 ml-1">الموديل:</span>
                  {models.map((b) => {
                    const isSelected = selectedBoardId === b.id;
                    const shortName = b.name
                      .replace(/Samsung Galaxy /i, "")
                      .replace(/Samsung /i, "")
                      .replace(/Apple /i, "")
                      .replace(/Xiaomi /i, "")
                      .replace(/Redmi /i, "")
                      .replace(/Infinix /i, "")
                      .replace(/Tecno /i, "")
                      .split("(")[0].trim();
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => selectBoard(b.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 snap-start whitespace-nowrap border ${
                          isSelected
                            ? "bg-[#FFC400] text-black border-[#FFC400] shadow-[0_0_10px_rgba(255,196,0,0.25)] font-black"
                            : "border-neutral-700 text-neutral-400 hover:border-[#FFC400]/40 hover:text-[#FFC400] bg-transparent"
                        }`}
                      >
                        <span>{shortName}</span>
                        <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${isSelected ? "bg-black/20 text-black font-black" : "bg-neutral-800 text-neutral-500"}`}>
                          ⚡{b.tracks.length}
                        </span>
                        {customBoards.some((cb) => cb.id === b.id) && (
                          <span
                            onClick={(e) => handleDeleteCustomBoard(b.id, e)}
                            title="حذف"
                            className={`p-0.5 rounded ${isSelected ? "hover:bg-black/20 text-black/60" : "hover:bg-red-500/20 text-red-400"}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>{/* end two-tier sliders */}"""

c_norm = content.replace("\r\n", "\n")
old_norm = old_slider_block.replace("\r\n", "\n")
new_norm = new_slider_block.replace("\r\n", "\n")

if old_norm in c_norm:
    c_norm = c_norm.replace(old_norm, new_norm, 1)
    with open(r"src/app/schematic/page.tsx", "w", encoding="utf-8") as f:
        f.write(c_norm)
    print("Sliders style unified successfully!")
else:
    print("Could not find old_slider_block in schematic/page.tsx")
