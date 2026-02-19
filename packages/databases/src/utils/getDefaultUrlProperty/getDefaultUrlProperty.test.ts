import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { UrlPropertySchema } from '@minddrop/properties';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, objectDatabase, setup, urlDatabase } from '../../test-utils';
import { getDefaultUrlProperty } from './getDefaultUrlProperty';

describe('getDefaultUrlProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns null if the database has no url properties', () => {
    const result = getDefaultUrlProperty(
      objectDatabase.id,
      'https://example.com',
    );

    expect(result).toBeNull();
  });

  it('returns default url property if it exists', () => {
    // Add a second url property to the database above the default url property
    DatabasesStore.update(urlDatabase.id, {
      properties: [
        {
          type: UrlPropertySchema.type,
          name: 'URL 2',
        },
        ...urlDatabase.properties,
      ],
    });

    const result = getDefaultUrlProperty(urlDatabase.id, 'https://example.com');

    expect(result?.name).toBe('URL');
  });

  it('returns first available url property if no default url property is provided', () => {
    DatabasesStore.update(urlDatabase.id, {
      // Remove the default url property configuration from the database
      defaultProperties: {},
    });

    const result = getDefaultUrlProperty(urlDatabase.id, 'https://example.com');

    expect(result?.name).toBe('URL');
  });

  it('returns first available url property if specified default url property does not exist', () => {
    DatabasesStore.update(urlDatabase.id, {
      defaultProperties: {
        // Replace the default url property configuration with a non-existent property
        [UrlPropertySchema.type]: 'Non-existent property',
      },
    });

    const result = getDefaultUrlProperty(urlDatabase.id, 'https://example.com');

    expect(result?.name).toBe('URL');
  });

  it('ensures the property is a url property', () => {
    DatabasesStore.update(urlDatabase.id, {
      ...urlDatabase,
      defaultProperties: {
        // Set a non-url property as the default url property
        [UrlPropertySchema.type]: 'Text',
      },
      properties: [
        {
          type: 'text',
          name: 'Text',
        },
      ],
    });

    const result = getDefaultUrlProperty(urlDatabase.id, 'https://example.com');

    expect(result).toBeNull();
  });
});
