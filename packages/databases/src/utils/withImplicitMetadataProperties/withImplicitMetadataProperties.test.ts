import { describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { PropertiesSchema } from '@minddrop/properties';
import { objectDatabase } from '../../test-utils';
import { withImplicitMetadataProperties } from './withImplicitMetadataProperties';

// Initialize translations used for the implicit property names
initializeI18n();

describe('withImplicitMetadataProperties', () => {
  it('prepends the implicit metadata properties', () => {
    const properties = withImplicitMetadataProperties(
      objectDatabase.properties,
    );

    expect(properties.slice(0, 3)).toEqual([
      expect.objectContaining({ type: 'title', name: 'Title' }),
      expect.objectContaining({ type: 'created', name: 'Created' }),
      expect.objectContaining({
        type: 'last-modified',
        name: 'Last modified',
      }),
    ]);
    expect(properties.slice(3)).toEqual(objectDatabase.properties);
  });

  it('omits metadata properties declared by the schema', () => {
    // A schema which already declares a title property
    const declaredTitleSchema: PropertiesSchema = [
      { type: 'title', name: 'Name' },
      ...objectDatabase.properties,
    ];

    const properties = withImplicitMetadataProperties(declaredTitleSchema);

    expect(properties.slice(0, 2)).toEqual([
      expect.objectContaining({ type: 'created', name: 'Created' }),
      expect.objectContaining({
        type: 'last-modified',
        name: 'Last modified',
      }),
    ]);
    expect(properties.slice(2)).toEqual(declaredTitleSchema);
  });

  it('leaves schemas declaring all metadata properties untouched', () => {
    // A schema which declares all three metadata properties
    const declaredMetadataSchema: PropertiesSchema = [
      { type: 'title', name: 'Name' },
      { type: 'created', name: 'Added' },
      { type: 'last-modified', name: 'Updated' },
      ...objectDatabase.properties,
    ];

    expect(withImplicitMetadataProperties(declaredMetadataSchema)).toBe(
      declaredMetadataSchema,
    );
  });
});
