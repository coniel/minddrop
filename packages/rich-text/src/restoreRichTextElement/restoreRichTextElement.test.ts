import { setup, cleanup, core, headingElement1 } from '../test-utils';
import { deleteRichTextElement } from '../deleteRichTextElement';
import { restoreRichTextElement } from './restoreRichTextElement';
import { getRichTextElement } from '../getRichTextElement';

describe('restoreRichTextElement', () => {
  beforeEach(() => {
    setup();

    // Delete an element
    deleteRichTextElement(core, headingElement1.id);
  });

  afterEach(cleanup);

  it('removes deleted and deletedAt properties', () => {
    // Restore an element
    restoreRichTextElement(core, headingElement1.id);

    // Get the restored element from the store
    const element = getRichTextElement(headingElement1.id);

    // Should not contain `deleted` property
    expect(element.deleted).toBeUndefined();
    // Should not contain `deletedAt` property
    expect(element.deletedAt).toBeUndefined();
  });

  it('returns the restored element', () => {
    // Restore an element
    const element = restoreRichTextElement(core, headingElement1.id);

    // Returned element should not be deleted
    expect(element.deleted).toBeUndefined();
  });

  it('dispatches a `rich-text-elements:restore` event', (done) => {
    // Listen to 'rich-text-elements:restore' events
    core.addEventListener('rich-text-elements:restore', (payload) => {
      // Get the restored element
      const element = getRichTextElement(headingElement1.id);

      // Payload data should be the restored element
      expect(payload.data).toEqual(element);
      done();
    });

    // Restore an element
    restoreRichTextElement(core, headingElement1.id);
  });
});
