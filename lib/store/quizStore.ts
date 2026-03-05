import { create } from "zustand";
import { persist } from "zustand/middleware";

type QuizAnswers = {
    gender?: string;
    style?: string;
    colors?: string[];
    budget?: [number, number];
    occasions?: string[];
    fit?: string;
    patterns?: string;
    material?: string;
    brandAffinity?: string;
    inspirationImage?: string;
};

type QuizStore = {
    answers: QuizAnswers;
    currentStep: number;
    isCompleted: boolean;
    saveAnswer: (key: keyof QuizAnswers, value: QuizAnswers[keyof QuizAnswers]) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;
    resetQuiz: () => void;
    completeQuiz: () => void;
};

export const useQuizStore = create<QuizStore>()(
    persist(
        (set) => ({
            answers: {},
            currentStep: 0,
            isCompleted: false,
            saveAnswer: (key, value) =>
                set((s) => ({ answers: { ...s.answers, [key]: value } })),
            nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 9) })),
            prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),
            goToStep: (step) => set({ currentStep: step }),
            resetQuiz: () => set({ answers: {}, currentStep: 0, isCompleted: false }),
            completeQuiz: () => set({ isCompleted: true }),
        }),
        { name: "quiz-storage" }
    )
);
