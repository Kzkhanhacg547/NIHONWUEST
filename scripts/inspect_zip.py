import zipfile
import os

print("=== Checking scripts.zip ===")
if os.path.exists("scripts.zip"):
    with zipfile.ZipFile("scripts.zip", 'r') as z:
        for info in z.infolist():
            print(f"{info.filename} ({info.file_size} bytes)")
else:
    print("scripts.zip not found")

