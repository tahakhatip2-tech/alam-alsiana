import re

with open('src/app/schematic/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update imports
old_import = '''import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Cpu,
  MapPin,
  Info,
  Activity,
  X,
  Search,
  Zap,
  Monitor,
  Wifi,
  Mic,
  Camera,
  HardDrive,
  Plug,
  ExternalLink,
  Volume2,
  VolumeX,
  Eye,
  Crosshair,
  Move,
  Gauge,
  AlertTriangle,
} from "lucide-react";'''

new_import = '''import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Cpu,
  MapPin,
  Info,
  Activity,
  X,
  Search,
  Zap,
  Monitor,
  Wifi,
  Mic,
  Camera,
  HardDrive,
  Plug,
  ExternalLink,
  Volume2,
  VolumeX,
  Eye,
  Crosshair,
  Move,
  Gauge,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  FileCode,
  Check,
  FileText,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";'''

if old_import in code:
    code = code.replace(old_import, new_import)
    print("Replaced lucide imports")
else:
    print("Lucide imports not found as exact match")

# Also import BoardModelConfig from schematic-data
code = code.replace(
    'import {\n  BOARDS_CONFIG,\n  BoardTrack,\n  TrackCategory,\n} from "@/lib/schematic-data";',
    'import {\n  BOARDS_CONFIG,\n  BoardTrack,\n  TrackCategory,\n  BoardModelConfig,\n} from "@/lib/schematic-data";'
)

# 2. Add custom boards state & upload modal state right inside SchematicPage
state_needle = '  const [selectedBoardId, setSelectedBoardId] = useState(\n    BOARDS_CONFIG[0]?.id ?? "a12"\n  );'
new_state = '''  // ── Custom Boards Upload & Persistence ───────────────────────────────────────
  const [customBoards, setCustomBoards] = useState<BoardModelConfig[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alam_custom_boards");
      if (saved) {
        setCustomBoards(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load custom boards:", e);
    }
  }, []);

  const allBoards = useMemo(() => {
    return [...customBoards, ...BOARDS_CONFIG];
  }, [customBoards]);

  const [selectedBoardId, setSelectedBoardId] = useState(
    BOARDS_CONFIG[0]?.id ?? "a12"
  );'''

if state_needle in code:
    code = code.replace(state_needle, new_state)
    print("Added custom boards state")
else:
    print("State needle not found")

# Replace BOARDS_CONFIG in stats & filteredBoards & currentBoard
code = code.replace(
    '  const totalModels = BOARDS_CONFIG.length;\n  const totalTracks = useMemo(\n    () => BOARDS_CONFIG.reduce((sum, b) => sum + b.tracks.length, 0),\n    []\n  );\n  const uniqueBrands = useMemo(\n    () => [...new Set(BOARDS_CONFIG.map((b) => b.brand))].join(" / "),\n    []\n  );',
    '  const totalModels = allBoards.length;\n  const totalTracks = useMemo(\n    () => allBoards.reduce((sum, b) => sum + b.tracks.length, 0),\n    [allBoards]\n  );\n  const uniqueBrands = useMemo(\n    () => [...new Set(allBoards.map((b) => b.brand))].join(" / "),\n    [allBoards]\n  );'
)

code = code.replace(
    '    return BOARDS_CONFIG.filter((board) => {',
    '    return allBoards.filter((board) => {'
)

code = code.replace(
    '  }, [brandFilter, searchText]);',
    '  }, [allBoards, brandFilter, searchText]);'
)

code = code.replace(
    '  const currentBoard = useMemo(() => {\n    return (\n      BOARDS_CONFIG.find((b) => b.id === selectedBoardId) ?? BOARDS_CONFIG[0]\n    );\n  }, [selectedBoardId]);',
    '  const currentBoard = useMemo(() => {\n    return (\n      allBoards.find((b) => b.id === selectedBoardId) ?? allBoards[0] ?? BOARDS_CONFIG[0]\n    );\n  }, [allBoards, selectedBoardId]);'
)

code = code.replace(
    '  const selectBoard = (id: string) => {\n    const board = BOARDS_CONFIG.find((b) => b.id === id);',
    '  const selectBoard = (id: string) => {\n    const board = allBoards.find((b) => b.id === id);'
)

# 3. Add Save & Delete handlers for custom boards
handlers_to_insert = '''  // ── Custom Board Handlers ──────────────────────────────────────────────────
  const handleSaveCustomBoard = (newBoard: BoardModelConfig) => {
    const updated = [newBoard, ...customBoards.filter((b) => b.id !== newBoard.id)];
    setCustomBoards(updated);
    try {
      localStorage.setItem("alam_custom_boards", JSON.stringify(updated));
    } catch (e) {
      console.error("Local storage error:", e);
    }
    setSelectedBoardId(newBoard.id);
    if (newBoard.tracks && newBoard.tracks.length > 0) {
      setActiveTrackId(newBoard.tracks[0].id);
    }
    setUploadModalOpen(false);
  };

  const handleDeleteCustomBoard = (boardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customBoards.filter((b) => b.id !== boardId);
    setCustomBoards(updated);
    try {
      localStorage.setItem("alam_custom_boards", JSON.stringify(updated));
    } catch (e) {}
    if (selectedBoardId === boardId) {
      setSelectedBoardId(BOARDS_CONFIG[0].id);
      setActiveTrackId(BOARDS_CONFIG[0].tracks[0]?.id ?? "");
    }
  };
'''

code = code.replace(
    '  const selectBoard = (id: string) => {',
    handlers_to_insert + '\n  const selectBoard = (id: string) => {'
)

# 4. Add "Upload Custom Board" Button next to Multimeter toggle button
quick_btn_target = '''            <button
              onClick={() => setMultimeterOpen((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                multimeterOpen
                  ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                  : "bg-[#141414] text-neutral-300 border-[#333] hover:border-amber-500/50 hover:text-amber-400"
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>{multimeterOpen ? "إخفاء الملتيميتر" : "وضع فحص الملتيميتر"}</span>
            </button>'''

quick_btn_replacement = '''            <button
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
            </button>'''

code = code.replace(quick_btn_target, quick_btn_replacement)

# 5. In the board switcher buttons, add badge and delete button for custom boards
board_btn_needle = '''                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] ${selectedBoardId === b.id ? "text-black/60" : "text-neutral-500"}`}
                  >
                    {b.brand}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1 rounded ${
                      selectedBoardId === b.id
                        ? "bg-black/20 text-black"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {b.tracks.length}
                  </span>
                </div>'''

board_btn_replacement = '''                <div className="flex items-center gap-1 w-full justify-between">
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] ${selectedBoardId === b.id ? "text-black/60" : "text-neutral-500"}`}
                    >
                      {b.brand}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1 rounded ${
                        selectedBoardId === b.id
                          ? "bg-black/20 text-black"
                          : "bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      {b.tracks.length}
                    </span>
                  </div>
                  {customBoards.some((cb) => cb.id === b.id) && (
                    <span
                      onClick={(e) => handleDeleteCustomBoard(b.id, e)}
                      title="حذف البوردة المخصصة"
                      className="p-0.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  )}
                </div>'''

code = code.replace(board_btn_needle, board_btn_replacement)

with open('src/app/schematic/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated schematic/page.tsx with state and buttons.")
