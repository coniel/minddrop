import { describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { DatabaseFixtures } from '../../index';
import { entryMetadataPropertyValues } from './entryMetadataPropertyValues';

// Initialize translations used for the implicit property names
initializeI18n();

const { objectDatabase, objectEntry1, timestampDatabase } = DatabaseFixtures;

describe('entryMetadataPropertyValues', () => {
  it('keys metadata values by the implicit property names', () => {
    const values = entryMetadataPropertyValues(
      objectEntry1,
      objectDatabase.properties,
    );

    expect(values).toEqual({
      Title: objectEntry1.title,
      Created: objectEntry1.created,
      'Last modified': objectEntry1.lastModified,
    });
  });

  it('keys metadata values by declared property names', () => {
    const values = entryMetadataPropertyValues(
      objectEntry1,
      timestampDatabase.properties,
    );

    expect(values).toEqual({
      Title: objectEntry1.title,
      Created: objectEntry1.created,
      'Last Modified': objectEntry1.lastModified,
    });
  });
});
