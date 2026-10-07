import glob
import os
import sys
import json
from rapidocr_onnxruntime import RapidOCR

sys.stdout.reconfigure(encoding='utf-8')

engine = RapidOCR()

def process_folder(folder, out_json_path, out_txt_path):
    files = sorted(glob.glob(f"{folder}/*.png"))
    all_data = {}
    
    with open(out_txt_path, "w", encoding="utf-8") as txt_out:
        for idx, f in enumerate(files):
            basename = os.path.basename(f)
            print(f"[{idx+1}/{len(files)}] Processing {basename}...")
            result, _ = engine(f)
            page_lines = []
            txt_out.write(f"\n\n==================== {basename} ====================\n")
            if result:
                for line in result:
                    box, text, score = line
                    page_lines.append({
                        "box": box,
                        "text": text,
                        "score": float(score)
                    })
                    txt_out.write(f"{text}\n")
            all_data[basename] = page_lines

    with open(out_json_path, "w", encoding="utf-8") as json_out:
        json.dump(all_data, json_out, ensure_ascii=False, indent=2)
    print(f"Saved {out_json_path} and {out_txt_path}")

print("=== Processing Vocab Pages ===")
process_folder("pdf_pages_vocab", "extracted_vocab_ocr.json", "extracted_vocab_ocr.txt")

print("\n=== Processing Grammar Pages ===")
process_folder("pdf_pages_grammar", "extracted_grammar_ocr.json", "extracted_grammar_ocr.txt")

