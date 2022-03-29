import {
  ParentReferences,
  ParentReferenceValidationError,
} from '@minddrop/core';
import { setup, cleanup, core, headingElement1 } from '../test-utils';
import { getRichTextElement } from '../getRichTextElement';
import { addParentsToRichTextElement } from './addParentsToRichTextElement';

describe('addParentsToRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('validates the parent references', () => {
    // Attempt to add an invalid parent reference to an element.
    // Should throw a `ParentReferenceValidationError`.
    expect(() =>
      addParentsToRichTextElement(core, headingElement1.id, [
        // @ts-ignore
        { id: 'parent-id' },
      ]),
    ).toThrowError(ParentReferenceValidationError);
  });

  it('adds the parent references to the element', () => {
    // Add a parent reference to an element
    addParentsToRichTextElement(core, headingElement1.id, [
      { type: 'test', id: 'id' },
    ]);

    // Get the updated element
    const element = getRichTextElement(headingElement1.id);

    // Element should contain the added parent
    expect(ParentReferences.contains('test', element.parents)).toBeTruthy();
  });

  it('returns the updated element', () => {
    // Add a parent reference to an element
    const element = addParentsToRichTextElement(core, headingElement1.id, [
      { type: 'test', id: 'id' },
    ]);

    // Should return the updated element
    expect(ParentReferences.contains('test', element.parents)).toBeTruthy();
  });

  it('dispatches a `rich-text-elements:add-parents` event', (done) => {
    // The parents to add
    const parents = [{ type: 'test', id: 'id' }];

    // Listen to 'rich-text-elements:add-parents' events
    core.addEventListener('rich-text-elements:add-parents', (payload) => {
      // Get the updated element
      const element = getRichTextElement(headingElement1.id);

      // Payload data should contain the updated element
      expect(payload.data.element).toEqual(element);
      // Payload data should contain the added parents
      expect(payload.data.parents).toEqual(parents);
      done();
    });

    // Add a parent reference to an element
    addParentsToRichTextElement(core, headingElement1.id, parents);
  });
});
