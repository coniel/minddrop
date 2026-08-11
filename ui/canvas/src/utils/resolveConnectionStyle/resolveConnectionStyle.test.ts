import { describe, expect, it } from 'vitest';
import { resolveConnectionStyle } from './resolveConnectionStyle';

describe('resolveConnectionStyle', () => {
  it('falls back to the package defaults', () => {
    expect(resolveConnectionStyle([])).toEqual({
      arrows: 'end',
      shape: undefined,
      color: 'default',
      style: undefined,
      thickness: 'medium',
    });
  });

  it('takes each value from the first source which sets it', () => {
    expect(
      resolveConnectionStyle([
        { color: 'red' },
        { color: 'blue', thickness: 'thick' },
        { arrows: 'none', thickness: 'thin' },
      ]),
    ).toEqual({
      arrows: 'none',
      shape: undefined,
      color: 'red',
      style: undefined,
      thickness: 'thick',
    });
  });

  it('skips sources which are not set', () => {
    expect(
      resolveConnectionStyle([undefined, { shape: 'straight' }]).shape,
    ).toBe('straight');
  });
});
