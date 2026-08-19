import { describe, expect, it } from 'vitest';
import { generatePropertyPlaceholder } from './generatePropertyPlaceholder';

describe('generatePropertyPlaceholder', () => {
  it('generates a placeholder per property type', () => {
    expect(generatePropertyPlaceholder('title')).toBeTruthy();
    expect(generatePropertyPlaceholder('number')).toBeTruthy();
    expect(generatePropertyPlaceholder('date')).toBeTruthy();
    expect(generatePropertyPlaceholder('select')).toBeTruthy();
    expect(generatePropertyPlaceholder('icon')).toBeTruthy();
  });

  it('returns undefined for types without a generated placeholder', () => {
    expect(generatePropertyPlaceholder('toggle')).toBeUndefined();
  });

  it('generates a URL placeholder carrying every toggleable part', () => {
    const placeholder = generatePropertyPlaceholder('url') ?? '';

    // URL elements can hide each of these parts, so the
    // placeholder has to contain them all for the toggles to show
    // any effect
    expect(placeholder).toMatch(/^https:\/\//);
    expect(placeholder).toContain('www.');
    expect(placeholder).toContain('example');
    expect(placeholder).toContain('.com');
    expect(placeholder).toMatch(/\.com\/.+/);
  });
});
