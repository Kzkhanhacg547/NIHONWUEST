import sys

try:
    import winrt.windows.media.ocr as ocr
    import winrt.windows.graphics.imaging as imaging
    import winrt.windows.storage as storage
    import winrt.windows.globalization as glob
    print("winrt ocr available!")
except Exception as e:
    print(f"winrt ocr not available: {e}")

