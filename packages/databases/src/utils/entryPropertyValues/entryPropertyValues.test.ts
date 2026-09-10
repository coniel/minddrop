import { describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { DatabaseFixtures } from '../../test-utils';
import { entryPropertyValues } from './entryPropertyValues';

// Initialize translations used for the implicit property names
initializeI18n();

const { objectDatabase, objectEntry1 } = DatabaseFixtures;

describe('entryPropertyValues', () => {
  it("includes the entry's own property values", () => {
    const values = entryPropertyValues(objectEntry1, objectDatabase.properties);

    expect(values.Content).toBe(objectEntry1.properties.Content);
    expect(values.Icon).toBe(objectEntry1.properties.Icon);
  });

  it('includes the entry metadata values', () => {
    const values = entryPropertyValues(objectEntry1, objectDatabase.properties);

    expect(values.Title).toBe(objectEntry1.title);
    expect(values.Created).toBe(objectEntry1.created);
    expect(values['Last modified']).toBe(objectEntry1.lastModified);
  });

  it("prefers the entry's own value over the metadata value", () => {
    const entry = {
      ...objectEntry1,
      properties: { ...objectEntry1.properties, Title: 'Property title' },
    };

    const values = entryPropertyValues(entry, objectDatabase.properties);

    expect(values.Title).toBe('Property title');
  });
});
