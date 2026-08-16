import { describe, expect, it } from 'vitest';
import { PropertiesSchema } from '@minddrop/properties';
import { getTimestampProperty } from './getTimestampProperty';

const schema: PropertiesSchema = [
  { type: 'created', name: 'Created' },
  { type: 'last-modified', name: 'Last Modified' },
];

const date = new Date('2025-06-15T10:00:00.000Z');

describe('getTimestampProperty', () => {
  it('returns the property value', () => {
    expect(getTimestampProperty('created', schema, { Created: date })).toEqual(
      date,
    );
  });

  it('parses string values', () => {
    expect(
      getTimestampProperty('created', schema, {
        Created: date.toISOString(),
      }),
    ).toEqual(date);
  });

  it('returns null if the database has no property of the type', () => {
    expect(getTimestampProperty('created', [], { Created: date })).toBeNull();
  });

  it('returns null if the entry has no value for the property', () => {
    expect(getTimestampProperty('created', schema, {})).toBeNull();
  });

  it('returns null for unparsable values', () => {
    expect(
      getTimestampProperty('created', schema, { Created: 'not a date' }),
    ).toBeNull();
  });
});
