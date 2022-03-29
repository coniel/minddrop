import { mapById } from '@minddrop/utils';
import { RichTextElementValidationError } from '../errors';
import {
  cleanup,
  core,
  headingElement1,
  paragraphElement1,
  setup,
} from '../test-utils';
import { RichTextElements } from './RichTextElements';

describe('RichTextElements API', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('get', () => {
    it('returns a single element when passed a string ID', () => {
      // Get a single element
      const result = RichTextElements.get(headingElement1.id);

      // Should return the element
      expect(result).toEqual(headingElement1);
    });

    it('returns an element map when passed an array of IDs', () => {
      // Get a multiple elements
      const result = RichTextElements.get([
        headingElement1.id,
        paragraphElement1.id,
      ]);

      // Should return the elements as a map
      expect(result).toEqual(mapById([headingElement1, paragraphElement1]));
    });

    it('allows filtering mutliple elements', () => {
      // Get a multiple elements and filter by type
      const result = RichTextElements.get(
        [headingElement1.id, paragraphElement1.id],
        { type: [headingElement1.type] },
      );

      // Should return an element map containing only the 'heading-1' type
      expect(result).toEqual(mapById([headingElement1]));
    });
  });

  describe('update', () => {
    it('validates the update data', () => {
      // Attempt to update a forbidden field on an element, should throw
      // a `RichTextElementValidationError`.
      expect(() =>
        RichTextElements.update(core, headingElement1.id, {
          // @ts-ignore
          parents: [],
        }),
      ).toThrowError(RichTextElementValidationError);
    });
  });
});
