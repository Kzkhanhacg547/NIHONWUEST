import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def count_in_ts(fname):
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"\n=== File: {fname} ({len(content)} chars) ===")
    
    # Check for exported arrays
    exports = re.findall(r'export (?:const|let|var) (\w+)', content)
    print(f"Exported variables: {exports}")
    
    # Check items count roughly
    for exp in exports:
        matches = re.findall(rf'export (?:const|let|var) {exp}\s*=\s*\[(.*?)\];', content, re.DOTALL)
        if matches:
            # count top-level objects
            objs = matches[0].count('{"') + matches[0].count('{ "') + matches[0].count('{\n')
            print(f"  {exp}: ~{objs} items")

count_in_ts("prisma/seed-data/kanji-vocab.ts")
count_in_ts("prisma/seed-data/grammar.ts")
count_in_ts("prisma/seed-data/n4-data.ts")
count_in_ts("prisma/seed-data/n3-data.ts")
count_in_ts("prisma/seed-data/lessons.ts")

