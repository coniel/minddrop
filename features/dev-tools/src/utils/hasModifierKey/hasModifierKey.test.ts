import { describe, expect, it } from 'vitest';
import { hasModifierKey } from './hasModifierKey';

describe('hasModifierKey', () => {
  it('returns false for plain key presses', () => {
    expect(hasModifierKey(new KeyboardEvent('keydown', { key: 'd' }))).toBe(
      false,
    );
  });

  it('returns false for shifted key presses', () => {
    expect(
      hasModifierKey(
        new KeyboardEvent('keydown', { key: '?', shiftKey: true }),
      ),
    ).toBe(false);
  });

  it('returns true for meta, ctrl, and alt key presses', () => {
    expect(
      hasModifierKey(new KeyboardEvent('keydown', { key: 'd', metaKey: true })),
    ).toBe(true);
    expect(
      hasModifierKey(new KeyboardEvent('keydown', { key: 'd', ctrlKey: true })),
    ).toBe(true);
    expect(
      hasModifierKey(new KeyboardEvent('keydown', { key: 'd', altKey: true })),
    ).toBe(true);
  });
});
