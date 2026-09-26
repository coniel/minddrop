import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, customContentTypes, setup } from '../test-utils';
import { getCustomContentTypes } from './getCustomContentTypes';

describe('getCustomContentTypes', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the types in creation order', () => {
    expect(getCustomContentTypes()).toEqual(customContentTypes);
  });
});
