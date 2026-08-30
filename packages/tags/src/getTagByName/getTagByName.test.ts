import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TagNotFoundError } from '../errors';
import { cleanup, setup, tag_1 } from '../test-utils';
import { getTagByName } from './getTagByName';

describe('getTagByName', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a tag by name', () => {
    const result = getTagByName(tag_1.name);

    expect(result).toBe(tag_1);
  });

  it('matches names case-insensitively', () => {
    const result = getTagByName(tag_1.name.toUpperCase());

    expect(result).toBe(tag_1);
  });

  it('throws an error if the tag does not exist', () => {
    expect(() => getTagByName('missing')).toThrow(TagNotFoundError);
  });

  it('does not throw if the tag does not exist and throwOnNotFound is false', () => {
    expect(getTagByName('missing', false)).toBeNull();
  });
});
