import { createContext, useContext, useState, ReactNode } from "react";

export type ReaderType = "Deep Thinker" | "Escapist" | "Motivational Seeker" | null;

interface QuizContextType {
  answers: Record<number, string>;
  setAnswer: (questionId: number, answerId: string) => void;
  calculateResult: () => ReaderType;
  resetQuiz: () => void;
  result: ReaderType;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<ReaderType>(null);

  const setAnswer = (questionId: number, answerId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const calculateResult = (): ReaderType => {
    // Simple logic for mockup
    let counts = {
      "Deep Thinker": 0,
      "Escapist": 0,
      "Motivational Seeker": 0
    };

    Object.values(answers).forEach(val => {
      if (val.startsWith("d")) counts["Deep Thinker"]++;
      else if (val.startsWith("e")) counts["Escapist"]++;
      else if (val.startsWith("m")) counts["Motivational Seeker"]++;
    });

    let maxType: ReaderType = "Escapist";
    let maxCount = -1;

    for (const [type, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        maxType = type as ReaderType;
      }
    }

    setResult(maxType);
    return maxType;
  };

  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <QuizContext.Provider value={{ answers, setAnswer, calculateResult, resetQuiz, result }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
