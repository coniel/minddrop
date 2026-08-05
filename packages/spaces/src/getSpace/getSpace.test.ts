import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SpaceNotFoundError } from '../errors';
import { cleanup, setup, space_1 } from '../test-utils';
import { getSpace } from './getSpace';

describe('getSpace', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a space by ID', () => {
    const result = getSpace(space_1.id);

    expect(result).toBe(space_1);
  });

  it('throws an error if the space does not exist', () => {
    expect(() => getSpace('missing')).toThrow(SpaceNotFoundError);
  });

  it('does not throw if the space does not exist and throwOnNotFound is false', () => {
    expect(() => getSpace('missing', false)).not.toThrow(SpaceNotFoundError);
  });
});
