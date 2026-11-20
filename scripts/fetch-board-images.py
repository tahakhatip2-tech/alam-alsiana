"""
fetch-board-images.py
=====================
جلب صور اللوحات الأم (PCB/Motherboard) من iFixit API
للموديلات الـ 12 التي لا تملك صور حقيقية بعد.

الاستخدام:
    python scripts/fetch-board-images.py
"""

import json
import os
import sys
import time
import urllib.request
import urllib.parse
import urllib.error

# ─── إعدادات ────────────────────────────────────────────────────────────────
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "boards")
IFIXIT_BASE = "https://www.ifixit.com/api/2.0"
HEADERS = {
    "User-Agent": "AlamAlSiana/1.0 (repair-platform; contact@example.com)",
    "Accept": "application/json",
}

# ─── قائمة الموديلات (id → اسم بحث iFixit) ──────────────────────────────────
MODELS = {
    "a23":      "Samsung Galaxy A23",
    "redmi9":   "Xiaomi Redmi 9",
    "a53":      "Samsung Galaxy A53",
    "iphone11": "iPhone 11",
    "a14":      "Samsung Galaxy A14",
    "note10":   "Xiaomi Redmi Note 10",
    "iphone12": "iPhone 12",
    "note12":   "Xiaomi Redmi Note 12",
    "a22":      "Samsung Galaxy A22",
    "iphone13": "iPhone 13",
    "spark10":  "Tecno Spark 10",
    "hot20i":   "Infinix Hot 20i",
}

# كلمات مفتاحية للعثور على صور اللوحة الأم
BOARD_KEYWORDS = [
    "motherboard", "logic board", "pcb", "board", "main board",
    "circuit", "chip", "processor"
]

os.makedirs(OUTPUT_DIR, exist_ok=True)


def api_get(path: str) -> dict | None:
    url = f"{IFIXIT_BASE}{path}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        print(f"    HTTP {e.code} → {url}")
        return None
    except Exception as e:
        print(f"    خطأ: {e}")
        return None


def download_image(url: str, dest: str) -> bool:
    req = urllib.request.Request(url, headers={**HEADERS, "Accept": "image/*"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        if len(data) < 5000:          # أصغر من 5KB → ليست صورة حقيقية
            return False
        with open(dest, "wb") as f:
            f.write(data)
        kb = len(data) // 1024
        print(f"    ✅ تم التنزيل ({kb} KB) → {os.path.basename(dest)}")
        return True
    except Exception as e:
        print(f"    فشل التنزيل: {e}")
        return False


def score_image(image: dict) -> int:
    """تقييم الصورة — نفضل صور اللوحة الأم بالكلمات المفتاحية."""
    text = " ".join([
        image.get("caption", ""),
        image.get("alt", ""),
        str(image.get("orderby", "")),
    ]).lower()
    score = 0
    for kw in BOARD_KEYWORDS:
        if kw in text:
            score += 10
    # نفضل الصور الكبيرة (التي تحتوي على "large" في الرابط)
    src = image.get("src", image.get("original", ""))
    if "large" in src or "huge" in src:
        score += 2
    return score


def pick_best_image(images: list[dict]) -> str | None:
    if not images:
        return None
    scored = sorted(images, key=score_image, reverse=True)
    for img in scored:
        src = img.get("src") or img.get("original") or img.get("thumbnail")
        if src and src.startswith("http"):
            return src
    return None


def search_device(device_name: str) -> list[dict]:
    """البحث في iFixit عن أدلة الإصلاح للجهاز."""
    encoded = urllib.parse.quote(device_name)
    data = api_get(f"/search/{encoded}?doctypes=guide&limit=5")
    if not data:
        return []
    return data.get("results", [])


def get_guide_images(guide_id: int) -> list[dict]:
    """جلب كل صور دليل الإصلاح."""
    data = api_get(f"/guides/{guide_id}")
    if not data:
        return []
    images = []
    # صورة الغلاف
    if data.get("image"):
        images.append(data["image"])
    # صور الخطوات
    for step in data.get("steps", []):
        images.extend(step.get("media", {}).get("data", []))
    return images


def get_device_images(device_name: str) -> list[dict]:
    """جلب كل الصور من صفحة الجهاز في Wiki."""
    encoded = urllib.parse.quote(device_name)
    data = api_get(f"/wikis/DEVICE/{encoded}")
    if not data:
        return []
    images = []
    if data.get("image"):
        images.append(data["image"])
    for img in data.get("contents", []):
        if isinstance(img, dict) and img.get("src"):
            images.append(img)
    return images


def fetch_for_model(board_id: str, device_name: str) -> bool:
    dest = os.path.join(OUTPUT_DIR, f"board-{board_id}.jpg")
    if os.path.exists(dest):
        print(f"  ⏭  موجود مسبقاً: board-{board_id}.jpg")
        return True

    print(f"\n🔍 [{board_id}] {device_name}")

    all_images: list[dict] = []

    # 1) صفحة الجهاز في Wiki
    wiki_imgs = get_device_images(device_name)
    all_images.extend(wiki_imgs)
    print(f"    Wiki: {len(wiki_imgs)} صورة")
    time.sleep(0.5)

    # 2) أدلة الإصلاح
    guides = search_device(device_name)
    print(f"    أدلة: {len(guides)} نتيجة")
    for g in guides[:3]:            # أول 3 أدلة فقط
        gid = g.get("guideid") or g.get("id")
        if gid:
            g_imgs = get_guide_images(int(gid))
            all_images.extend(g_imgs)
            print(f"      دليل #{gid}: {len(g_imgs)} صورة")
            time.sleep(0.4)

    if not all_images:
        print(f"  ⚠️  لا توجد صور لـ {device_name}")
        return False

    best_url = pick_best_image(all_images)
    if not best_url:
        print(f"  ⚠️  تعذّر اختيار صورة لـ {device_name}")
        return False

    print(f"    أفضل صورة: {best_url[:80]}...")
    return download_image(best_url, dest)


def main():
    print("=" * 60)
    print("  Alam Al-Siana — جالب صور اللوحات الأم من iFixit")
    print("=" * 60)
    print(f"مجلد الإخراج: {os.path.abspath(OUTPUT_DIR)}\n")

    successes = []
    failures = []

    for board_id, device_name in MODELS.items():
        ok = fetch_for_model(board_id, device_name)
        (successes if ok else failures).append(board_id)
        time.sleep(0.8)             # احترام حدود iFixit API

    print("\n" + "=" * 60)
    print(f"✅ نجح: {len(successes)} موديل → {', '.join(successes)}")
    if failures:
        print(f"❌ فشل: {len(failures)} موديل → {', '.join(failures)}")
    print("=" * 60)

    # توليد مقتطف TypeScript للتحديث اليدوي (أو اللصق في schematic-data.ts)
    if successes:
        print("\n── مسارات الصور الجاهزة للنسخ في schematic-data.ts ──")
        for bid in successes:
            dest = os.path.join(OUTPUT_DIR, f"board-{bid}.jpg")
            if os.path.exists(dest):
                print(f'  "{bid}": image: "/boards/board-{bid}.jpg",')


if __name__ == "__main__":
    main()
