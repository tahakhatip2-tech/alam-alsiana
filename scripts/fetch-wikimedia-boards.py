"""
fetch-wikimedia-boards.py
=========================
جلب صور PCB/لوحات أم من Wikimedia Commons لـ 5 موديلات
Wikimedia Commons: مجاني 100%، CC-licensed، لا يحتاج مفتاح API
"""

import json
import os
import time
import urllib.request
import urllib.parse

OUTPUT_DIR = r"C:\Users\TOSHIBA\Desktop\alam-alsiana-main\public\boards"
WM_API = "https://commons.wikimedia.org/w/api.php"
HEADERS = {
    "User-Agent": "AlamAlSiana/1.0 (repair-platform; Educational use; contact@example.com)",
    "Accept": "application/json",
}

# مصطلحات البحث لكل موديل (من الأكثر تخصصاً إلى الأكثر عمومية)
SEARCH_TERMS = {
    "a23":    ["Samsung Galaxy A23 motherboard", "Samsung A23 PCB board",
               "Samsung Galaxy A series motherboard", "Samsung smartphone motherboard"],
    "note12": ["Xiaomi Redmi Note 12 motherboard", "Xiaomi Redmi Note PCB",
               "Xiaomi smartphone motherboard", "MediaTek Helio G88 board"],
    "a22":    ["Samsung Galaxy A22 motherboard", "Samsung A22 PCB",
               "Samsung Galaxy A series PCB", "Samsung smartphone PCB board"],
    "spark10":["Tecno Spark 10 motherboard", "Tecno smartphone motherboard",
               "MediaTek Helio G88 smartphone board", "Android smartphone PCB board"],
    "hot20i": ["Infinix Hot 20i motherboard", "Infinix smartphone motherboard",
               "Helio G85 smartphone PCB", "Android smartphone logic board"],
}

os.makedirs(OUTPUT_DIR, exist_ok=True)


def wm_search_images(query: str, limit: int = 5) -> list[dict]:
    """البحث في Wikimedia Commons عن صور."""
    params = {
        "action": "query",
        "generator": "search",
        "gsrnamespace": "6",        # File namespace
        "gsrsearch": f"filetype:bitmap {query}",
        "gsrlimit": str(limit),
        "prop": "imageinfo",
        "iiprop": "url|size|mime",
        "iiurlwidth": "1200",
        "format": "json",
    }
    url = WM_API + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
        pages = data.get("query", {}).get("pages", {})
        results = []
        for page in pages.values():
            info = page.get("imageinfo", [{}])[0]
            mime = info.get("mime", "")
            if "jpeg" in mime or "png" in mime:
                results.append({
                    "title": page.get("title", ""),
                    "url":   info.get("thumburl") or info.get("url", ""),
                    "width": info.get("thumbwidth", 0),
                    "size":  info.get("size", 0),
                })
        return results
    except Exception as e:
        print(f"    خطأ Wikimedia: {e}")
        return []


def download_image(url: str, dest: str) -> bool:
    if not url:
        return False
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        if len(data) < 20_000:   # أقل من 20KB ← صورة صغيرة جداً
            return False
        with open(dest, "wb") as f:
            f.write(data)
        kb = len(data) // 1024
        print(f"    ✅ تنزيل ({kb} KB) → {os.path.basename(dest)}")
        return True
    except Exception as e:
        print(f"    فشل التنزيل: {e}")
        return False


def fetch_for_model(board_id: str, queries: list[str]) -> bool:
    dest = os.path.join(OUTPUT_DIR, f"board-{board_id}.jpg")
    if os.path.exists(dest):
        print(f"  ⏭  موجود: board-{board_id}.jpg")
        return True

    print(f"\n🌐 [{board_id}] Wikimedia Commons ...")

    for q in queries:
        print(f"  ← بحث: '{q}'")
        results = wm_search_images(q, limit=5)
        print(f"     وجد {len(results)} صورة")

        # اختر الصورة الأكبر
        results.sort(key=lambda x: x.get("size", 0), reverse=True)

        for r in results:
            url = r.get("url", "")
            if url:
                print(f"     → {url[:90]}...")
                if download_image(url, dest):
                    return True

        time.sleep(0.5)

    print(f"  ❌ لا توجد صور كافية في Wikimedia لـ {board_id}")
    return False


def main():
    print("=" * 60)
    print("  Alam Al-Siana — Wikimedia Commons PCB Images")
    print("=" * 60)

    success = []
    failed  = []

    for bid, queries in SEARCH_TERMS.items():
        ok = fetch_for_model(bid, queries)
        (success if ok else failed).append(bid)
        time.sleep(0.8)

    print("\n" + "=" * 60)
    print(f"✅ نجح: {len(success)} → {', '.join(success) or 'لا شيء'}")
    print(f"❌ فشل: {len(failed)} → {', '.join(failed) or 'لا شيء'}")
    print("=" * 60)

    # مقتطف TypeScript للموديلات الناجحة
    if success:
        print("\n── أسطر للتحديث في schematic-data.ts ──")
        for bid in success:
            if os.path.exists(os.path.join(OUTPUT_DIR, f"board-{bid}.jpg")):
                print(f'  {bid}: image: "/boards/board-{bid}.jpg",')


if __name__ == "__main__":
    main()
