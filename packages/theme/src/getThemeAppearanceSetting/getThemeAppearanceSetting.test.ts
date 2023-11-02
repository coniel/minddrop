import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { ThemeConfig } from '../ThemeConfig';
import { getThemeAppearanceSetting } from './getThemeAppearanceSetting';
import { ThemeDark } from '../constants';

describe('getThemeAppearanceSetting', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the theme appearance setting', () => {
    // Set the current appearance setting to 'dark'
    ThemeConfig.set('appearanceSetting', ThemeDark);

    // Get the appearance setting
    const appearance = getThemeAppearanceSetting();

    // Should return the appearance setting
    expect(appearance).toBe(ThemeDark);
  });
});
