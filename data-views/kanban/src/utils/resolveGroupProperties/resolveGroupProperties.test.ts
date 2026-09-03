import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { statusProperty } from '../../test-utils';
import { resolveGroupProperties } from './resolveGroupProperties';

const { entryTemplatesDatabase, objectDatabase } = DatabaseFixtures;

describe('resolveGroupProperties', () => {
  it('lists the first database select properties', () => {
    expect(resolveGroupProperties([entryTemplatesDatabase])).toEqual([
      statusProperty,
    ]);
  });

  it('ignores the databases beyond the first', () => {
    expect(
      resolveGroupProperties([objectDatabase, entryTemplatesDatabase]),
    ).toEqual([]);
  });

  it('lists nothing when there are no databases', () => {
    expect(resolveGroupProperties([])).toEqual([]);
  });
});
