import { describe, expect, it } from 'vitest';
import { CardAspectRatios } from '../../constants';
import { resolveAspectRows } from './resolveAspectRows';

describe('resolveAspectRows', () => {
  it('derives the row count from the width and ratio', () => {
    expect(resolveAspectRows(96, '3/2')).toBe(64);
    expect(resolveAspectRows(96, '1/1')).toBe(96);
    expect(resolveAspectRows(96, '16/9')).toBe(54);
  });

  it('lands on whole rows for every offered ratio', () => {
    CardAspectRatios.forEach((ratio) => {
      const rows = resolveAspectRows(96, ratio);

      expect(Number.isInteger(rows)).toBe(true);
    });
  });
});
