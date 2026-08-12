import { describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { PropertiesSchema } from '@minddrop/properties';
import { DatabaseFixtures } from '../../index';
import { resolveDesignPropertyMap } from './resolveDesignPropertyMap';

// Initialize translations used for the implicit property names
initializeI18n();

const { objectDatabase, timestampDatabase } = DatabaseFixtures;

// A design declaring one property of each metadata type plus a
// property which is not auto-mappable
const designProperties: PropertiesSchema = [
  { type: 'title', name: 'Heading' },
  { type: 'created', name: 'Added' },
  { type: 'last-modified', name: 'Updated' },
  { type: 'text', name: 'Body' },
];

describe('resolveDesignPropertyMap', () => {
  it('auto-maps metadata properties to the implicit properties', () => {
    const map = resolveDesignPropertyMap(designProperties, objectDatabase);

    expect(map).toEqual({
      Heading: 'Title',
      Added: 'Created',
      Updated: 'Last modified',
    });
  });

  it('auto-maps metadata properties to declared properties', () => {
    const map = resolveDesignPropertyMap(designProperties, timestampDatabase);

    expect(map).toEqual({
      Heading: 'Title',
      Added: 'Created',
      Updated: 'Last Modified',
    });
  });

  it('preserves explicit mappings', () => {
    // A database mapping the design's title and text properties
    const database = {
      ...objectDatabase,
      designPropertyMap: { Heading: 'Icon', Body: 'Content' },
    };

    const map = resolveDesignPropertyMap(designProperties, database);

    expect(map).toEqual({
      Heading: 'Icon',
      Body: 'Content',
      Added: 'Created',
      Updated: 'Last modified',
    });
  });
});
