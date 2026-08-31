import { describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import {
  objectDatabase,
  timestampDatabase,
  urlDatabase,
} from '../../test-utils';
import { resolveSortableEntryProperties } from './resolveSortableEntryProperties';

// Initialize translations used for the metadata property names
initializeI18n();

describe('resolveSortableEntryProperties', () => {
  it('lists the metadata properties when there are no databases', () => {
    const properties = resolveSortableEntryProperties([]);

    expect(properties).toEqual([
      {
        id: 'metadata:title',
        label: 'Title',
        icon: 'content-icon:type:default',
        by: 'metadata',
        property: 'title',
      },
      {
        id: 'metadata:created',
        label: 'Created',
        icon: 'content-icon:clock:default',
        by: 'metadata',
        property: 'created',
      },
      {
        id: 'metadata:last-modified',
        label: 'Last modified',
        icon: 'content-icon:clock:default',
        by: 'metadata',
        property: 'last-modified',
      },
    ]);
  });

  it('lists the databases properties', () => {
    const properties = resolveSortableEntryProperties([urlDatabase]);

    expect(properties).toContainEqual({
      id: 'property:URL',
      label: 'URL',
      icon: undefined,
      by: 'property',
      property: 'URL',
    });
  });

  it('names metadata properties after the declared property', () => {
    const properties = resolveSortableEntryProperties([timestampDatabase]);

    // The database declares a 'Created' property of its own
    expect(properties).toContainEqual(
      expect.objectContaining({
        id: 'metadata:created',
        label: 'Created',
        by: 'metadata',
        property: 'created',
      }),
    );

    // Declared metadata properties are not listed a second time
    expect(properties.filter((property) => property.by === 'property')).toEqual(
      [],
    );
  });

  it('uses the default metadata name when the databases disagree', () => {
    const properties = resolveSortableEntryProperties([
      {
        ...urlDatabase,
        properties: [{ type: 'title', name: 'Slug' }],
      },
      { ...urlDatabase, id: 'database_other' },
    ]);

    // Only one of the databases names the title property 'Slug'
    expect(properties).toContainEqual(
      expect.objectContaining({ id: 'metadata:title', label: 'Title' }),
    );
  });

  it('lists properties shared by every database once', () => {
    const properties = resolveSortableEntryProperties([
      urlDatabase,
      { ...urlDatabase, id: 'database_other' },
    ]);

    expect(
      properties.filter((property) => property.id === 'property:URL'),
    ).toHaveLength(1);
  });

  it('omits properties missing from any of the databases', () => {
    const properties = resolveSortableEntryProperties([
      {
        ...urlDatabase,
        properties: [
          { type: 'url', name: 'URL' },
          { type: 'text', name: 'Notes' },
        ],
      },
      { ...urlDatabase, id: 'database_other' },
    ]);

    // Only the first database declares a 'Notes' property
    expect(properties.map((property) => property.id)).not.toContain(
      'property:Notes',
    );
    expect(properties.map((property) => property.id)).toContain('property:URL');
  });

  it('omits properties declared under the same name with another type', () => {
    const properties = resolveSortableEntryProperties([
      urlDatabase,
      {
        ...urlDatabase,
        id: 'database_other',
        properties: [{ type: 'text', name: 'URL' }],
      },
    ]);

    expect(properties.map((property) => property.id)).not.toContain(
      'property:URL',
    );
  });

  it('omits properties whose values have no order', () => {
    // The database's properties are formatted text and an icon
    const properties = resolveSortableEntryProperties([objectDatabase]);

    expect(properties.filter((property) => property.by === 'property')).toEqual(
      [],
    );
  });
});
