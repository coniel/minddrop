import { describe, expect, it } from 'vitest';
import { parseBadgeLabels } from './parseBadgeLabels';

describe('parseBadgeLabels', () => {
  it('returns nothing without labels', () => {
    expect(parseBadgeLabels()).toEqual([]);
    expect(parseBadgeLabels('')).toEqual([]);
  });

  it('splits and trims the labels', () => {
    expect(parseBadgeLabels('Fiction, To read')).toEqual([
      'Fiction',
      'To read',
    ]);
  });

  it('drops the empty segments a stray comma leaves', () => {
    expect(parseBadgeLabels('Fiction,, ,To read,')).toEqual([
      'Fiction',
      'To read',
    ]);
  });
});
