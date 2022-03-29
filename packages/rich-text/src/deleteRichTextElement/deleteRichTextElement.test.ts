import { setup, cleanup, headingElement1, core } from '../test-utils';
import { getRichTextElement } from '../getRichTextElement';
import { deleteRichTextElement } from './deleteRichTextElement';

describe('deleteRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('marks the element as deleted', () => {
    // Delete an element
    deleteRichTextElement(core, headingElement1.id);

    // Get the updated element from the store
    const element = getRichTextElement(headingElement1.id);

    // Should be deleted
    expect(element.deleted).toBe(true);
    // Should have a deleted at timestamp
    expect(element.deletedAt).toBeInstanceOf(Date);
  });

  it('returns the deleted element', () => {
    // Delete an element
    const element = deleteRichTextElement(core, headingElement1.id);

    // Should return deleted element
    expect(element.deleted).toBe(true);
  });

  it('dispatches a `rich-text-elements:delete` event', (done) => {
    // Listen to 'rich-text-elements:delete' events
    core.addEventListener('rich-text-elements:delete', (payload) => {
      // Get the deleted element
      const element = getRichTextElement(headingElement1.id);

      // Payload data should be the deleted element
      expect(payload.data).toEqual(element);
      done();
    });

    // Delete an element
    deleteRichTextElement(core, headingElement1.id);
  });
});
