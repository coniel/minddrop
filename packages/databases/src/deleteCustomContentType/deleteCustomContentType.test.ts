import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseSettingsStore } from '../DatabaseSettingsStore';
import { CustomContentTypeNotFoundError } from '../errors';
import {
  cleanup,
  customContentType_file_1,
  customContentType_url_1,
  setup,
} from '../test-utils';
import { deleteCustomContentType } from './deleteCustomContentType';

describe('deleteCustomContentType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the type from the store', () => {
    deleteCustomContentType(customContentType_file_1.id);

    expect(DatabaseSettingsStore).toHaveStoredValue(
      'contentDefaults',
      expect.objectContaining({ customTypes: [customContentType_url_1] }),
    );
  });

  it('throws when the type does not exist', () => {
    expect(() => deleteCustomContentType('missing')).toThrow(
      CustomContentTypeNotFoundError,
    );
  });
});
