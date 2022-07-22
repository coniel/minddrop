import { renderHook, act } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { useThemeStore } from '../useThemeStore';
import { useThemeAppearance } from './useThemeAppearance';

describe('useAppearance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the current appearance', () => {
    // Get the current appearance
    const { result } = renderHook(() => useThemeAppearance());

    act(() => {
      // Set the current appearance to 'dark'
      useThemeStore.getState().setAppearance('dark');
    });

    // Should return the current appearance
    expect(result.current).toBe('dark');
  });
});
