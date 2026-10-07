# -*- coding: utf-8 -*-
"""
Comprehensive Seed Data Generator for Nihon Quest (N5, N4, N3)
Extracts and integrates data from:
- JPD113-123-133-116 -126-VOCABULARY_PART 1-8.pdf
- JPD113-123-133-116 -126-GRAMMAR_PART 1-9.pdf
- Complete Dekiru Nihongo & Minna no Nihongo Syllabus
"""

import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
seed_data_dir = os.path.join(workspace_dir, "prisma", "seed-data")
os.makedirs(seed_data_dir, exist_ok=True)

# First run base generators
print("Running N5, N4, N3 base generators...")
os.system(f"python {os.path.join(workspace_dir, 'scripts', 'gen_kanji_vocab.py')}")
os.system(f"python {os.path.join(workspace_dir, 'scripts', 'gen_grammar.py')}")
os.system(f"python {os.path.join(workspace_dir, 'scripts', 'generate_50_lessons.py')}")
os.system(f"python {os.path.join(workspace_dir, 'scripts', 'generate_n4_lessons.py')}")
os.system(f"python {os.path.join(workspace_dir, 'scripts', 'generate_n3_lessons.py')}")
os.system(f"python {os.path.join(workspace_dir, 'scripts', 'append_large_vocab.py')}")

print("Base scripts completed.")

