import pypdf
import os
import sys

def inspect_pdf(filepath):
    print("=========================================")
    print(f"File: {filepath}")
    if not os.path.exists(filepath):
        print("File does not exist!")
        return
    reader = pypdf.PdfReader(filepath)
    print(f"Total pages: {len(reader.pages)}")
    
    # Check outlines
    try:
        outline = reader.outline
        print(f"Outline items: {len(outline) if outline else 0}")
    except Exception as e:
        print(f"Outline error: {e}")

    # Inspect first 10 pages
    for i in range(min(10, len(reader.pages))):
        text = reader.pages[i].extract_text() or ""
        print(f"\n--- Page {i+1} (chars: {len(text)}) ---")
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        for line in lines[:10]:
            print(f"  {line}")

if __name__ == "__main__":
    inspect_pdf("JPD113-123-133-116 -126-VOCABULARY_PART 1-8.pdf")
    inspect_pdf("JPD113-123-133-116 -126-GRAMMAR_PART 1-9.pdf")

