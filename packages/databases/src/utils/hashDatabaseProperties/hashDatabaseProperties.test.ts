import { describe, expect, it } from 'vitest';
import { objectDatabase } from '../../test-utils';
import { hashDatabaseProperties } from './hashDatabaseProperties';

describe('hashDatabaseProperties', () => {
  it('hashes equal schemas equally', () => {
    expect(hashDatabaseProperties(objectDatabase.properties)).toBe(
      hashDatabaseProperties(structuredClone(objectDatabase.properties)),
    );
  });

  it('hashes a changed schema differently', () => {
    expect(hashDatabaseProperties(objectDatabase.properties)).not.toBe(
      hashDatabaseProperties([
        ...objectDatabase.properties,
        { name: 'Added', type: 'text' },
      ]),
    );
  });
});
