import { afterEach, describe, expect, it } from 'vitest';
import { isKeyboardInputMode } from './isKeyboardInputMode';

describe('isKeyboardInputMode', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-input-mode');
  });

  it('returns false when no input mode is set', () => {
    expect(isKeyboardInputMode()).toBe(false);
  });

  it('returns false in pointer mode', () => {
    document.documentElement.setAttribute('data-input-mode', 'pointer');

    expect(isKeyboardInputMode()).toBe(false);
  });

  it('returns true in keyboard mode', () => {
    document.documentElement.setAttribute('data-input-mode', 'keyboard');

    expect(isKeyboardInputMode()).toBe(true);
  });
});
