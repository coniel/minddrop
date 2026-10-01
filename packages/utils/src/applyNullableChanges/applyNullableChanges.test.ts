import { describe, expect, it } from 'vitest';
import { applyNullableChanges } from './applyNullableChanges';

interface Item {
  name: string;
  size?: number;
  color?: string;
}

const item: Item = { name: 'Item', size: 10, color: 'red' };

describe('applyNullableChanges', () => {
  it('sets the changed fields', () => {
    const result = applyNullableChanges(item, { name: 'Renamed', size: 20 });

    expect(result).toEqual({ name: 'Renamed', size: 20, color: 'red' });
  });

  it('deletes a field cleared with a null', () => {
    const result = applyNullableChanges(item, { size: null });

    expect(result).not.toHaveProperty('size');
    expect(result.color).toBe('red');
  });

  it('leaves a field alone when its change is undefined', () => {
    const result = applyNullableChanges(item, { size: undefined });

    expect(result.size).toBe(10);
  });

  it('leaves the original object untouched', () => {
    applyNullableChanges(item, { name: 'Renamed', size: null });

    expect(item).toEqual({ name: 'Item', size: 10, color: 'red' });
  });
});
