import re

with open('src/app/schematic/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Ensure ChevronDown and Smartphone are imported
if 'ChevronDown,' not in code:
    code = code.replace(
        '  Upload,\n  Plus,\n',
        '  Upload,\n  Plus,\n  ChevronDown,\n  Smartphone,\n'
    )
    print("Added ChevronDown and Smartphone imports")

# 2. Add openBrandDropdown state & dropdownRef inside SchematicPage
state_anchor = '  const [uploadModalOpen, setUploadModalOpen] = useState(false);'
new_dropdown_state = '''  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [openBrandDropdown, setOpenBrandDropdown] = useState<string | null>(null);
  const brandDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        brandDropdownRef.current &&
        !brandDropdownRef.current.contains(e.target as Node)
      ) {
        setOpenBrandDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);'''

code = code.replace(state_anchor, new_dropdown_state)
print("Added brand dropdown state & outside click handler")

# 3. Add brandGroups definition
stats_anchor = '  // ── Filtered boards for switcher ─────────────────────────────────────────────'
brand_groups_code = '''  // ── Grouped Boards by Brand for Touch Slider Dropdowns ───────────────────────
  interface BrandGroup {
    id: string;
    name: string;
    nameAr: string;
    icon: string;
    badgeColor: string;
    boards: BoardModelConfig[];
  }

  const brandGroups = useMemo(() => {
    const samsung = allBoards.filter((b) => b.brand === "Samsung");
    const apple = allBoards.filter((b) => b.brand === "Apple");
    const xiaomi = allBoards.filter((b) => b.brand === "Xiaomi");
    const infinix = allBoards.filter(
      (b) =>
        b.brand === "Other" &&
        (b.name.toLowerCase().includes("infinix") ||
          (b.tags && b.tags.some((t) => t.toLowerCase().includes("infinix"))))
    );
    const tecno = allBoards.filter((b) => b.brand === "Tecno");
    const other = allBoards.filter(
      (b) =>
        b.brand === "Other" &&
        !b.name.toLowerCase().includes("infinix") &&
        !(b.tags && b.tags.some((t) => t.toLowerCase().includes("infinix"))) &&
        !customBoards.some((cb) => cb.id === b.id)
    );
    const custom = customBoards;

    const groups: BrandGroup[] = [
      {
        id: "samsung",
        name: "Samsung",
        nameAr: "سامسونج Samsung",
        icon: "📱",
        badgeColor: "border-blue-500/40 text-blue-400 bg-blue-500/10",
        boards: samsung,
      },
      {
        id: "apple",
        name: "Apple iPhone",
        nameAr: "أبل Apple iPhone",
        icon: "🍏",
        badgeColor: "border-neutral-400/40 text-neutral-200 bg-neutral-500/10",
        boards: apple,
      },
      {
        id: "xiaomi",
        name: "Xiaomi & Redmi",
        nameAr: "شاومي وريدمي Xiaomi",
        icon: "⚡",
        badgeColor: "border-orange-500/40 text-orange-400 bg-orange-500/10",
        boards: xiaomi,
      },
      {
        id: "infinix",
        name: "Infinix",
        nameAr: "إنفينكس Infinix",
        icon: "🚀",
        badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
        boards: infinix,
      },
      {
        id: "tecno",
        name: "Tecno",
        nameAr: "تكنو Tecno",
        icon: "🛡️",
        badgeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
        boards: tecno,
      },
      {
        id: "other",
        name: "Honor / Oppo / Other",
        nameAr: "هونر وأوبو وغيرها",
        icon: "🌐",
        badgeColor: "border-purple-500/40 text-purple-400 bg-purple-500/10",
        boards: other,
      },
    ];

    if (custom.length > 0) {
      groups.unshift({
        id: "custom",
        name: "Custom Boards",
        nameAr: "بورداتي المخصصة",
        icon: "📁",
        badgeColor: "border-[#FFC400]/40 text-[#FFC400] bg-[#FFC400]/10",
        boards: custom,
      });
    }

    return groups;
  }, [allBoards, customBoards]);
'''

code = code.replace(stats_anchor, brand_groups_code + '\n' + stats_anchor)
print("Added brandGroups useMemo logic")

# 4. Replace the old Brand Filter + Giant Board Switcher with the new Brand Dropdown Touch Slider
old_switcher_block_start = '        {/* Search & Filter Bar */}'
old_switcher_block_end = '      {/* ── Virtual Multimeter Panel (HUD) ─────────────────────────────────── */}'

# Let's inspect what is between them in code
start_idx = code.find(old_switcher_block_start)
end_idx = code.find(old_switcher_block_end)

if start_idx != -1 and end_idx != -1:
    print(f"Found block between {start_idx} and {end_idx}")
    new_switcher_jsx = '''        {/* Search & Filter Bar */}
        <div className="space-y-3">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="ابحث بالاسم، الموديل، المعالج، أو اسم المسار (مثل: S23 Ultra, A54, VBUS, LCD, PMIC)..."
              className="w-full bg-[#141414] border border-[#262626] rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#FFC400]/50 transition-colors"
            />
          </div>

          {/* Quick Search Results if search text is typed */}
          {searchText.trim() && (
            <div className="bg-[#141414] border border-[#FFC400]/40 rounded-xl p-3 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>نتائج البحث السريع عن "{searchText}":</span>
                <span className="text-[#FFC400] font-bold">{filteredBoards.length} موديل مطابقة</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {filteredBoards.length === 0 ? (
                  <span className="text-xs text-neutral-500 py-1">لا توجد نتائج مطابقة لبحثك</span>
                ) : (
                  filteredBoards.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        selectBoard(b.id);
                        setSearchText("");
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                        selectedBoardId === b.id
                          ? "bg-[#FFC400] text-black shadow-[0_0_10px_rgba(255,196,0,0.3)]"
                          : "border border-neutral-700 text-neutral-300 hover:border-[#FFC400] hover:text-[#FFC400]"
                      }`}
                    >
                      {b.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── Brand Dropdowns Touch Slider ── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
              <span className="font-bold flex items-center gap-1.5 text-neutral-300">
                <span>📂</span>
                <span>اختر الشركة / الماركة لتصفح موديلاتها ومخططاتها:</span>
              </span>
              <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                <span>👈</span>
                <span>سلايدر متحرك باللمس</span>
                <span>👉</span>
              </span>
            </div>

            <div
              ref={brandDropdownRef}
              className="relative flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1 touch-pan-x snap-x scroll-smooth"
            >
              {brandGroups.map((group) => {
                const isGroupActive = group.boards.some((b) => b.id === selectedBoardId);
                const isDropdownOpen = openBrandDropdown === group.id;
                const activeBoardInGroup = group.boards.find((b) => b.id === selectedBoardId);

                return (
                  <div key={group.id} className="relative flex-shrink-0 snap-start">
                    <button
                      type="button"
                      onClick={() => setOpenBrandDropdown(isDropdownOpen ? null : group.id)}
                      className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-3 border text-right select-none ${
                        isGroupActive
                          ? "bg-gradient-to-r from-[#FFC400]/20 via-amber-500/10 to-[#141414] border-[#FFC400] text-white shadow-[0_0_20px_rgba(255,196,0,0.25)] ring-1 ring-[#FFC400]/40"
                          : "bg-[#141414] border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white"
                      }`}
                    >
                      <span className="text-xl shrink-0">{group.icon}</span>
                      <div className="flex flex-col text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black tracking-wide whitespace-nowrap">
                            {group.nameAr}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${group.badgeColor}`}
                          >
                            {group.boards.length}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-neutral-400 mt-0.5 truncate max-w-[150px]">
                          {isGroupActive && activeBoardInGroup
                            ? activeBoardInGroup.name.split("(")[0].trim()
                            : `${group.boards.length} موديلات`}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 mr-1 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180 text-[#FFC400]" : "text-neutral-500"
                        }`}
                      />
                    </button>

                    {/* Floating Dropdown for this specific Brand */}
                    {isDropdownOpen && (
                      <div className="absolute top-full mt-2 right-0 z-50 w-72 sm:w-80 bg-[#101010]/95 backdrop-blur-xl border-2 border-neutral-700/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,196,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-2">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-800 text-xs">
                          <span className="font-black text-white flex items-center gap-1.5">
                            <span>{group.icon}</span>
                            <span>{group.nameAr}</span>
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {group.boards.length} موديلات
                          </span>
                        </div>

                        <div className="max-h-72 overflow-y-auto no-scrollbar py-1 space-y-1">
                          {group.boards.map((b) => {
                            const isSelected = selectedBoardId === b.id;
                            return (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => {
                                  selectBoard(b.id);
                                  setOpenBrandDropdown(null);
                                }}
                                className={`w-full text-right p-2.5 rounded-xl transition-all flex items-center justify-between gap-2 ${
                                  isSelected
                                    ? "bg-[#FFC400] text-black font-bold shadow-[0_0_12px_rgba(255,196,0,0.3)]"
                                    : "hover:bg-white/5 text-neutral-300 hover:text-white"
                                }`}
                              >
                                <div className="flex flex-col text-right truncate">
                                  <span className="text-xs font-black truncate leading-tight">
                                    {b.name}
                                  </span>
                                  <span
                                    className={`text-[10px] mt-0.5 truncate ${
                                      isSelected ? "text-black/70" : "text-neutral-500"
                                    }`}
                                  >
                                    {b.chipset} {b.year ? `• ${b.year}` : ""}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span
                                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                      isSelected
                                        ? "bg-black/20 text-black font-bold"
                                        : "bg-neutral-800 text-neutral-400"
                                    }`}
                                  >
                                    {b.tracks.length} مسار
                                  </span>
                                  {isSelected && <Check className="w-4 h-4 text-black shrink-0" />}
                                  {customBoards.some((cb) => cb.id === b.id) && (
                                    <span
                                      onClick={(e) => handleDeleteCustomBoard(b.id, e)}
                                      title="حذف البوردة المخصصة"
                                      className="p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Board Quick Summary Banner */}
          {currentBoard && (
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#161616] to-[#121212] border border-[#FFC400]/30 text-xs shadow-inner">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[#FFC400] font-bold shrink-0">المخطط النشط حالياً:</span>
                <span className="text-white font-black truncate text-sm">{currentBoard.name}</span>
                <span className="text-neutral-400 font-mono text-[11px] shrink-0 hidden sm:inline">
                  [{currentBoard.chipset}]
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-emerald-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  ⚡ {currentBoard.tracks.length} مسارات فحص
                </span>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-xs text-neutral-500 ml-1">فلترة مسارات اللوحة:</span>
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === "all"
                  ? "bg-[#FFC400] text-black shadow-[0_0_10px_rgba(255,196,0,0.25)]"
                  : "border border-neutral-700 text-neutral-400 hover:border-[#FFC400]/40 hover:text-[#FFC400] bg-transparent"
              }`}
            >
              كافة المسارات
            </button>
            {(Object.keys(CATEGORY_CONFIG) as TrackCategory[]).map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    categoryFilter === cat
                      ? "text-black shadow-[0_0_10px_rgba(255,196,0,0.2)]"
                      : "border border-neutral-700 text-neutral-400 hover:text-white bg-transparent"
                  }`}
                  style={
                    categoryFilter === cat
                      ? { backgroundColor: cfg.color }
                      : {
                          borderColor:
                            categoryFilter === cat ? cfg.color : undefined,
                        }
                  }
                >
                  {cfg.icon}
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

'''
    code = code[:start_idx] + new_switcher_jsx + code[end_idx:]
    with open('src/app/schematic/page.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Replaced old switcher with new brand slider successfully!")
else:
    print("Could not find start or end index")
