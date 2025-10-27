import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemTypeNotFoundError } from '../errors';
import { cleanup, markdownItemTypeConfig, setup } from '../test-utils';
import { getItemTypeConfig } from './getItemTypeConfig';

describe('get', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves the item type config for the specified type', () => {
    const result = getItemTypeConfig(markdownItemTypeConfig.nameSingular);

    expect(result).toBe(markdownItemTypeConfig);
  });

  it('throws an error if the item type config does not exist', () => {
    expect(() => getItemTypeConfig('missing')).toThrow(ItemTypeNotFoundError);
  });

  it('does not throw if the item type config does not exist and throwOnNotFound is false', () => {
    expect(() => getItemTypeConfig('missing', false)).not.toThrow(
      ItemTypeNotFoundError,
    );
  });
});
