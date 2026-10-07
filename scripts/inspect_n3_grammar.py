with open("prisma/seed-data/n3-data.ts", "r", encoding="utf-8") as f:
    text = f.read()

import re
m = re.search(r'export const GRAMMAR_N3.*?=\s*\[(.*?)\];', text, re.DOTALL)
if m:
    print("GRAMMAR_N3 found:")
    print(m.group(0)[:500])
else:
    print("GRAMMAR_N3 not found")

