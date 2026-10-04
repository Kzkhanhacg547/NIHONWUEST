# -*- coding: utf-8 -*-
"""
Script to clean all lesson titles by removing 'Bài X (NX): ' or 'Bài X: ' or 'Minna Bài X: ' prefix.
Cleans database records directly and updates generator scripts and seed files.
"""

import os
import re
import json

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def clean_title(title: str) -> str:
    cleaned = re.sub(r'^(Minna\s+)?Bài\s*\d+(\s*\([^\)]+\))?:\s*', '', title, flags=re.IGNORECASE)
    return cleaned.strip()

# 1. Clean prisma/seed-data/n3-data.ts and prisma/seed-data/n4-data.ts
for filename in ["n3-data.ts", "n4-data.ts", "lessons.ts"]:
    filepath = os.path.join(workspace_dir, "prisma", "seed-data", filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace title: "Bài XX..."
        def replace_title_match(match):
            full = match.group(0)
            t_val = match.group(1)
            c_val = clean_title(t_val)
            return f'"title": "{c_val}"'

        new_content = re.sub(r'"title":\s*"([^"]+)"', replace_title_match, content)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Cleaned titles in {filename}")

# 2. Clean scripts/generate_n3_lessons.py and scripts/generate_n4_lessons.py
for script_file in ["generate_n3_lessons.py", "generate_n4_lessons.py"]:
    filepath = os.path.join(workspace_dir, "scripts", script_file)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        def replace_title_match(match):
            t_val = match.group(1)
            c_val = clean_title(t_val)
            return f'"title": "{c_val}"'

        new_content = re.sub(r'"title":\s*"([^"]+)"', replace_title_match, content)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Cleaned titles in {script_file}")

print("Clean process finished.")
