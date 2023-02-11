import {
  RichTextElements,
  RTElement,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup, core } from '../test-utils';
import { Transforms } from '../Transforms';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { useEditorSession } from './useEditorSession';

const { richTextDocument1, headingElement1, paragraphElement1 } =
  RICH_TEXT_TEST_DATA;

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

  it('configures the `withRichTextElementsApi` plugin', () => {
    // Run the hook
    const { result } = renderHook(() => useEditorSession(richTextDocument1.id));

    // Get the editor and session ID
    const [editor] = result.current;

    // Insert an element into the document
    Transforms.insertNodes(editor, paragraphElement1, { at: [0] });

    // Get the inserted element from the
    const newElement = editor.children[0] as RTElement;

    // Should create the element
    expect(RichTextElements.get(newElement.id)).toBeDefined();
  });

  it('configures block shortcuts', () => {
    RichTextElements.register(core, {
      type: 'todo',
      level: 'block',
      shortcuts: ['[]'],
      component: jest.fn(),
    });

    // Run the hook
    const { result } = renderHook(() => useEditorSession(richTextDocument1.id));

    // Get the editor from the hook
    const [editor] = result.current;

    // Add the child rich text elements to the editor
    Transforms.resetNodes(editor, {
      nodes: [headingElement1, paragraphElement1],
    });

    // Insert the shortcut text for a 'todo' element
    Transforms.insertText(editor, '[]', { at: [0, 0] });

    // Should convert the element to a 'todo' element
    expect(editor.children[0]).toMatchObject({ type: 'todo' });
  });
});
