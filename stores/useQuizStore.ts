import { create } from 'zustand';

export type Option = {
  id: number;
  questionId: number;
  optionLetter: string;
  optionText: string;
  isCorrect: boolean;
};

export type Part = {
  id: number;
  partNumber: number;
  name: string;
  description: string;
  skillType: string;
};

export type Question = {
  id: number;
  createdAt: string;
  updatedAt: string;
  partId: number;
  questionText: string;
  questionType: string;
  difficulty: string;
  explanation: string;
  audioUrl?: string;
  imageUrl?: string;
  passageText?: string;
  passageTitle?: string;
  options: Option[];
  part: Part;
};

type QuizStore = {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<number, string>; // Changed to number key
  setQuestions: (q: Question[]) => void;
  answer: (id: number, answer: string) => void; // Changed to number id
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