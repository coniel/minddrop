import { describe, expect, it } from 'vitest';
import { reorderArray } from './reorderArray';

describe('reorderArray', () => {
  it.only('reorders an array item to a smaller index', () => {
    const array = ['a', 'b', 'c', 'd'];
    const movedId = 'c';
    const targetIndex = 1;

    const result = reorderArray(array, movedId, targetIndex);

    expect(result).toEqual(['a', 'c', 'b', 'd']);
  });

  it.only('reorders an array item to a larger index', () => {
    const array = ['a', 'b', 'c', 'd'];
    const movedId = 'b';
    const targetIndex = 2;

    const result = reorderArray(array, movedId, targetIndex);

    expect(result).toEqual(['a', 'c', 'b', 'd']);
  });

  it.only('reorders an array item to the same index', () => {
    const array = ['a', 'b', 'c', 'd'];
    const movedId = 'b';
    const targetIndex = 1;

    const result = reorderArray(array, movedId, targetIndex);

    expect(result).toEqual(['a', 'b', 'c', 'd']);
  });

  it.only('reorders an array item to the end of the array', () => {
    const array = ['a', 'b', 'c', 'd'];
    const movedId = 'b';
    const targetIndex = 4;

    const result = reorderArray(array, movedId, targetIndex);

    expect(result).toEqual(['a', 'c', 'd', 'b']);
  });

  it.only('reorders an array item to the start of the array', () => {
    const array = ['a', 'b', 'c', 'd'];
    const movedId = 'b';
    const targetIndex = 0;

    const result = reorderArray(array, movedId, targetIndex);

    expect(result).toEqual(['b', 'a', 'c', 'd']);
  });
});
