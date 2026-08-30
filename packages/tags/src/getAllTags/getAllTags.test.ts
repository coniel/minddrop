import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, tags } from '../test-utils';
import { getAllTags } from './getAllTags';

describe('getAllTags', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves all tags', () => {
    expect(getAllTags()).toEqual(tags);
  });
});
