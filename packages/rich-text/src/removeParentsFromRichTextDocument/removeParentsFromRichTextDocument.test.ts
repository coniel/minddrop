import { addParentsToRichTextDocument } from '../addParentsToRichTextDocument';
import { getRichTextDocument } from '../getRichTextDocument';
import { setup, cleanup, core, richTextDocument1 } from '../test-utils';
import { removeParentsFromRichTextDocument } from './removeParentsFromRichTextDocument';

// The test parent reference to remove
const parentReference = {
  type: 'drop',
  id: 'drop-id',
};

describe('removeParentFromRichTextDocument', () => {
  beforeEach(() => {
    setup();

    // Add test parent to an document
    addParentsToRichTextDocument(core, richTextDocument1.id, [parentReference]);
  });

  afterEach(cleanup);

  it('removes the parent references from the document', () => {
    // Remove parent from an document
    removeParentsFromRichTextDocument(core, richTextDocument1.id, [
      parentReference,
    ]);

    // Get the document
    const document = getRichTextDocument(richTextDocument1.id);

    // Document should no longer have the parent
    expect(document.parents).not.toContainEqual(parentReference);
  });

  it('returns the updated document', () => {
    // Remove parent from an document
    const result = removeParentsFromRichTextDocument(
      core,
      richTextDocument1.id,
      [parentReference],
    );

    // Get the document from the store
    const document = getRichTextDocument(richTextDocument1.id);

    // Returned value should match updated document
    expect(result).toEqual(document);
  });

  it('dispatches a `rich-text-documents:remove-parents` event', (done) => {
    // Listen to 'rich-text-documents:remove-parents' events
    core.addEventListener('rich-text-documents:remove-parents', (payload) => {
      // Get the updated document
      const document = getRichTextDocument(richTextDocument1.id);

      // Payload data should contain the updated document
      expect(payload.data.document).toEqual(document);
      // Payload data should contain the removed parents
      expect(payload.data.parents).toEqual([parentReference]);
      done();
    });

    // Remove parent from an document
    removeParentsFromRichTextDocument(core, richTextDocument1.id, [
      parentReference,
    ]);
  });
});
