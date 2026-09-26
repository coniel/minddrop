import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CustomContentTypeNotFoundError } from '../errors';
import { cleanup, customContentType_file_1, setup } from '../test-utils';
import { getCustomContentType } from './getCustomContentType';

describe('getCustomContentType', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the type', () => {
    expect(getCustomContentType(customContentType_file_1.id)).toEqual(
      customContentType_file_1,
    );
  });

  it('throws when the type does not exist', () => {
    expect(() => getCustomContentType('missing')).toThrow(
      CustomContentTypeNotFoundError,
    );
  });

  it('returns null when the type does not exist and throwing is off', () => {
    expect(getCustomContentType('missing', false)).toBeNull();
  });
});
