import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import {
  cleanup,
  customContentTypes,
  objectDatabase,
  setup,
} from '../test-utils';
import { createCustomContentType } from './createCustomContentType';

describe('createCustomContentType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the type to the store after the existing types', () => {
    const customType = createCustomContentType({
      name: 'Books',
      kind: 'file',
      matchers: ['epub'],
      databaseId: objectDatabase.id,
    });

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({
        customTypes: [...customContentTypes, customType],
      }),
    );
  });

  it('normalizes and deduplicates the matchers', () => {
    const customType = createCustomContentType({
      name: 'Books',
      kind: 'file',
      matchers: ['.EPUB', 'epub', 'mobi'],
      databaseId: null,
    });

    expect(customType.matchers).toEqual(['epub', 'mobi']);
  });

  it('rejects matchers already in use', () => {
    expect(() =>
      createCustomContentType({
        name: 'Photos',
        kind: 'file',
        matchers: ['jpg'],
        databaseId: null,
      }),
    ).toThrow(InvalidParameterError);
  });
});
