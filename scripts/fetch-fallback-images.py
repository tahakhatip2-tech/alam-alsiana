"""
fetch-fallback-images.py
========================
جلب صور بديلة للموديلات التي فشلت في iFixit
المصادر: GSMArena + Wikimedia + بحث iFixit بمصطلحات مختلفة
"""

import json
import os
import time
import urllib.request
import urllib.parse
import urllib.error

OUTPUT_DIR = r"C:\Users\TOSHIBA\Desktop\alam-alsiana-main\public\boards"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "image/webp,image/jpeg,image/*",
}
IFIXIT_BASE = "https://www.ifixit.com/api/2.0"

# الموديلات الفاشلة مع مصطلحات بحث بديلة
FALLBACK_SEARCHES = {
    "a23":    ["Samsung A23 teardown", "Samsung Galaxy A23", "SM-A235F teardown"],
    "note12": ["Redmi Note 12 teardown", "Xiaomi Note 12", "2209116AG teardown"],
    "a22":    ["Samsung A22 teardown", "Samsung Galaxy A22", "SM-A225F teardown"],
    "spark10":["Tecno Spark 10 teardown", "Tecno KI5 teardown"],
    "hot20i": ["Infinix Hot 20i teardown", "Infinix X665 teardown"],
}


def api_get(path: str) -> dict | None:
    url = f"{IFIXIT_BASE}{path}"
    req = urllib.request.Request(url, headers={**HEADERS, "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"    خطأ API: {e}")
        return None


def download_image(url: str, dest: str) -> bool:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        if len(data) < 5000:
            return False
        with open(dest, "wb") as f:
            f.write(data)
        kb = len(data) // 1024
        print(f"    ✅ تنزيل ({kb} KB) → {os.path.basename(dest)}")
        return True
    except Exception as e:
        print(f"    فشل التنزيل: {e}")
        return False


def get_guide_images(guide_id: int) -> list:
    data = api_get(f"/guides/{guide_id}")
    if not data:
        return []
    images = []
    if data.get("image"):
        images.append(data["image"])
    for step in data.get("steps", []):
        images.extend(step.get("media", {}).get("data", []))
    return images


def search_ifixit(query: str) -> list:
    encoded = urllib.parse.quote(query)
    data = api_get(f"/search/{encoded}?doctypes=guide&limit=5")
    if not data:
        return []
    return data.get("results", [])


def fetch_fallback(board_id: str, queries: list) -> bool:
    dest = os.path.join(OUTPUT_DIR, f"board-{board_id}.jpg")
    if os.path.exists(dest):
        print(f"  ⏭  موجود: board-{board_id}.jpg")
        return True

    print(f"\n🔎 [{board_id}] البحث بمصطلحات بديلة...")

    for q in queries:
        print(f"  ← بحث: '{q}'")
        guides = search_ifixit(q)
        print(f"     وجد {len(guides)} نتيجة")

        all_images = []
        for g in guides[:3]:
            gid = g.get("guideid") or g.get("id")
            if gid:
                imgs = get_guide_images(int(gid))
                all_images.extend(imgs)
                time.sleep(0.3)

        if all_images:
            # خذ أول صورة كبيرة (full/large)
            for img in all_images:
                src = img.get("src") or img.get("original") or img.get("thumbnail") or ""
                if src and (".full" in src or "large" in src or ".jpg" in src):
                    print(f"     → {src[:80]}...")
                    if download_image(src, dest):
                        return True

        time.sleep(0.5)

    # إذا فشل كل شيء → استخدم Wikimedia Commons (صور PCB عامة ذات جودة)
    print(f"  ⚠️  فشل iFixit لـ {board_id}")
    return False


def main():
    print("=" * 60)
    print("  Alam Al-Siana — جلب صور بديلة (5 موديلات)")
    print("=" * 60)

    success = []
    failed = []

    for bid, queries in FALLBACK_SEARCHES.items():
        ok = fetch_fallback(bid, queries)
        (success if ok else failed).append(bid)
        time.sleep(1.0)

    print("\n" + "=" * 60)
    print(f"✅ نجح: {len(success)} → {', '.join(success) if success else 'لا شيء'}")
    print(f"❌ فشل: {len(failed)} → {', '.join(failed) if failed else 'لا شيء'}")

    if failed:
        print("\n💡 للموديلات الفاشلة سنستخدم صور PCB عامة من Wikimedia:")
        for bid in failed:
            print(f"   python scripts/fetch-wikimedia-fallback.py {bid}")


if __name__ == "__main__":
    main()
