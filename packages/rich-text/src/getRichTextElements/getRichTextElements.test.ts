import { mapById } from '@minddrop/utils';
import { RichTextElementNotFoundError } from '../errors';
import {
  setup,
  cleanup,
  headingElement1,
  paragraphElement1,
} from '../test-utils';
import { getRichTextElements } from './getRichTextElements';

describe('getRichTextElements', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns a RichTextElementMap of requested elements', () => {
    // Get the elements
    const elements = getRichTextElements([
      headingElement1.id,
      paragraphElement1.id,
    ]);

    // Should be a map of the requested elements
    expect(elements).toEqual(mapById([headingElement1, paragraphElement1]));
  });

  it('throws a `RichTextElementNotFoundError` if any of the elements do no exist', () => {
    // Should throw an error
    expect(() =>
      getRichTextElements([headingElement1.id, 'missing-1', 'missing-2']),
    ).toThrowError(RichTextElementNotFoundError);
  });
});
