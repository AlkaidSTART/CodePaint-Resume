import { create } from "zustand";

type AppState = {
  isApplyOpen: boolean;
  introProgress: number; // 0.0 (黑) -> 0.5 (米白) -> 1.0 (白/完成)
  introDone: boolean;
  openApply: () => void;
  closeApply: () => void;
  setIntroProgress: (p: number) => void;
  setIntroDone: (done: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isApplyOpen: false,
  introProgress: 0,
  introDone: false,
  openApply: () => set({ isApplyOpen: true }),
  closeApply: () => set({ isApplyOpen: false }),
  setIntroProgress: (p: number) => set({ introProgress: p }),
  setIntroDone: (done: boolean) => set({ introDone: done, introProgress: 1 }),
}));
