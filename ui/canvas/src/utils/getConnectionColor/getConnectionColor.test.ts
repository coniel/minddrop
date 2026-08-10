import { describe, expect, it } from 'vitest';
import { getConnectionColor } from './getConnectionColor';

describe('getConnectionColor', () => {
  it('returns the border color for unset and default colors', () => {
    expect(getConnectionColor()).toBe('var(--border-default)');
    expect(getConnectionColor('default')).toBe('var(--border-default)');
  });

  it('returns the color scale value for content colors', () => {
    expect(getConnectionColor('blue')).toBe('var(--blue-600)');
    expect(getConnectionColor('red')).toBe('var(--red-600)');
  });
});
