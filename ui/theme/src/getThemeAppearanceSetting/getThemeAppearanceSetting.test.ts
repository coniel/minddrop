import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeDark } from '../constants';
import { cleanup, setup } from '../test-utils';
import { getThemeAppearanceSetting } from './getThemeAppearanceSetting';

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
