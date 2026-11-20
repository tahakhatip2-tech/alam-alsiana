"""
fetch-generic-pcb.py
====================
جلب صور لوحات أم هواتف عامة عالية الجودة من Wikimedia
لتغطية الموديلات التي لا توجد لها صور تحليل خاصة
"""

import json
import os
import time
import urllib.request
import urllib.parse

OUTPUT_DIR = r"C:\Users\TOSHIBA\Desktop\alam-alsiana-main\public\boards"
WM_API = "https://commons.wikimedia.org/w/api.php"
WM_THUMB = "https://commons.wikimedia.org/w/api.php"
HEADERS = {
    "User-Agent": "AlamAlSiana/1.0 (Educational repair platform)",
    "Accept": "application/json",
}

# موديلات تحتاج صور + مصطلحات بحث خاصة بكل واحدة
TARGETS = {
    "note12":  ["mobile phone motherboard PCB", "smartphone logic board disassembly"],
    "a22":     ["Samsung smartphone circuit board", "mobile PCB board repair"],
    "spark10": ["Android phone motherboard", "mobile phone circuit board"],
    "hot20i":  ["smartphone PCB disassembly", "mobile phone main board"],
}

os.makedirs(OUTPUT_DIR, exist_ok=True)


def wm_search(query: str, limit: int = 8) -> list:
    params = {
        "action":       "query",
        "generator":    "search",
        "gsrnamespace": "6",
        "gsrsearch":    f"filetype:bitmap {query}",
        "gsrlimit":     str(limit),
        "prop":         "imageinfo",
        "iiprop":       "url|size|mime|dimensions",
        "iiurlwidth":   "1200",
        "format":       "json",
    }
    url = WM_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
        pages = data.get("query", {}).get("pages", {})
        out = []
        for p in pages.values():
            info = p.get("imageinfo", [{}])[0]
            mime = info.get("mime", "")
            w    = info.get("thumbwidth", 0) or info.get("width", 0)
            h    = info.get("thumbheight", 0) or info.get("height", 0)
            sz   = info.get("size", 0)
            url_ = info.get("thumburl") or info.get("url", "")
            if ("jpeg" in mime or "png" in mime) and sz > 50_000:
                out.append({"url": url_, "size": sz, "w": w, "h": h,
                             "title": p.get("title", "")})
        # رتّب حسب الحجم (أكبر أفضل)
        out.sort(key=lambda x: x["size"], reverse=True)
        return out
    except Exception as e:
        print(f"    خطأ: {e}")
        return []


def download(url: str, dest: str) -> bool:
    if not url:
        return False
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        if len(data) < 30_000:
            return False
        with open(dest, "wb") as f:
            f.write(data)
        print(f"    ✅ {len(data)//1024} KB → {os.path.basename(dest)}")
        return True
    except Exception as e:
        print(f"    ✗ {e}")
        return False


def fetch(board_id: str, queries: list) -> bool:
    dest = os.path.join(OUTPUT_DIR, f"board-{board_id}.jpg")
    if os.path.exists(dest):
        sz = os.path.getsize(dest)
        print(f"  ⏭  موجود ({sz//1024} KB): board-{board_id}.jpg")
        return True

    print(f"\n📷 [{board_id}]")
    for q in queries:
        print(f"  🔎 '{q}'")
        results = wm_search(q, limit=8)
        print(f"     → {len(results)} صورة")
        for r in results[:3]:
            print(f"       {r['title'][:55]} ({r['size']//1024}KB)")
            if download(r["url"], dest):
                return True
        time.sleep(0.4)
    return False


def main():
    print("=" * 60)
    print("  Alam Al-Siana — Generic PCB Images (4 models)")
    print("=" * 60)

    ok, fail = [], []
    for bid, queries in TARGETS.items():
        if fetch(bid, queries):
            ok.append(bid)
        else:
            fail.append(bid)
        time.sleep(0.8)

    print("\n" + "=" * 60)
    print(f"✅  {len(ok)} نجح  : {', '.join(ok) or '—'}")
    print(f"❌  {len(fail)} فشل : {', '.join(fail) or '—'}")
    print("=" * 60)

    if fail:
        # خطة ج: ابحث عن أي صورة PCB عامة واحدة وانسخها لكل الفاشلين
        print("\n💡 سنجلب صورة PCB واحدة ونشاركها بين الموديلات الفاشلة...")
        fallback_queries = [
            "circuit board electronics green",
            "computer motherboard circuit",
            "electronic circuit board",
        ]
        fallback_dest = os.path.join(OUTPUT_DIR, "_generic_pcb.jpg")
        got = False
        for q in fallback_queries:
            results = wm_search(q, limit=5)
            for r in results:
                if download(r["url"], fallback_dest):
                    got = True
                    break
            if got:
                break

        if got:
            import shutil
            for bid in fail:
                dest = os.path.join(OUTPUT_DIR, f"board-{bid}.jpg")
                shutil.copy2(fallback_dest, dest)
                print(f"  ✅ نسخ → board-{bid}.jpg")
        else:
            print("  ⚠️  حتى الصورة العامة فشلت، ستبقى Unsplash مؤقتاً")


if __name__ == "__main__":
    main()
