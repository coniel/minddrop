import {
  RichTextElementNotFoundError,
  RichTextElementTypeNotRegisteredError,
  RichTextElementValidationError,
} from '../errors';
import { getRichTextElement } from '../getRichTextElement';
import {
  setup,
  cleanup,
  core,
  headingElementConfig,
  headingElement1,
} from '../test-utils';
import { RichTextElementChanges } from '../types';
import { unregisterRichTextElementType } from '../unregisterRichTextElementType';
import { updateRichTextElement } from './updateRichTextElement';

describe('updateRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws a `RichTextElementNotFoundError` if the element does not exist', () => {
    // Attempt to update a non existent element, should throw an error.
    expect(() =>
      updateRichTextElement(core, 'missing-element', {
        children: [{ text: 'hello' }],
      }),
    ).toThrowError(RichTextElementNotFoundError);
  });

  it('throws a `RichTextElementTypeNotRegisteredError` if the element type is not registered', () => {
    // Unregister the 'heading-1' element type
    unregisterRichTextElementType(core, headingElementConfig.type);

    // Attempt to update a 'heading-1' element, should throw an error.
    expect(() =>
      updateRichTextElement(core, headingElement1.id, {
        children: [{ text: 'hello' }],
      }),
    ).toThrowError(RichTextElementTypeNotRegisteredError);
  });

  it('validates the resulting element', () => {
    // Attempt to update an element in a way which results in invalid
    // data, should throw an error.
    expect(() =>
      updateRichTextElement(core, headingElement1.id, {
        // Children cannot be empty
        children: [],
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('returns the updated element', () => {
    // Update an element
    const updated = updateRichTextElement(core, headingElement1.id, {
      children: [{ text: 'Hello world' }],
    });

    // Should return updated element
    expect(updated.children[0]).toEqual({ text: 'Hello world' });
  });

  it('sets the updated element in the rich text store', () => {
    // Update an element
    const updated = updateRichTextElement(core, headingElement1.id, {
      children: [{ text: 'Hello world' }],
    });

    // Get the updated element from the store
    const element = getRichTextElement(headingElement1.id);

    // Store element should match updated element
    expect(element).toEqual(updated);
  });

  it('dispatches a `rich-text-elements:update` event', (done) => {
    // The changes to apply to the element
    const changes: RichTextElementChanges = {
      children: [{ text: 'Hello world' }],
    };
    // Get the element's original data
    const before = getRichTextElement(headingElement1.id);

    // Listen to 'rich-text-elementa:update' events
    core.addEventListener('rich-text-elements:update', (payload) => {
      // Get the updated element
      const after = getRichTextElement(headingElement1.id);

      // Payload data should be an update object
      expect(payload.data).toEqual({ before, after, changes });
      done();
    });

    // Update an element
    updateRichTextElement(core, headingElement1.id, changes);
  });
});
