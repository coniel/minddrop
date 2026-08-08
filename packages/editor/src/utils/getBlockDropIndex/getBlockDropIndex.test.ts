import { describe, expect, it } from 'vitest';
import { getBlockDropIndex } from './getBlockDropIndex';

// A block occupying the area between 100px and 200px down the
// viewport, putting its midpoint at 150px
const blockBounds = { top: 100, height: 100 };

describe('getBlockDropIndex', () => {
  it('drops above the block when the pointer is in its top half', () => {
    expect(getBlockDropIndex(2, blockBounds, 120, 0)).toBe(2);
  });

  it('drops below the block when the pointer is in its bottom half', () => {
    expect(getBlockDropIndex(2, blockBounds, 180, 0)).toBe(3);
  });

  it('drops above the block at its midpoint', () => {
    expect(getBlockDropIndex(2, blockBounds, 150, 0)).toBe(2);
  });

  it('drops below the title rather than above it', () => {
    // The title is the block at index 0, so the content starts at 1
    expect(getBlockDropIndex(0, blockBounds, 120, 1)).toBe(1);
  });

  it('drops above the first content block', () => {
    expect(getBlockDropIndex(1, blockBounds, 120, 1)).toBe(1);
  });
});
