import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionTypeNotRegisteredError } from '../errors';
import { cleanup, markdownCollectionTypeConfig, setup } from '../test-utils';
import { getCollectionTypeConfig } from './getCollectionTypeConfig';

describe('getCollectionTypeConfig', () => {
  beforeEach(() => setup({ loadCollectionTypeConfigs: true }));

  afterEach(cleanup);

  it('throws if the collection type is not registered', () => {
    expect(() => getCollectionTypeConfig('invalid-type')).toThrow(
      CollectionTypeNotRegisteredError,
    );
  });

  it('returns the collection type config if it is registered', () => {
    const config = getCollectionTypeConfig('markdown');

    expect(config).toEqual(markdownCollectionTypeConfig);
  });
});
