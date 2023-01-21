import {
  RichTextDocuments,
  RichTextElements,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import { act, renderHook } from '@minddrop/test-utils';
import { generateId } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { useEditorSession } from '../useEditorSession';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { useExternalUpdates } from './useExternalUpdates';

const { richTextDocument1, paragraphElement2 } = RICH_TEXT_TEST_DATA;

function createEditorSession() {
  const { result } = renderHook(() => useEditorSession(richTextDocument1.id));

  return result.current;
}

describe('useExternalUpdates', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('external update', () => {
    it('resets the editor value', () => {
      // Create an editor session
      const [editor, sessionId] = createEditorSession();

      // Run the hook for the editor session
      renderHook(() => useExternalUpdates(editor, sessionId));

      act(() => {
        // Modify the value of the document as well a its revision
        RichTextDocuments.update(core, richTextDocument1.id, {
          children: [paragraphElement2.id],
        });
      });

      // Get the updated paragraph inserted element
      const insertedParagraph = RichTextElements.get(paragraphElement2.id);

      // Editor children should be reset to the updated value
      expect(editor.children).toEqual([insertedParagraph]);
    });

    it('does not trigger updates', () => {
      // Create an editor session
      const [editor, sessionId] = createEditorSession();

      // Run the hook for the editor session
      renderHook(() => useExternalUpdates(editor, sessionId));

      act(() => {
        // Modify the value of the document as well a its revision
        RichTextDocuments.update(core, richTextDocument1.id, {
          children: [paragraphElement2.id],
          revision: 'original-revision',
        });
      });

      // Get the updated document
      const document = RichTextDocuments.get(richTextDocument1.id);

      // Document should still have the revision set above
      expect(document.revision).toEqual('original-revision');
    });

    it('resumes editor session updates', () => {
      // Create an editor session
      const [editor, sessionId] = createEditorSession();

      // Run the hook for the editor session
      renderHook(() => useExternalUpdates(editor, sessionId));

      act(() => {
        // Modify the value of the document as well a its revision
        RichTextDocuments.update(core, richTextDocument1.id, {
          children: [paragraphElement2.id],
        });
      });

      // Editor session updates should not be paused
      expect(
        useRichTextEditorStore.getState().sessions[sessionId].pauseUpdates,
      ).toBeFalsy();
    });
  });

  it('does not reset if the value has changed within the editor', () => {
    // Create an editor session
    const [editor, sessionId] = createEditorSession();

    // Run the hook for the editor session
    renderHook(() => useExternalUpdates(editor, sessionId));

    // Create a revision ID
    const revision = generateId();

    // Add the revision ID to the session's `documentRevisions`
    // simulating that the document update was caused by an edit
    // within the editor.
    useRichTextEditorStore.getState().addDocumentRevision(sessionId, revision);

    act(() => {
      // Modify the value of the document as well a its revision,
      // using the revision ID from above.
      RichTextDocuments.update(core, richTextDocument1.id, {
        children: [paragraphElement2.id],
        revision,
      });
    });

    // Editor children should not be reset (initial value was empty)
    expect(editor.children).toEqual([]);
  });
});
