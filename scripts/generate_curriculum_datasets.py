# -*- coding: utf-8 -*-
"""
Curriculum Builder for Nihon Quest (N5 -> N4 -> N3)
Extracts and normalizes data from:
- JPD113-123-133-116 -126-VOCABULARY_PART 1-8.pdf
- JPD113-123-133-116 -126-GRAMMAR_PART 1-9.pdf
- Complete JLPT Syllabus (N5, N4, N3)
"""

import os
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
seed_dir = os.path.join(workspace_dir, "prisma", "seed-data")
os.makedirs(seed_dir, exist_ok=True)

print("Starting generation...")

