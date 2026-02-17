import { describe, expect, it } from 'vitest';
import { reorderArray } from './reorderArray';

describe('reorderArray', () => {
  it('reorders an array item to a smaller index', () => {
    const array = ['a', 'b', 'c', 'd'];

    const result = reorderArray(array, 1, 0);

    expect(result).toEqual(['b', 'a', 'c', 'd']);
  });

  it('reorders an array item to a larger index', () => {
    const array = ['a', 'b', 'c', 'd'];

    const result = reorderArray(array, 1, 2);

    expect(result).toEqual(['a', 'c', 'b', 'd']);
  });

  it('does nothing if the target index is the same', () => {
    const array = ['a', 'b', 'c', 'd'];

    const result = reorderArray(array, 1, 1);

    expect(result).toEqual(['a', 'b', 'c', 'd']);
  });

  it('reorders an array item to the end of the array', () => {
    const array = ['a', 'b', 'c', 'd'];

    const result = reorderArray(array, 1, 3);

    expect(result).toEqual(['a', 'c', 'd', 'b']);
  });

  it('reorders an array item to the start of the array', () => {
    const array = ['a', 'b', 'c', 'd'];

    const result = reorderArray(array, 1, 0);

    expect(result).toEqual(['b', 'a', 'c', 'd']);
  });

  it('reorders an array item to the end of the array if the target index is out of bounds', () => {
    const array = ['a', 'b', 'c', 'd'];

    const result = reorderArray(array, 1, 10);

    expect(result).toEqual(['a', 'c', 'd', 'b']);
  });
});
