import { getTag } from './getTag';
import { TagNotFoundError } from '../errors';
import { cleanup, setup, tag1 } from '../test-utils';

describe('getTag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested tag', () => {
    // Get a tag
    const tag = getTag(tag1.id);

    // Should return the requested tag
    expect(tag).toEqual(tag1);
  });

  it('throws a `TagNotFoundError` if the tag does not exist', () => {
    // Attempt to get a missing tag. Should throw
    // a `TagNotFoundError`.
    expect(() => getTag('missing')).toThrowError(TagNotFoundError);
  });
});
