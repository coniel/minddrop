import { describe, expect, it } from 'vitest';
import { orderByLastModifiedDesc } from './orderByLastModifiedDesc';

const older = { lastModified: new Date('2024-01-01T00:00:00.000Z') };
const newer = { lastModified: new Date('2024-01-02T00:00:00.000Z') };

describe('orderByLastModifiedDesc', () => {
  it('orders newest first', () => {
    expect([older, newer].sort(orderByLastModifiedDesc)).toEqual([
      newer,
      older,
    ]);
  });
});
