import { describe, expect, it } from 'vitest';
import { GRID_SIZE } from '../../constants';
import { snapToGrid } from './snapToGrid';

describe('snapToGrid', () => {
  it('snaps to the nearest grid line', () => {
    expect(snapToGrid(GRID_SIZE + 2)).toBe(GRID_SIZE);
    expect(snapToGrid(GRID_SIZE * 2 - 2)).toBe(GRID_SIZE * 2);
  });

  it('leaves values already on the grid unchanged', () => {
    expect(snapToGrid(GRID_SIZE * 3)).toBe(GRID_SIZE * 3);
  });

  it('snaps negative values', () => {
    expect(snapToGrid(-GRID_SIZE - 2)).toBe(-GRID_SIZE);
  });

  it('snaps to a custom grid size', () => {
    expect(snapToGrid(12, 10)).toBe(10);
  });
});
