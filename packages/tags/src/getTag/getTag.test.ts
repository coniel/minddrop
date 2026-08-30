import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TagNotFoundError } from '../errors';
import { cleanup, setup, tag_1 } from '../test-utils';
import { getTag } from './getTag';

describe('getTag', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a tag by ID', () => {
    const result = getTag(tag_1.id);

    expect(result).toBe(tag_1);
  });

  it('throws an error if the tag does not exist', () => {
    expect(() => getTag('missing')).toThrow(TagNotFoundError);
  });

  it('does not throw if the tag does not exist and throwOnNotFound is false', () => {
    expect(() => getTag('missing', false)).not.toThrow(TagNotFoundError);
  });
});
