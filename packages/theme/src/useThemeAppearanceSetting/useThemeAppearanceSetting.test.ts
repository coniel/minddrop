import { renderHook, act } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { useThemeStore } from '../useThemeStore';
import { useThemeAppearanceSetting } from './useThemeAppearanceSetting';

describe('useThemeAppearanceSetting', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the appearance setting', () => {
    // Get the appearance setting
    const { result } = renderHook(() => useThemeAppearanceSetting());

    act(() => {
      // Set the appearance setting to 'dark'
      useThemeStore.getState().setAppearanceSetting('dark');
    });

    // Should return the appearance setting
    expect(result.current).toBe('dark');
  });
});
