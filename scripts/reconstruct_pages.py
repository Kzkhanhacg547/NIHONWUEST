import os
import pypdf
from PIL import Image

def reconstruct_pages(pdf_path, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    reader = pypdf.PdfReader(pdf_path)
    print(f"Reconstructing {pdf_path}: {len(reader.pages)} pages")
    for idx, page in enumerate(reader.pages):
        imgs = []
        for img_idx, img_obj in enumerate(page.images):
            # open image from bytes
            import io
            im = Image.open(io.BytesIO(img_obj.data))
            imgs.append(im)
        if not imgs:
            print(f"Page {idx+1}: no images")
            continue
        
        # If multiple images, stack them vertically
        total_w = max(im.width for im in imgs)
        total_h = sum(im.height for im in imgs)
        combined = Image.new("RGB", (total_w, total_h), (255, 255, 255))
        curr_y = 0
        for im in imgs:
            combined.paste(im, (0, curr_y))
            curr_y += im.height
        
        out_path = os.path.join(out_dir, f"page_{idx+1:03d}.png")
        combined.save(out_path, format="PNG")
        print(f"Saved {out_path} ({total_w}x{total_h})")

reconstruct_pages("JPD113-123-133-116 -126-VOCABULARY_PART 1-8.pdf", "pdf_pages_vocab")
reconstruct_pages("JPD113-123-133-116 -126-GRAMMAR_PART 1-9.pdf", "pdf_pages_grammar")

