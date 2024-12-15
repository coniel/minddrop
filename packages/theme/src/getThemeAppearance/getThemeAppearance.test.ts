import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeConfig } from '../ThemeConfig';
import { ThemeDark } from '../constants';
import { cleanup, setup } from '../test-utils';
import { getThemeAppearance } from './getThemeAppearance';

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
