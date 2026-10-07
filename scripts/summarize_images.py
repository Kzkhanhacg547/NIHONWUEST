import glob
import os
from PIL import Image

def summarize_images(folder):
    files = sorted(glob.glob(f"{folder}/*.jpg"))
    print(f"=== Folder: {folder} ({len(files)} images) ===")
    for f in files:
        im = Image.open(f)
        print(f"  {os.path.basename(f)}: size={im.size}, mode={im.mode}")

summarize_images("extracted_vocab_pages")
summarize_images("extracted_grammar_pages")

