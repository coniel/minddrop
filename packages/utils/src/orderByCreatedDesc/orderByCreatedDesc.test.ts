import { describe, expect, it } from 'vitest';
import { orderByCreatedDesc } from './orderByCreatedDesc';

const older = { created: new Date('2024-01-01T00:00:00.000Z') };
const newer = { created: new Date('2024-01-02T00:00:00.000Z') };

describe('orderByCreatedDesc', () => {
  it('orders newest first', () => {
    expect([older, newer].sort(orderByCreatedDesc)).toEqual([newer, older]);
  });
});
