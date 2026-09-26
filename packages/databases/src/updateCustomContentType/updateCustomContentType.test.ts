import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { CustomContentTypeNotFoundError } from '../errors';
import {
  cleanup,
  customContentType_file_1,
  customContentType_url_1,
  objectDatabase,
  setup,
} from '../test-utils';
import { updateCustomContentType } from './updateCustomContentType';

describe('updateCustomContentType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the type in the store', () => {
    updateCustomContentType(customContentType_file_1.id, {
      name: 'Models',
      databaseId: objectDatabase.id,
    });

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({
        customTypes: [
          {
            ...customContentType_file_1,
            name: 'Models',
            databaseId: objectDatabase.id,
          },
          customContentType_url_1,
        ],
      }),
    );
  });

  it('normalizes and deduplicates given matchers', () => {
    const updatedType = updateCustomContentType(customContentType_file_1.id, {
      matchers: ['.PLY', 'ply', 'stl'],
    });

    expect(updatedType.matchers).toEqual(['ply', 'stl']);
  });

  it("accepts the type's own matchers", () => {
    expect(() =>
      updateCustomContentType(customContentType_file_1.id, {
        matchers: customContentType_file_1.matchers,
      }),
    ).not.toThrow();
  });

  it('rejects matchers already in use', () => {
    expect(() =>
      updateCustomContentType(customContentType_file_1.id, {
        matchers: ['png'],
      }),
    ).toThrow(InvalidParameterError);
  });

  it('throws when the type does not exist', () => {
    expect(() => updateCustomContentType('missing', { name: 'X' })).toThrow(
      CustomContentTypeNotFoundError,
    );
  });
});
