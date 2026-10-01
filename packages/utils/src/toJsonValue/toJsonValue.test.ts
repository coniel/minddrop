import { describe, expect, it } from 'vitest';
import { toJsonValue } from './toJsonValue';

describe('toJsonValue', () => {
  it('returns the value as it is when JSON holds all of it', () => {
    const value = { name: 'Topics', options: [{ value: 'A' }] };

    expect(toJsonValue(value)).toEqual(value);
  });

  it('leaves out fields left undefined', () => {
    expect(toJsonValue({ name: 'Topics', group: undefined })).toStrictEqual({
      name: 'Topics',
    });
  });
});
