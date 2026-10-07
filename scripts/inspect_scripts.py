import glob
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in sorted(glob.glob("scripts/*.py")):
    size = os.path.getsize(f)
    print(f"File: {f} ({size} bytes)")
    with open(f, "r", encoding="utf-8", errors="ignore") as fp:
        lines = fp.readlines()
        print(f"  Total lines: {len(lines)}")
        for l in lines[:15]:
            print(f"    {l.rstrip()}")
    print("-" * 50)

