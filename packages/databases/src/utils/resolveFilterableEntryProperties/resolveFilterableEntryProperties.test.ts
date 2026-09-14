import { describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import {
  objectDatabase,
  timestampDatabase,
  urlDatabase,
} from '../../test-utils';
import { resolveFilterableEntryProperties } from './resolveFilterableEntryProperties';

// Initialize translations used for the metadata property names
initializeI18n();

describe('resolveFilterableEntryProperties', () => {
  it('lists the metadata properties when there are no databases', () => {
    const properties = resolveFilterableEntryProperties([]);

    expect(properties.map((property) => property.type)).toEqual([
      'title',
      'created',
      'last-modified',
    ]);
  });

  it('lists the databases properties', () => {
    const properties = resolveFilterableEntryProperties([urlDatabase]);

    expect(properties).toContainEqual(
      expect.objectContaining({ type: 'url', name: 'URL' }),
    );
  });

  it('lists a declared metadata property in place of the implicit one', () => {
    const properties = resolveFilterableEntryProperties([timestampDatabase]);

    // The database declares a 'Created' property of its own
    expect(
      properties.filter((property) => property.type === 'created'),
    ).toEqual([expect.objectContaining({ type: 'created', name: 'Created' })]);
  });

  it('omits properties of types without operators', () => {
    const properties = resolveFilterableEntryProperties([
      {
        ...objectDatabase,
        properties: [
          ...objectDatabase.properties,
          { type: 'color', name: 'Colour' },
        ],
      },
    ]);

    expect(properties.some((property) => property.type === 'color')).toBe(
      false,
    );
  });

  it('omits properties missing from any of the databases', () => {
    const properties = resolveFilterableEntryProperties([
      urlDatabase,
      objectDatabase,
    ]);

    expect(properties.some((property) => property.name === 'URL')).toBe(false);
  });
});
