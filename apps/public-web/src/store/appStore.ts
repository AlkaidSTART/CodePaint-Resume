import { create } from "zustand";

type AppState = {
  isApplyOpen: boolean;
  openApply: () => void;
  closeApply: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  isApplyOpen: false,
  openApply: () => set({ isApplyOpen: true }),
  closeApply: () => set({ isApplyOpen: false }),
}));
