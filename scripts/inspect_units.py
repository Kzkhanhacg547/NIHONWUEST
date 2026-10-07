import sys
import os

sys.path.insert(0, os.path.abspath('.'))
sys.stdout.reconfigure(encoding='utf-8')

for unit_idx in range(1, 6):
    mod_name = f"scripts.data_unit{unit_idx}"
    try:
        mod = __import__(mod_name, fromlist=["*"])
        var_name = f"UNIT{unit_idx}_LESSONS"
        lessons = getattr(mod, var_name, getattr(mod, "LESSONS", []))
        print(f"=== Unit {unit_idx} (lessons: {len(lessons)}) ===")
        for l in lessons[:3]:
            print(f"  Lesson #{l.get('order')}: {l.get('title')} ({len(l.get('exercises', []))} exercises)")
    except Exception as e:
        print(f"Error loading {mod_name}: {e}")

