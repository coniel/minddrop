import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { useThemeAppearanceSetting } from './useThemeAppearanceSetting';
import { ThemeDark } from '../constants';

describe('useThemeAppearanceSetting', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the appearance setting', () => {
    // Set the appearance setting to 'dark'
    ThemeConfig.set('appearanceSetting', ThemeDark);

    // Get the appearance setting
    const { result } = renderHook(() => useThemeAppearanceSetting());

    // Should return the appearance setting
    expect(result.current).toBe(ThemeDark);
  });
});
