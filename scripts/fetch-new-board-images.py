import json
import os
import shutil
import urllib.request
import urllib.parse
import urllib.error

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "boards")
GENERIC_PCB = os.path.join(OUTPUT_DIR, "_generic_pcb.jpg")
IFIXIT_BASE = "https://www.ifixit.com/api/2.0"
HEADERS = {
    "User-Agent": "AlamAlSiana/1.0 (repair-platform; contact@example.com)",
    "Accept": "application/json",
}

NEW_MODELS = {
    "a54": "Samsung Galaxy A54 5G",
    "a34": "Samsung Galaxy A34 5G",
    "mi13": "Xiaomi 13",
    "note12pro": "Xiaomi Redmi Note 12 Pro",
    "iphone14": "iPhone 14",
    "oppoa78": "Oppo A78 5G",
    "realme-c55": "Realme C55",
}

BOARD_KEYWORDS = [
    "motherboard", "logic board", "pcb", "board", "main board",
    "circuit", "chip", "processor", "teardown"
]

def search_guide_for_board(query):
    try:
        url = f"{IFIXIT_BASE}/search/{urllib.parse.quote(query)}?filter=guide"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
        results = data.get("results", [])
        for guide in results:
            guide_id = guide.get("guideid")
            if not guide_id:
                continue
            guide_url = f"{IFIXIT_BASE}/guides/{guide_id}"
            req2 = urllib.request.Request(guide_url, headers=HEADERS)
            with urllib.request.urlopen(req2, timeout=10) as r2:
                gdata = json.loads(r2.read().decode())
            for step in gdata.get("steps", []):
                for img in step.get("media", {}).get("data", []):
                    title = (img.get("title") or "").lower()
                    notes = (img.get("text_raw") or "").lower()
                    if any(k in title or k in notes for k in BOARD_KEYWORDS):
                        if img.get("original"):
                            return img["original"]
                        if img.get("large"):
                            return img["large"]
    except Exception as e:
        print(f"Error searching {query}: {e}")
    return None

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    for model_id, search_name in NEW_MODELS.items():
        dest = os.path.join(OUTPUT_DIR, f"board-{model_id}.jpg")
        if os.path.exists(dest):
            print(f"[OK] board-{model_id}.jpg already exists.")
            continue
        print(f"Searching iFixit for: {search_name}...")
        img_url = search_guide_for_board(search_name)
        downloaded = False
        if img_url:
            try:
                print(f"  Downloading image from {img_url[:60]}...")
                req = urllib.request.Request(img_url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=15) as r, open(dest, "wb") as out:
                    out.write(r.read())
                print(f"  [SAVED] board-{model_id}.jpg")
                downloaded = True
            except Exception as e:
                print(f"  Failed to download: {e}")
        
        if not downloaded:
            if os.path.exists(GENERIC_PCB):
                shutil.copyfile(GENERIC_PCB, dest)
                print(f"  [FALLBACK] Copied generic PCB as board-{model_id}.jpg")
            else:
                print(f"  [WARN] No fallback available for board-{model_id}.jpg")

if __name__ == "__main__":
    main()
