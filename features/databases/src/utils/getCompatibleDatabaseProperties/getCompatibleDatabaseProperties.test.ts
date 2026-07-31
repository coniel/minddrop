import { describe, expect, it } from 'vitest';
import { DatabaseFixtures } from '@minddrop/databases';
import { PropertySchema } from '@minddrop/properties';
import { getCompatibleDatabaseProperties } from './getCompatibleDatabaseProperties';

const { objectDatabase } = DatabaseFixtures;

const textDesignProperty: PropertySchema = { type: 'text', name: 'Heading' };
const formattedTextDesignProperty: PropertySchema = {
  type: 'formatted-text',
  name: 'Body',
};
const numberDesignProperty: PropertySchema = { type: 'number', name: 'Count' };

describe('getCompatibleDatabaseProperties', () => {
  it('returns database properties of compatible types', () => {
    // objectDatabase has a formatted-text 'Content' property
    const compatible = getCompatibleDatabaseProperties(
      formattedTextDesignProperty,
      objectDatabase.properties,
    );

    expect(compatible.map((property) => property.name)).toEqual(['Content']);
  });

  it('includes the implicit Title property for compatible types', () => {
    const compatible = getCompatibleDatabaseProperties(
      textDesignProperty,
      objectDatabase.properties,
    );

    expect(compatible.map((property) => property.name)).toContain('Title');
  });

  it('returns an empty list when nothing is compatible', () => {
    expect(
      getCompatibleDatabaseProperties(
        numberDesignProperty,
        objectDatabase.properties,
      ),
    ).toEqual([]);
  });
});
