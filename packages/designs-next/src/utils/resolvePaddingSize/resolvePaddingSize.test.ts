import { describe, expect, it } from 'vitest';
import { PaddingSizes } from '../../constants';
import { resolvePaddingSize } from './resolvePaddingSize';

describe('resolvePaddingSize', () => {
  it('resolves the step an amount sits on', () => {
    expect(resolvePaddingSize(PaddingSizes.l)).toBe('l');
  });

  it('resolves nothing for an amount off the scale', () => {
    expect(resolvePaddingSize(PaddingSizes.l + 1)).toBeUndefined();
    expect(resolvePaddingSize(0)).toBeUndefined();
  });
});
