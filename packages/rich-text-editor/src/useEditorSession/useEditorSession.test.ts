import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { Transforms } from '../Transforms';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { useEditorSession } from './useEditorSession';

const { richTextDocument1, paragraphElement1 } = RICH_TEXT_TEST_DATA;

describe('useEditorSession', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates an editor session with the document revision', () => {
    // Run the hook
    const { result } = renderHook(() => useEditorSession(richTextDocument1.id));

    // Get the session ID
    const sessionId = result.current[1];

    // Rich text editor store should contain the session
    expect(useRichTextEditorStore.getState().sessions[sessionId]).toBeDefined();
    // Session should contain the current document revision
    expect(
      useRichTextEditorStore.getState().sessions[sessionId].documentRevisions,
    ).toContain(richTextDocument1.revision);
  });

  it('configures the `withRichTextEditorStore` plugin', () => {
    // Run the hook
    const { result } = renderHook(() => useEditorSession(richTextDocument1.id));

    // Get the editor and session ID
    const [editor, sessionId] = result.current;

    // Insert an element into the document
    Transforms.insertNodes(editor, paragraphElement1, { at: [0] });

    // Rich text editor store session should contain
    // the created element.
    expect(
      useRichTextEditorStore.getState().sessions[sessionId].createdElements[
        paragraphElement1.id
      ],
    ).toBeDefined();
  });
});
