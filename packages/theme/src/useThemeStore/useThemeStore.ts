import createStore from 'zustand';
import { ThemeStore } from '../types';

export const useThemeStore = createStore<ThemeStore>((set) => ({
  appearance: 'light',
  appearanceSetting: 'system',
  setAppearance: (value) => set({ appearance: value }),
  setAppearanceSetting: (value) => set({ appearanceSetting: value }),
}));
