import { setup, cleanup, core, headingElement1 } from '../test-utils';
import { getRichTextElement } from '../getRichTextElement';
import { permanentlyDeleteRichTextElement } from './permanentlyDeleteRichTextElement';
import { RichTextElementNotFoundError } from '../errors';

describe('permanentlyDeleteRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the element from the store', () => {
    // Permanently delete an element
    permanentlyDeleteRichTextElement(core, headingElement1.id);

    // Attempting to get the permanently deleted element shoould
    // throw a `RichTextElementNotFoundError`.
    expect(() => getRichTextElement(headingElement1.id)).toThrowError(
      RichTextElementNotFoundError,
    );
  });

  it('returns the element', () => {
    // Permanently delete an element
    const element = permanentlyDeleteRichTextElement(core, headingElement1.id);

    // Should return the original element
    expect(element).toEqual(headingElement1);
  });

  it('dispatches a `rich-text-elements:delete-permanently` event', (done) => {
    // Listen to 'rich-text-elements:delete-permanently' events
    core.addEventListener(
      'rich-text-elements:delete-permanently',
      (payload) => {
        // Payload data should be the permanently deleted element
        expect(payload.data).toEqual(headingElement1);
        done();
      },
    );

    // Permanently delete an element
    permanentlyDeleteRichTextElement(core, headingElement1.id);
  });
});
