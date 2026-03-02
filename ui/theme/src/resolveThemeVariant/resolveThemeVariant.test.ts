import { describe, expect, it, vi } from 'vitest';
import { ThemeDark, ThemeLight, ThemeSystem } from '../constants';
import { ThemeVariant } from '../types';
import { resolveThemeVariant } from './resolveThemeVariant';

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: prefersDark,
    })),
  });
}

describe('resolveThemeVariant', () => {
  it('returns "light" when variant is "light"', () => {
    // Resolve a 'light' variant
    const result = resolveThemeVariant(ThemeLight as ThemeVariant);

    // Should return 'light'
    expect(result).toBe(ThemeLight);
  });

  it('returns "dark" when variant is "dark"', () => {
    // Resolve a 'dark' variant
    const result = resolveThemeVariant(ThemeDark as ThemeVariant);

    // Should return 'dark'
    expect(result).toBe(ThemeDark);
  });

  it('returns "dark" when variant is "system" and OS prefers dark', () => {
    // Mock OS dark mode preference
    mockMatchMedia(true);

    // Resolve a 'system' variant
    const result = resolveThemeVariant(ThemeSystem as ThemeVariant);

    // Should return 'dark'
    expect(result).toBe(ThemeDark);
  });

  it('returns "light" when variant is "system" and OS prefers light', () => {
    // Mock OS light mode preference
    mockMatchMedia(false);

    // Resolve a 'system' variant
    const result = resolveThemeVariant(ThemeSystem as ThemeVariant);

    // Should return 'light'
    expect(result).toBe(ThemeLight);
  });
});
