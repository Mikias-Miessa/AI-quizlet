import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LearningProgress {
  [key: string]: {
    progress?: number;
    lastScore?: number;
  };
}

interface LearningStore {
  pdfContent: string | null;
  fileName: string | null;
  learningProgress: LearningProgress;
  setPDF: (content: string, name: string) => void;
  clearPDF: () => void;
  updateProgress: (mode: string, progress: number) => void;
  updateScore: (mode: string, score: number) => void;
}

export const useLearningStore = create<LearningStore>()(
  persist(
    (set) => ({
      pdfContent: null,
      fileName: null,
      learningProgress: {},
      setPDF: (content, name) => set({ pdfContent: content, fileName: name }),
      clearPDF: () => set({ pdfContent: null, fileName: null }),
      updateProgress: (mode, progress) =>
        set((state) => ({
          learningProgress: {
            ...state.learningProgress,
            [mode]: {
              ...state.learningProgress[mode],
              progress,
            },
          },
        })),
      updateScore: (mode, score) =>
        set((state) => ({
          learningProgress: {
            ...state.learningProgress,
            [mode]: {
              ...state.learningProgress[mode],
              lastScore: score,
            },
          },
        })),
    }),
    {
      name: "learning-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        learningProgress: state.learningProgress,
        pdfContent: state.pdfContent,
        fileName: state.fileName,
      }),
    }
  )
);
