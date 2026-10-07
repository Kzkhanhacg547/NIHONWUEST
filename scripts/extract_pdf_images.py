import os
import pypdf
from PIL import Image

def extract_pages(pdf_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    reader = pypdf.PdfReader(pdf_path)
    print(f"Extracting {pdf_path}: {len(reader.pages)} pages")
    for idx, page in enumerate(reader.pages):
        # If page has images, get images
        img_names = []
        for img_idx, img_obj in enumerate(page.images):
            img_filename = f"page_{idx+1:03d}_img_{img_idx+1}.jpg"
            img_path = os.path.join(out_dir, img_filename)
            with open(img_path, "wb") as fp:
                fp.write(img_obj.data)
            img_names.append(img_filename)
        print(f"Page {idx+1}: saved {len(img_names)} images -> {img_names}")

print("=== Extracting Vocab PDF ===")
extract_pages("JPD113-123-133-116 -126-VOCABULARY_PART 1-8.pdf", "extracted_vocab_pages")

print("=== Extracting Grammar PDF ===")
extract_pages("JPD113-123-133-116 -126-GRAMMAR_PART 1-9.pdf", "extracted_grammar_pages")

