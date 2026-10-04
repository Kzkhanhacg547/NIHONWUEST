export interface QuizSummary {
  correctCount: number;
  incorrectCount: number;
  total: number;
  accuracy: number;
  score: number;
}

export function scoreQuiz(attempts: Array<{ isCorrect: boolean; points: number }>): QuizSummary {
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const incorrectCount = attempts.length - correctCount;
  const score = attempts.filter((a) => a.isCorrect).reduce((s, a) => s + a.points, 0);
  const accuracy = attempts.length ? correctCount / attempts.length : 0;
  return { correctCount, incorrectCount, total: attempts.length, accuracy, score };
}

export function checkAnswer(expected: string, actual: string): boolean {
  return expected.trim().toLowerCase() === actual.trim().toLowerCase();
}
