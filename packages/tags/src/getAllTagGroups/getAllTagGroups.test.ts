import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, setup, tagGroups } from '../test-utils';
import { getAllTagGroups } from './getAllTagGroups';

describe('getAllTagGroups', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves all tag groups', () => {
    expect(getAllTagGroups()).toEqual(tagGroups);
  });
});
