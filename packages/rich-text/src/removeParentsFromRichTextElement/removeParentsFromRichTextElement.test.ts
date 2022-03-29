import { addParentsToRichTextElement } from '../addParentsToRichTextElement';
import { getRichTextElement } from '../getRichTextElement';
import {
  setup,
  cleanup,
  core,
  headingElement1,
  paragraphElement1,
} from '../test-utils';
import { removeParentsFromRichTextElement } from './removeParentsFromRichTextElement';

// The test parent reference to remove
const parentReference = { type: 'rich-text-element', id: paragraphElement1.id };

describe('removeParentFromRichTextElement', () => {
  beforeEach(() => {
    setup();

    // Add test parent to an element
    addParentsToRichTextElement(core, headingElement1.id, [parentReference]);
  });

  afterEach(cleanup);

  it('removes the parent references from the element', () => {
    // Remove parent from an element
    removeParentsFromRichTextElement(core, headingElement1.id, [
      parentReference,
    ]);

    // Get the element
    const element = getRichTextElement(headingElement1.id);

    // Element should no longer have the parent
    expect(element.parents).not.toContainEqual(parentReference);
  });

  it('returns the updated element', () => {
    // Remove parent from an element
    const result = removeParentsFromRichTextElement(core, headingElement1.id, [
      parentReference,
    ]);

    // Get the element from the store
    const element = getRichTextElement(headingElement1.id);

    // Returned value should match updated element
    expect(result).toEqual(element);
  });

  it('dispatches a `rich-text-elements:remove-parents` event', (done) => {
    // Listen to 'rich-text-elements:remove-parents' events
    core.addEventListener('rich-text-elements:remove-parents', (payload) => {
      // Get the updated element
      const element = getRichTextElement(headingElement1.id);

      // Payload data should contain the updated element
      expect(payload.data.element).toEqual(element);
      // Payload data should contain the removed parents
      expect(payload.data.parents).toEqual([parentReference]);
      done();
    });

    // Remove parent from an element
    removeParentsFromRichTextElement(core, headingElement1.id, [
      parentReference,
    ]);
  });
});
