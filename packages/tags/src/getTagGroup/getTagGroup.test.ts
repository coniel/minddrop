import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TagGroupNotFoundError } from '../errors';
import { cleanup, setup, tagGroup_1 } from '../test-utils';
import { getTagGroup } from './getTagGroup';

describe('getTagGroup', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a tag group by ID', () => {
    const result = getTagGroup(tagGroup_1.id);

    expect(result).toBe(tagGroup_1);
  });

  it('throws an error if the group does not exist', () => {
    expect(() => getTagGroup('missing')).toThrow(TagGroupNotFoundError);
  });

  it('does not throw if the group does not exist and throwOnNotFound is false', () => {
    expect(() => getTagGroup('missing', false)).not.toThrow(
      TagGroupNotFoundError,
    );
  });
});
