import { create } from 'zustand';

export type Question = {
  id: string;
  text: string;
  options: string[];
};

type QuizStore = {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, string>;
  setQuestions: (q: Question[]) => void;
  answer: (id: string, answer: string) => void;
  next: () => void;
  reset: () => void;
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  questions: [],
  currentIndex: 0,
  userAnswers: {},
  setQuestions: (q) => set({ questions: q, currentIndex: 0, userAnswers: {} }),
  answer: (id, ans) =>
    set((state) => ({
      userAnswers: { ...state.userAnswers, [id]: ans },
    })),
  next: () =>
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
    })),
  reset: () => set({ questions: [], currentIndex: 0, userAnswers: {} }),
}));