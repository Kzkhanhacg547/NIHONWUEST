import pypdf
import os

def inspect_pdf_objects(filepath):
    print(f"=== Inspecting {filepath} ===")
    reader = pypdf.PdfReader(filepath)
    for i, page in enumerate(reader.pages[:5]):
        print(f"Page {i+1}:")
        print(f"  Images count: {len(page.images)}")
        for img in page.images:
            print(f"    Image: {img.name}, format: {img.image.format if hasattr(img, 'image') else 'unknown'}")
        
inspect_pdf_objects("JPD113-123-133-116 -126-VOCABULARY_PART 1-8.pdf")
inspect_pdf_objects("JPD113-123-133-116 -126-GRAMMAR_PART 1-9.pdf")

