import { describe, expect, it } from 'vitest';
import { getConnectionHaloColor } from './getConnectionHaloColor';

describe('getConnectionHaloColor', () => {
  it('returns a light neutral shade when no color is set', () => {
    expect(getConnectionHaloColor()).toBe('var(--neutral-500)');
  });

  it('returns a light neutral shade for the default color', () => {
    expect(getConnectionHaloColor('default')).toBe('var(--neutral-500)');
  });

  it('returns a light shade of the content color', () => {
    expect(getConnectionHaloColor('blue')).toBe('var(--blue-500)');
  });
});
