import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("extracted_vocab_ocr.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total pages in vocab OCR: {len(data)}")
for page_name, lines in sorted(data.items()):
    print(f"\n=== {page_name} (lines: {len(lines)}) ===")
    texts = [l["text"] for l in lines]
    print(" | ".join(texts[:15]))

