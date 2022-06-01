import {
  RTDocuments,
  RTElements,
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

  it('resets the editor value if it has changed externally', () => {
    // Create an editor session
    const [editor, sessionId] = createEditorSession();

    // Run the hook for the editor session
    renderHook(() =>
      useExternalUpdates(editor, richTextDocument1.id, sessionId),
    );

    act(() => {
      // Modify the value of the document as well a its revision
      RTDocuments.setChildren(
        core,
        richTextDocument1.id,
        [paragraphElement2.id],
        generateId(),
      );
    });

    // Get the inserted udpated version of the inserted element
    const element = RTElements.get(paragraphElement2.id);

    // Editor children should be reset to the updated value
    expect(editor.children).toEqual([element]);
  });

  it('does not reset if the value has changed within the editor', () => {
    // Create an editor session
    const [editor, sessionId] = createEditorSession();

    // Run the hook for the editor session
    renderHook(() =>
      useExternalUpdates(editor, richTextDocument1.id, sessionId),
    );

    // Create a revision ID
    const revision = generateId();

    // Add the revision ID to the session's `documentRevisions`
    // simulating that the document update was caused by an edit
    // within the editor.
    useRichTextEditorStore.getState().addDocumentRevision(sessionId, revision);

    act(() => {
      // Modify the value of the document as well a its revision,
      // using the revision ID from above.
      RTDocuments.setChildren(
        core,
        richTextDocument1.id,
        [paragraphElement2.id],
        revision,
      );
    });

    // Editor children should not be reset (initial value was empty)
    expect(editor.children).toEqual([]);
  });

  it('resets the session changes', () => {
    // Create an editor session
    const [editor, sessionId] = createEditorSession();

    // Run the hook for the editor session
    renderHook(() =>
      useExternalUpdates(editor, richTextDocument1.id, sessionId),
    );

    act(() => {
      // Modify the value of the document as well a its revision
      RTDocuments.setChildren(
        core,
        richTextDocument1.id,
        [paragraphElement2.id],
        generateId(),
      );
    });

    // Get the editor session data
    const session = useRichTextEditorStore.getState().sessions[sessionId];

    // Session should not contain any changes
    expect(session.createdElements).toEqual({});
    expect(session.creationOrder).toEqual([]);
    expect(session.updatedElements).toEqual({});
    expect(session.deletedElements).toEqual([]);
    expect(session.documentChildren).toEqual([]);
  });
});
