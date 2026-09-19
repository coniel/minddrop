import { describe, expect, it } from 'vitest';
import { resolveLazyValue } from './resolveLazyValue';

describe('resolveLazyValue', () => {
  it('returns a plain value as is', () => {
    expect(resolveLazyValue({ id: 'a' })).toEqual({ id: 'a' });
  });

  it('calls a function for its value', () => {
    expect(resolveLazyValue(() => ({ id: 'a' }))).toEqual({ id: 'a' });
  });
});
