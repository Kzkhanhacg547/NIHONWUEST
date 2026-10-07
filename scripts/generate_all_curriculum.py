# -*- coding: utf-8 -*-
"""
Curriculum generator for Nihon Quest:
Compiles rich, authentic N5, N4, N3 curriculum grounded in the textbooks:
- JPD113-123-133-116 -126-VOCABULARY_PART 1-8.pdf
- JPD113-123-133-116 -126-GRAMMAR_PART 1-9.pdf
- Dekiru Nihongo & Minna no Nihongo Complete Syllabus
"""

import os
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
seed_data_dir = os.path.join(workspace_dir, "prisma", "seed-data")
os.makedirs(seed_data_dir, exist_ok=True)

print("Starting generation of comprehensive N5, N4, N3 curriculum...")

