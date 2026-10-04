# -*- coding: utf-8 -*-
"""
Master compiler for 50 N5 Lessons x 15 Exercises = 750 Exercises
Assembles Unit 1, Unit 2, Unit 3, Unit 4, Unit 5 and writes prisma/seed-data/lessons.ts
"""

import os
import json
import sys

from data_unit1 import get_unit1_lessons
from data_unit2 import get_unit2_lessons
from data_unit3 import get_unit3_lessons
from data_unit4 import get_unit4_lessons
from data_unit5 import get_unit5_lessons

def q(q_type, question, correct, w1, w2, w3):
    return {
        "type": q_type,
        "question": question,
        "correctAnswer": correct,
        "points": 10,
        "options": [
            {"label": "A", "text": correct, "isCorrect": True, "order": 0},
            {"label": "B", "text": w1, "isCorrect": False, "order": 1},
            {"label": "C", "text": w2, "isCorrect": False, "order": 2},
            {"label": "D", "text": w3, "isCorrect": False, "order": 3},
        ]
    }

def main():
    workspace_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    target_file = os.path.join(workspace_dir, "prisma", "seed-data", "lessons.ts")

    raw_units = [
        get_unit1_lessons(q),
        get_unit2_lessons(q),
        get_unit3_lessons(q),
        get_unit4_lessons(q),
        get_unit5_lessons(q),
    ]

    all_lessons = []
    total_exercises = 0
    lesson_order = 0

    for u_idx, u_lessons in enumerate(raw_units, start=1):
        print(f"Processing Unit {u_idx}: {len(u_lessons)} lessons")
        assert len(u_lessons) == 10, f"Unit {u_idx} must have 10 lessons, got {len(u_lessons)}"
        for slug, title, desc, questions in u_lessons:
            assert len(questions) == 15, f"Lesson {slug} in Unit {u_idx} must have 15 questions, got {len(questions)}"
            
            # assign question order
            for q_idx, ques in enumerate(questions):
                ques["order"] = q_idx

            all_lessons.append({
                "slug": slug,
                "title": title,
                "description": desc,
                "level": "N5",
                "order": lesson_order,
                "xpReward": 50,
                "exercises": questions
            })
            lesson_order += 1
            total_exercises += len(questions)

    print(f"Total Lessons compiled: {len(all_lessons)}")
    print(f"Total Exercises compiled: {total_exercises}")
    assert len(all_lessons) == 50, f"Expected 50 lessons, got {len(all_lessons)}"
    assert total_exercises == 750, f"Expected 750 exercises, got {total_exercises}"

    # Write TypeScript file
    ts_content = "// Generated Comprehensive N5 Lessons Seed Data (50 Lessons x 15 Exercises = 750 Exercises)\n"
    ts_content += "export const LESSONS = " + json.dumps(all_lessons, ensure_ascii=False, indent=2) + ";\n"

    with open(target_file, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Successfully generated {target_file}")
    file_size_kb = os.path.getsize(target_file) / 1024
    print(f"File size: {file_size_kb:.2f} KB")

if __name__ == "__main__":
    main()
