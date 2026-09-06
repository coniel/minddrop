import { describe, expect, it } from 'vitest';
import { orderByName } from './orderByName';

describe('orderByName', () => {
  it('orders alphabetically by name', () => {
    expect([{ name: 'Beta' }, { name: 'Alpha' }].sort(orderByName)).toEqual([
      { name: 'Alpha' },
      { name: 'Beta' },
    ]);
  });
});
