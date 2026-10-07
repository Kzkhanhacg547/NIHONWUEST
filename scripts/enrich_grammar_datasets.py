# -*- coding: utf-8 -*-
"""
Generate complete, rich Grammar datasets for N5, N4, and N3:
- Full Dekiru Nihongo & Minna no Nihongo N5 grammar
- Full N4 grammar
- Full N3 grammar
"""

import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# We will generate comprehensive grammar points for N5, N4, N3
print("Generating comprehensive grammar points...")

