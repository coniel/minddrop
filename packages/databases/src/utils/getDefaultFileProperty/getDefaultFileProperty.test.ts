import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FilePropertySchema, ImagePropertySchema } from '@minddrop/properties';
import { DatabasesStore } from '../../DatabasesStore';
import {
  cleanup,
  genericFilePropertyName,
  imagePropertyName,
  invalidImagePropertyFile,
  rootStorageDatabase,
  setup,
  validImagePropertyFile,
} from '../../test-utils';
import { getDefaultFileProperty } from './getDefaultFileProperty';

describe('getDefaultFileProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns default specific property for the file type', () => {
    DatabasesStore.update(rootStorageDatabase.id, {
      ...rootStorageDatabase,
      // Add a second image property to the database above the default
      // image property.
      properties: [
        {
          type: ImagePropertySchema.type,
          name: 'Image 2',
        },
        ...rootStorageDatabase.properties,
      ],
    });

    const result = getDefaultFileProperty(
      rootStorageDatabase.id,
      validImagePropertyFile.name,
    )!;

    expect(result.name).toBe(imagePropertyName);
  });

  it('returns default generic file property if no specific default file property is set', () => {
    DatabasesStore.update(rootStorageDatabase.id, {
      ...rootStorageDatabase,
      // Remove the default image property configuration from the database
      defaultProperties: {
        [FilePropertySchema.type]: genericFilePropertyName,
      },
    });

    const result = getDefaultFileProperty(
      rootStorageDatabase.id,
      validImagePropertyFile.name,
    )!;

    expect(result.name).toBe(genericFilePropertyName);
  });

  it('returns first available specific property if no default property is provided', () => {
    DatabasesStore.update(rootStorageDatabase.id, {
      ...rootStorageDatabase,
      // Remove the default property configuration from the database
      defaultProperties: {},
    });

    const result = getDefaultFileProperty(
      rootStorageDatabase.id,
      validImagePropertyFile.name,
    )!;

    expect(result.name).toBe(imagePropertyName);
  });

  it('returns first available generic file property if no specific properties exist and no default generic file property is provided', () => {
    DatabasesStore.update(rootStorageDatabase.id, {
      ...rootStorageDatabase,
      defaultProperties: {},
      // Remove image property and default property configurations from the database
      properties: rootStorageDatabase.properties.filter(
        (property) => property.name !== imagePropertyName,
      ),
    });

    const result = getDefaultFileProperty(
      rootStorageDatabase.id,
      validImagePropertyFile.name,
    )!;

    expect(result.name).toBe(genericFilePropertyName);
  });

  it('returns first available specific property if specified default property does not exist', () => {
    DatabasesStore.update(rootStorageDatabase.id, {
      ...rootStorageDatabase,
      defaultProperties: {
        ...rootStorageDatabase.defaultProperties,
        // Replace the default image property configuration with a non-existent property
        [ImagePropertySchema.type]: 'Non-existent property',
      },
    });

    const result = getDefaultFileProperty(
      rootStorageDatabase.id,
      validImagePropertyFile.name,
    )!;

    expect(result.name).toBe(imagePropertyName);
  });

  it('returns first available generic file property if specified default generic file property does not exist', () => {
    DatabasesStore.update(rootStorageDatabase.id, {
      ...rootStorageDatabase,
      // Replace the default generic file property configuration with a non-existent property
      defaultProperties: {
        ...rootStorageDatabase.defaultProperties,
        [FilePropertySchema.type]: 'Non-existent property',
      },
      // Remove image property
      properties: rootStorageDatabase.properties.filter(
        (property) => property.name !== imagePropertyName,
      ),
    });

    const result = getDefaultFileProperty(
      rootStorageDatabase.id,
      validImagePropertyFile.name,
    )!;

    expect(result.name).toBe(genericFilePropertyName);
  });

  it('returns null if no matching property exists', async () => {
    DatabasesStore.update(rootStorageDatabase.id, {
      ...rootStorageDatabase,
      // Remove the generic file property from the database
      properties: rootStorageDatabase.properties.filter(
        (property) => property.name !== genericFilePropertyName,
      ),
    });

    // Test using an non-image file
    const result = getDefaultFileProperty(
      rootStorageDatabase.id,
      invalidImagePropertyFile.name,
    )!;

    expect(result).toBeNull();
  });

  it('returns null if the matched property is not a file property', () => {
    DatabasesStore.update(rootStorageDatabase.id, {
      ...rootStorageDatabase,
      // Set a non-file property as the default file property
      defaultProperties: {
        [ImagePropertySchema.type]: 'Text',
      },
      properties: [
        {
          type: 'text',
          name: 'Text',
        },
      ],
    });

    const result = getDefaultFileProperty(
      rootStorageDatabase.id,
      validImagePropertyFile.name,
    )!;

    expect(result).toBeNull();
  });
});
