import { describe, expect, it } from 'vitest';
import { isTypingTarget } from './isTypingTarget';

describe('isTypingTarget', () => {
  it('returns false when there is no target', () => {
    expect(isTypingTarget(null)).toBe(false);
  });

  it('returns false for elements which do not accept text', () => {
    expect(isTypingTarget(document.createElement('div'))).toBe(false);
  });

  it('returns true for inputs and textareas', () => {
    expect(isTypingTarget(document.createElement('input'))).toBe(true);
    expect(isTypingTarget(document.createElement('textarea'))).toBe(true);
  });

  it('returns true for content editable elements', () => {
    const element = document.createElement('div');
    element.contentEditable = 'true';

    expect(isTypingTarget(element)).toBe(true);
  });
});
