# -*- coding: utf-8 -*-
"""
Generate N5 Kanji, Vocabulary, and Grammar seed data from:
- JPD113-123-133-116 -126-VOCABULARY_PART 1-8.pdf
- JPD113-123-133-116 -126-GRAMMAR_PART 1-9.pdf
- Minna no Nihongo / Dekiru Nihongo N5 Syllabus
"""

import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
seed_data_dir = os.path.join(workspace_dir, "prisma", "seed-data")
os.makedirs(seed_data_dir, exist_ok=True)

# Run gen_kanji_vocab.py, gen_grammar.py, generate_50_lessons.py
print("Running N5 generation scripts...")
os.system(f"python {os.path.join(workspace_dir, 'scripts', 'gen_kanji_vocab.py')}")
os.system(f"python {os.path.join(workspace_dir, 'scripts', 'gen_grammar.py')}")
os.system(f"python {os.path.join(workspace_dir, 'scripts', 'generate_50_lessons.py')}")
print("N5 base generation complete.")

