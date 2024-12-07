import { describe, it, expect } from 'vitest';
import { restoreDates } from './restoreDates';

describe('restoreDates', () => {
  it('should deserialize date strings to Date objects', () => {
    const input = {
      createdAt: '2024-12-06T15:00:00.000Z',
      updatedAt: '2024-12-07T16:00:00.000Z',
    };
    const result = restoreDates<{ createdAt: Date; updatedAt: Date }>(input);

    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe('2024-12-06T15:00:00.000Z');
    expect(result.updatedAt.toISOString()).toBe('2024-12-07T16:00:00.000Z');
  });

  it('should handle nested objects and arrays', () => {
    const input = {
      nested: {
        createdAt: '2024-12-06T15:00:00.000Z',
        items: [
          { addedAt: '2024-12-06T16:00:00.000Z' },
          { addedAt: '2024-12-06T17:00:00.000Z' },
        ],
      },
    };
    const result = restoreDates(input);

    expect(result.nested.createdAt).toBeInstanceOf(Date);
    expect(result.nested.items[0].addedAt).toBeInstanceOf(Date);
    expect(result.nested.items[1].addedAt).toBeInstanceOf(Date);
  });

  it('should not deserialize non-date fields', () => {
    const input = {
      name: 'John Doe',
      age: 30,
    };
    const result = restoreDates(input);

    expect(result.name).toBe('John Doe');
    expect(result.age).toBe(30);
  });

  it('should not modify invalid date strings', () => {
    const input = {
      createdAt: 'invalid-date',
      updatedAt: 'not-a-date',
    };
    const result = restoreDates(input);

    expect(result.createdAt).toBe('invalid-date');
    expect(result.updatedAt).toBe('not-a-date');
  });

  it('should handle empty objects and arrays', () => {
    const input = {
      emptyObj: {},
      emptyArray: [],
    };
    const result = restoreDates(input);

    expect(result.emptyObj).toEqual({});
    expect(result.emptyArray).toEqual([]);
  });

  it('should handle deeply nested structures', () => {
    const input = {
      user: {
        name: 'Alice',
        createdAt: '2024-12-06T15:00:00.000Z',
        nested: {
          info: {
            lastLogin: '2024-12-06T15:30:00.000Z',
            meta: {
              timestamp: '2024-12-06T16:00:00.000Z',
            },
          },
        },
      },
    };
    const result = restoreDates(input);

    expect(result.user.createdAt).toBeInstanceOf(Date);
    expect(result.user.nested.info.lastLogin).toBeInstanceOf(Date);
    expect(result.user.nested.info.meta.timestamp).toBeInstanceOf(Date);
  });

  it('should not fail with an empty object', () => {
    const result = restoreDates({});
    expect(result).toEqual({});
  });

  it('should deserialize dates inside arrays', () => {
    const input = [
      { createdAt: '2024-12-06T15:00:00.000Z' },
      { createdAt: '2024-12-07T16:00:00.000Z' },
    ];
    const result = restoreDates(input);

    expect(result[0].createdAt).toBeInstanceOf(Date);
    expect(result[1].createdAt).toBeInstanceOf(Date);
  });
});
