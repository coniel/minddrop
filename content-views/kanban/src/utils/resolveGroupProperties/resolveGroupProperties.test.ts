import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { statusProperty } from '../../test-utils';
import { resolveGroupProperties } from './resolveGroupProperties';

const { entryTemplatesDatabase, objectDatabase } = DatabaseFixtures;

describe('resolveGroupProperties', () => {
  it('lists the database select properties', () => {
    expect(resolveGroupProperties(entryTemplatesDatabase)).toEqual([
      statusProperty,
    ]);
  });

  it('lists nothing when the database has no select properties', () => {
    expect(resolveGroupProperties(objectDatabase)).toEqual([]);
  });

  it('lists nothing while the database has not loaded', () => {
    expect(resolveGroupProperties(null)).toEqual([]);
  });
});
