import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { renderHook, act } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { useThemeAppearance } from './useThemeAppearance';
import { ThemeConfig } from '../ThemeConfig';

describe('useAppearance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the current appearance', () => {
    // Get the current appearance
    const { result } = renderHook(() => useThemeAppearance());

    act(() => {
      // Set the current appearance to 'dark'
      ThemeConfig.set('appearance', 'dark');
    });

    // Should return the current appearance
    expect(result.current).toBe('dark');
  });
});
