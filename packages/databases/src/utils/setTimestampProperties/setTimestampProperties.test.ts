import { describe, expect, it } from 'vitest';
import { objectDatabase, timestampDatabase } from '../../test-utils';
import { setTimestampProperties } from './setTimestampProperties';

const date = new Date('2025-06-15T10:00:00.000Z');

describe('setTimestampProperties', () => {
  it('sets the value of matching timestamp properties', () => {
    const properties = setTimestampProperties(
      timestampDatabase.properties,
      {},
      ['created', 'last-modified'],
      date,
    );

    expect(properties).toEqual({
      Created: date,
      'Last Modified': date,
    });
  });

  it('only sets the requested timestamp types', () => {
    const properties = setTimestampProperties(
      timestampDatabase.properties,
      {},
      ['last-modified'],
      date,
    );

    expect(properties).toEqual({
      'Last Modified': date,
    });
  });

  it('leaves other properties untouched', () => {
    const properties = setTimestampProperties(
      timestampDatabase.properties,
      { Created: new Date('2020-01-01T00:00:00.000Z'), Foo: 'bar' },
      ['last-modified'],
      date,
    );

    expect(properties).toEqual({
      Created: new Date('2020-01-01T00:00:00.000Z'),
      Foo: 'bar',
      'Last Modified': date,
    });
  });

  it('does nothing if the schema has no matching properties', () => {
    const properties = setTimestampProperties(
      objectDatabase.properties,
      { Content: 'Hello' },
      ['created', 'last-modified'],
      date,
    );

    expect(properties).toEqual({ Content: 'Hello' });
  });

  it('does not mutate the original properties', () => {
    const original = {};

    setTimestampProperties(
      timestampDatabase.properties,
      original,
      ['created'],
      date,
    );

    expect(original).toEqual({});
  });
});
