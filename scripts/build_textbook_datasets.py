# -*- coding: utf-8 -*-
"""
Generate complete, verified seed datasets for Nihon Quest:
- prisma/seed-data/kanji-vocab.ts (N5 Kanji & Vocab from Dekiru Nihongo & Minna no Nihongo)
- prisma/seed-data/grammar.ts (N5 Grammar from Dekiru Nihongo & Minna no Nihongo)
- prisma/seed-data/n4-data.ts (N4 Kanji, Vocab, Grammar, Lessons, Scenarios)
- prisma/seed-data/n3-data.ts (N3 Kanji, Vocab, Grammar, Lessons, Scenarios)
- prisma/seed-data/lessons.ts (N5 Lessons)
"""

import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
seed_data_dir = os.path.join(workspace_dir, "prisma", "seed-data")
os.makedirs(seed_data_dir, exist_ok=True)

print("Compiling all curriculum datasets...")

