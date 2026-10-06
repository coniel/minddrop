import { describe, expect, it } from 'vitest';
import { isClosingCodeFence } from './isClosingCodeFence';

describe('isClosingCodeFence', () => {
  it('closes on a fence of the same character and length', () => {
    expect(isClosingCodeFence('```', '```')).toBe(true);
  });

  it('closes on a longer fence', () => {
    expect(isClosingCodeFence('````', '```')).toBe(true);
  });

  it('closes on a fence followed by whitespace', () => {
    expect(isClosingCodeFence('~~~  ', '~~~')).toBe(true);
  });

  it('does not close on a shorter fence', () => {
    expect(isClosingCodeFence('```', '````')).toBe(false);
  });

  it('does not close on a fence of the other character', () => {
    expect(isClosingCodeFence('~~~', '```')).toBe(false);
  });

  it('does not close on a fence followed by text', () => {
    expect(isClosingCodeFence('```js', '```')).toBe(false);
  });
});
