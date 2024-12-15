import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeDark } from '../constants';
import { cleanup, setup } from '../test-utils';
import { useThemeAppearance } from './useThemeAppearance';

describe('useAppearance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the current appearance', () => {
    // Get the current appearance
    const { result } = renderHook(() => useThemeAppearance());

    act(() => {
      // Set the current appearance to 'dark'
      ThemeConfig.set('appearance', ThemeDark);
    });

    // Should return the current appearance
    expect(result.current).toBe(ThemeDark);
  });
});
