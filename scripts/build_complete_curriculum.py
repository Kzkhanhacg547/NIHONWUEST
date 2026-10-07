# -*- coding: utf-8 -*-
"""
Build Complete Japanese Curriculum (N5 -> N4 -> N3)
Integrated from:
- JPD113-123-133-116 -126-VOCABULARY_PART 1-8.pdf
- JPD113-123-133-116 -126-GRAMMAR_PART 1-9.pdf
- Dekiru Nihongo & Minna no Nihongo Complete Standard Syllabus
"""

import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
seed_data_dir = os.path.join(workspace_dir, "prisma", "seed-data")
os.makedirs(seed_data_dir, exist_ok=True)

# Helper function to generate clean TypeScript file
def write_ts_file(filepath, content):
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated {filepath} ({len(content)} bytes)")

print("Building complete curriculum...")

