import { Files, FILES_TEST_DATA } from '@minddrop/files';
import {
  RichTextElementTypeNotRegisteredError,
  RichTextElementValidationError,
} from '../errors';
import { getRichTextElement } from '../getRichTextElement';
import {
  setup,
  cleanup,
  core,
  headingElementConfig,
  blockEquationElementConfig,
} from '../test-utils';
import { useRichTextStore } from '../useRichTextStore';
import { createRichTextElement } from './createRichTextElement';

const { imageFileRef } = FILES_TEST_DATA;

describe('createRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws a `RichTextElementTypeNotRegisteredError` if the element type is not registered', () => {
    // Create an element of an unregistered type. Should throw
    // an error.
    expect(() =>
      createRichTextElement(core, { type: 'unregistered' }),
    ).toThrowError(RichTextElementTypeNotRegisteredError);
  });

  it('returns the new element', () => {
    // Create a new element
    const element = createRichTextElement(core, {
      type: headingElementConfig.type,
    });

    // Should return the new element
    expect(element.type).toBe(headingElementConfig.type);
  });

  it('adds children if the element is non-void and has none', () => {
    // Create an element without children
    const noChildren = createRichTextElement(core, {
      type: headingElementConfig.type,
    });
    // Create an element with children
    const withChildren = createRichTextElement(core, {
      type: headingElementConfig.type,
      children: [{ text: 'Hello world' }],
    });
    // Create a void element without children
    const voidElement = createRichTextElement(core, {
      type: blockEquationElementConfig.type,
    });

    // Element created without children should have an
    // empty rich text node as a child.
    expect(noChildren.children[0]).toEqual({ text: '' });
    // Element created with children should maintain them
    expect(withChildren.children).toEqual([{ text: 'Hello world' }]);
    // Void element should not be given children
    expect(voidElement.children).toBeUndefined();
  });

  it('adds the element as a parent on its files', () => {
    // Create an element with a file
    const element = createRichTextElement(core, {
      type: headingElementConfig.type,
      files: [imageFileRef.id],
    });

    // Get the updated file reference
    const fileReference = Files.get(imageFileRef.id);

    // File should have the element as a parent
    expect(fileReference.attachedTo.includes(element.id)).toBeTruthy();
  });

  it('throws a RichTextElementValidationError if the data contains `parents`', () => {
    // Create an element with `parents` set in the data.
    // Should throw a `RichTextElementValidationError`.
    expect(() =>
      createRichTextElement(core, {
        type: headingElementConfig.type,
        parents: [],
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('validates the element', () => {
    // Create an invalid element, should throw a
    // `RichTextElementValidationError`.
    expect(() =>
      createRichTextElement(core, {
        type: headingElementConfig.type,
        // Should not be set if `deleted` is not `true`
        deletedAt: new Date(),
      }),
    ).toThrowError(RichTextElementValidationError);
  });

  it('adds the element to the rich text store', () => {
    // Create a new element
    const element = createRichTextElement(core, {
      type: headingElementConfig.type,
    });

    // Get the element from the store
    const storeElement = useRichTextStore.getState().elements[element.id];

    // Store element should match returned element
    expect(storeElement).toEqual(element);
  });

  it('dispatches a `rich-text-elements:create` event', (done) => {
    // Listen to 'rich-text-elements:create' events
    core.addEventListener('rich-text-elements:create', (payload) => {
      // Get the created element
      const element = getRichTextElement(payload.data.id);

      // Payload data should be the new element
      expect(payload.data).toEqual(element);
      done();
    });

    // Create a new element
    createRichTextElement(core, { type: headingElementConfig.type });
  });
});
