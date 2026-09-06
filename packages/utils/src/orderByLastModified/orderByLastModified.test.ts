import { describe, expect, it } from 'vitest';
import { orderByLastModified } from './orderByLastModified';

const older = { lastModified: new Date('2024-01-01T00:00:00.000Z') };
const newer = { lastModified: new Date('2024-01-02T00:00:00.000Z') };

describe('orderByLastModified', () => {
  it('orders oldest first', () => {
    expect([newer, older].sort(orderByLastModified)).toEqual([older, newer]);
  });
});
