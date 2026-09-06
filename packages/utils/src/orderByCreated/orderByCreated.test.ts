import { describe, expect, it } from 'vitest';
import { orderByCreated } from './orderByCreated';

const older = { created: new Date('2024-01-01T00:00:00.000Z') };
const newer = { created: new Date('2024-01-02T00:00:00.000Z') };

describe('orderByCreated', () => {
  it('orders oldest first', () => {
    expect([newer, older].sort(orderByCreated)).toEqual([older, newer]);
  });
});
