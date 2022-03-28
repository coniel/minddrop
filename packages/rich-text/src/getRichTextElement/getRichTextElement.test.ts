import { RichTextElementNotFoundError } from '../errors';
import { setup, cleanup, headingElement1 } from '../test-utils';
import { getRichTextElement } from './getRichTextElement';

describe('getRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested element', () => {
    // Get the element
    const element = getRichTextElement(headingElement1.id);

    // Should return the element
    expect(element).toEqual(headingElement1);
  });

  it('throws a `RichTextElementNotFoundError` if the element does not exist', () => {
    // Should throw an error
    expect(() => getRichTextElement('missing')).toThrowError(
      RichTextElementNotFoundError,
    );
  });
});
