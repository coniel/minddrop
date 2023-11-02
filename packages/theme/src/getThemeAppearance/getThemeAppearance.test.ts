import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { getThemeAppearance } from './getThemeAppearance';
import { ThemeDark } from '../constants';

describe('getThemeAppearance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the current theme appearance', () => {
    // Set the current appearance to 'dark'
    ThemeConfig.set('appearance', ThemeDark);

    // Get the current appearance
    const appearance = getThemeAppearance();

    // Should return the current appearance
    expect(appearance).toBe(ThemeDark);
  });
});
