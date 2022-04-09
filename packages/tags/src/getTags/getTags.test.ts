import { getTags } from './getTags';
import { TagNotFoundError } from '../errors';
import { cleanup, setup, tag1, tag2 } from '../test-utils';
import { mapById } from '@minddrop/utils';

describe('getTags', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested tags', () => {
    // Get some tags
    const tags = getTags([tag1.id, tag2.id]);

    // Should return the requested tags
    expect(tags).toEqual(mapById([tag1, tag2]));
  });

  it('throws a TagNotFoundError if the tag does not exist', () => {
    // Attempt to get tags of which one does not exist.
    // Should throw a `TagNotFoundError`.
    expect(() => getTags([tag1.id, 'missing'])).toThrowError(TagNotFoundError);
  });
});
