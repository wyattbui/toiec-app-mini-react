// lib/types/api.ts

export interface ToiecPart {
  id: number;
  partNumber: number;
  name: string;
  description: string;
}

export interface ToiecQuestion {
  id: number;
  partId: number;
  questionText: string;
  questionType: 'single' | 'multiple_choice' | 'listening' | 'reading' | 'conversation';
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  audioUrl?: string;
  imageUrl?: string;
  passageText?: string;
  passageTitle?: string;
  part?: ToiecPart;
  options: Array<{
    id: number;
    optionLetter: string;
    optionText: string;
    isCorrect: boolean;
  }>;
}

export interface QuestionsResponse {
  questions: ToiecQuestion[];
  total: number;
  limit: number;
  offset: number;
}

export interface TestSetGenerateRequest {
  partId: number;
  title?: string;
  description?: string;
  questionCount?: number;
  timeLimit?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface TestSetResponse {
  id: number;
  userId: number;
  partId: number;
  title: string;
  description: string;
  questionCount: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'generated' | 'in_progress' | 'completed' | 'abandoned';
  totalScore?: number;
  correctAnswers?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  part: ToiecPart;
  user: {
    id: number;
    email: string;
    name: string;
  };
  questions: Array<{
    id: number;
    testSetId: number;
    questionId: number;
    orderIndex: number;
    question: ToiecQuestion;
  }>;
  answers: Array<{
    questionId: number;
    selectedOption: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

export interface TestSetSubmitRequest {
  testSetId: number;
  answers: Array<{
    questionId: number;
    selectedOption: string;
    timeSpent: number;
  }>;
}

export interface TestSetSubmitResponse {
  testSet: {
    id: number;
    status: 'completed';
    totalScore: number;
    correctAnswers: number;
    completedAt: string;
  };
  results: {
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    score: number;
    timeSpent: number;
    details: Array<{
      questionId: number;
      isCorrect: boolean;
      selectedOption: string;
      correctOption: string;
      timeSpent: number;
    }>;
  };
}

export interface UserStatistics {
  completedTests: number;
  averageScore: number;
  bestScore: number;
  partStatistics: Array<{
    partId: number;
    _count: { id: number };
    _avg: { totalScore: number };
    _max: { totalScore: number };
    part: {
      name: string;
      partNumber: number;
    };
  }>;
}
