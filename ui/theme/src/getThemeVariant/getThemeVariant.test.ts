import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeStore } from '../ThemeStore';
import { ThemeDark } from '../constants';
import { cleanup, setup } from '../test-utils';
import { getThemeVariant } from './getThemeVariant';

describe('getThemeVariant', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the theme variant', () => {
    // Set the current variant to 'dark'
    ThemeStore.set('variant', ThemeDark);

    // Get the variant
    const variant = getThemeVariant();

    // Should return the variant
    expect(variant).toBe(ThemeDark);
  });
});
