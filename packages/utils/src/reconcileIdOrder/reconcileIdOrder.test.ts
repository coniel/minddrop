import { describe, expect, it } from 'vitest';
import { reconcileIdOrder } from './reconcileIdOrder';

const itemA = { id: 'a', created: new Date('2024-01-03T00:00:00.000Z') };
const itemB = { id: 'b', created: new Date('2024-01-02T00:00:00.000Z') };
const itemC = { id: 'c', created: new Date('2024-01-01T00:00:00.000Z') };

describe('reconcileIdOrder', () => {
  it('orders items by the ID order', () => {
    expect(reconcileIdOrder(['b', 'a'], [itemA, itemB])).toEqual([
      itemB,
      itemA,
    ]);
  });

  it('ignores ordered IDs without a matching item', () => {
    expect(reconcileIdOrder(['a', 'b', 'c'], [itemA, itemC])).toEqual([
      itemA,
      itemC,
    ]);
  });

  it('appends missing items in item order without a fallback', () => {
    expect(reconcileIdOrder(['b'], [itemA, itemB, itemC])).toEqual([
      itemB,
      itemA,
      itemC,
    ]);
  });

  it('appends missing items sorted by the fallback comparator', () => {
    expect(
      reconcileIdOrder(
        ['b'],
        [itemA, itemB, itemC],
        (a, b) => a.created.getTime() - b.created.getTime(),
      ),
    ).toEqual([itemB, itemC, itemA]);
  });

  it('returns the items as is when the order is empty', () => {
    expect(reconcileIdOrder([], [itemA, itemB])).toEqual([itemA, itemB]);
  });
});
