import { get } from './get';
import { cleanup, setup, tag1, tag2 } from '../test-utils';
import { mapById } from '@minddrop/utils';

describe('get', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('given an array of IDs', () => {
    it('returns tag map', () => {
      // Get multiple tags
      const tags = get([tag1.id, tag2.id]);

      // Should return the tags as a map
      expect(tags).toEqual(mapById([tag1, tag2]));
    });
  });

  describe('given a single ID', () => {
    it('returns a single tag', () => {
      // Get a single tag
      const tag = get(tag1.id);

      // Should return the tag
      expect(tag).toEqual(tag1);
    });
  });
});
