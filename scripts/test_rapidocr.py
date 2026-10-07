import glob
import os
import sys
from rapidocr_onnxruntime import RapidOCR

sys.stdout.reconfigure(encoding='utf-8')

engine = RapidOCR()

def test_ocr(folder, max_pages=3):
    files = sorted(glob.glob(f"{folder}/*.png"))[:max_pages]
    for f in files:
        print(f"\n==================== {f} ====================")
        result, elapse_list = engine(f)
        if result:
            for line in result:
                box, text, score = line
                print(f"[{score:.2f}] {text}")
        else:
            print("No text detected")

print("--- Testing Vocab Pages ---")
test_ocr("pdf_pages_vocab", 2)

print("\n--- Testing Grammar Pages ---")
test_ocr("pdf_pages_grammar", 2)

