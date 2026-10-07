import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def summarize_ocr(json_path, title):
    print(f"\n==================================================")
    print(f"=== SUMMARY OF {title} ===")
    print(f"==================================================")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for page_name, lines in sorted(data.items()):
        texts = [l["text"].strip() for l in lines if l["text"].strip()]
        preview = " // ".join(texts[:10])
        print(f"[{page_name}] (lines: {len(lines):02d}): {preview[:120]}")

summarize_ocr("extracted_vocab_ocr.json", "VOCABULARY TEXTBOOK")
summarize_ocr("extracted_grammar_ocr.json", "GRAMMAR TEXTBOOK")

