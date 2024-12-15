import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeDark } from '../constants';
import { cleanup, setup } from '../test-utils';
import { useThemeAppearanceSetting } from './useThemeAppearanceSetting';

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
