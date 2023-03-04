import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { useThemeAppearanceSetting } from './useThemeAppearanceSetting';

describe('useThemeAppearanceSetting', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the appearance setting', () => {
    // Set the appearance setting to 'dark'
    ThemeConfig.set('appearanceSetting', 'dark');

    // Get the appearance setting
    const { result } = renderHook(() => useThemeAppearanceSetting());

    // Should return the appearance setting
    expect(result.current).toBe('dark');
  });
});
