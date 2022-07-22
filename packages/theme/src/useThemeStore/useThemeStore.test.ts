import { useThemeStore } from './useThemeStore';

describe('useThemeStore', () => {
  describe('setAppearance', () => {
    it('sets the appearance', () => {
      // Set the appearance
      useThemeStore.getState().setAppearance('dark');

      // Should set the appearance
      expect(useThemeStore.getState().appearance).toBe('dark');
    });
  });

  describe('setAppearanceSetting', () => {
    it('sets the appearance setting', () => {
      // Set the appearance setting
      useThemeStore.getState().setAppearanceSetting('dark');

      // Should set the appearance setting
      expect(useThemeStore.getState().appearanceSetting).toBe('dark');
    });
  });
});
