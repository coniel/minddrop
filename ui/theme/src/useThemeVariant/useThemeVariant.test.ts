import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderHook } from '@minddrop/test-utils';
import { ThemeStore } from '../ThemeStore';
import { ThemeDark } from '../constants';
import { cleanup, setup } from '../test-utils';
import { useThemeVariant } from './useThemeVariant';

describe('useThemeVariant', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the theme variant', () => {
    // Set the variant to 'dark'
    ThemeStore.set('variant', ThemeDark);

    // Get the variant
    const { result } = renderHook(() => useThemeVariant());

    // Should return the variant
    expect(result.current).toBe(ThemeDark);
  });
});
