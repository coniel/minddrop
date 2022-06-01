import { act, renderHook } from '@minddrop/test-utils';
import {
  RTBlockElement,
  RTDocuments,
  RTElements,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import { setup, cleanup, createTestEditor, core } from '../test-utils';
import { Transforms } from '../Transforms';
import { useRichTextEditorStore } from '../useRichTextEditorStore';
import { withRichTextEditorStore } from '../withRichTextEditorStore';
import { useDebouncedUpdates } from './useDebouncedUpdates';
import { Editor } from '../types';

const {
  paragraphElement1,
  paragraphElement2,
  paragraphElement3,
  paragraphElement4,
  linkElement1,
  richTextDocument1,
} = RICH_TEXT_TEST_DATA;

// The editor session ID
const sessionId = 'session-id';

const createEditor = (
  content: RTBlockElement[],
  documentId?: string,
): [Editor, string] => {
  // Create a new rich text document
  const document = RTDocuments.create(core, {
    children: content.map((element) => element.id),
  });

  // Create an editor session
  useRichTextEditorStore.getState().addSession(sessionId);

  // Create an editor with the plugin applied, using the session
  // created above, retuning the editor and document ID.
  return [
    withRichTextEditorStore(createTestEditor(content), sessionId),
    documentId || document.id,
  ];
};

describe('withDebouncedUpdates', () => {
  jest.useFakeTimers();

  beforeEach(() => {
    setup();
  });

  afterEach(cleanup);

  it('clears the store when running the update', () => {
    // Create an editor containing a paragraph element
    const [editor, documentId] = createEditor([paragraphElement1]);

    // Render the hook to simulate it being used in the editor component.
    renderHook(() => useDebouncedUpdates(documentId, sessionId));

    act(() => {
      // Insert a second paragraph element
      Transforms.insertNodes(editor, paragraphElement2, { at: [1] });
    });

    // Store should contain the created element
    expect(
      useRichTextEditorStore.getState().sessions['session-id'].createdElements[
        paragraphElement2.id
      ],
    ).toBeDefined();

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Store should no longer contain the created element
    expect(
      useRichTextEditorStore.getState().sessions['session-id'].createdElements[
        paragraphElement2.id
      ],
    ).toBeUndefined();
  });

  it('creates elements in sequence', () => {
    // Spy on the RTElements.create method to determine
    // the order in which the inserted elements will be created.
    jest.spyOn(RTElements, 'create');

    // Create an editor containing a paragraph element
    const [editor, documentId] = createEditor([paragraphElement1]);

    // Render the hook to simulate it being used in the editor component
    renderHook(() => useDebouncedUpdates(documentId, sessionId));

    const paragraph2 = { ...paragraphElement2, id: 'paragraph-2' };
    const paragraph3 = { ...paragraphElement3, id: 'paragraph-3' };
    const paragraph4 = { ...paragraphElement4, id: 'paragraph-4' };

    act(() => {
      // Insert three new paragraph elements in sequence
      Transforms.insertNodes(editor, paragraph2, { at: [1] });
      Transforms.insertNodes(editor, paragraph3, { at: [2] });
      Transforms.insertNodes(editor, paragraph4, { at: [3] });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Should have created 3 elements
    expect(RTElements.create).toHaveBeenCalledTimes(3);
    // Should create the elements in the order in which they were inserted
    // @ts-ignore
    expect(RTElements.create.mock.calls[0][1]).toEqual(paragraph2);
    // @ts-ignore
    expect(RTElements.create.mock.calls[1][1]).toEqual(paragraph3);
    // @ts-ignore
    expect(RTElements.create.mock.calls[2][1]).toEqual(paragraph4);
  });

  it('updates elements', () => {
    // Create an editor containing an empty paragraph element
    const [editor, documentId] = createEditor([
      { ...paragraphElement1, children: [{ text: '' }] },
    ]);

    // Render the hook to simulate it being used in the editor component
    renderHook(() => useDebouncedUpdates(documentId, sessionId));

    act(() => {
      // Add text to the paragraph
      Transforms.insertText(editor, 'Hello world', { at: [0, 0] });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Get the updated element
    const element = RTElements.get(paragraphElement1.id);

    // Element should contain the updated text
    expect(element.children).toEqual([{ text: 'Hello world' }]);
  });

  it('deletes elements', () => {
    // Create an editor containing two paragraph elements
    const [editor, documentId] = createEditor([
      paragraphElement1,
      paragraphElement2,
    ]);

    // Render the hook to simulate it being used in the editor component
    renderHook(() => useDebouncedUpdates(documentId, sessionId));

    act(() => {
      // Remove the second paragraph
      Transforms.removeNodes(editor, { at: [1] });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Get the deleted element
    const element = RTElements.get(paragraphElement2.id);

    // Element should be deleted
    expect(element.deleted).toBe(true);
  });

  it('sets document children', () => {
    // Create an editor containing a paragraph element
    const [editor, documentId] = createEditor([paragraphElement1]);

    // Render the hook to simulate it being used in the editor component
    renderHook(() => useDebouncedUpdates(documentId, sessionId));

    act(() => {
      // Insert a second paragraph element
      Transforms.insertNodes(editor, paragraphElement2, { at: [1] });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Get the updated document
    const document = RTDocuments.get(documentId);

    // Document children should be updated
    expect(document.children).toEqual([
      paragraphElement1.id,
      paragraphElement2.id,
    ]);
  });

  it('does not set document children if empty', () => {
    // Spy on RTDocuments.setChildren to check if it was called
    jest.spyOn(RTDocuments, 'setChildren');

    // Create an editor containing an empty paragraph element
    const [editor, documentId] = createEditor([
      { ...paragraphElement1, children: [{ text: '' }] },
    ]);

    // Render the hook to simulate it being used in the editor component
    renderHook(() => useDebouncedUpdates(documentId, sessionId));

    act(() => {
      // Add text to the paragraph, causing an update which does not
      // affect document children.
      Transforms.insertText(editor, 'Hello world', { at: [0, 0] });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Should not set document children
    expect(RTDocuments.setChildren).not.toHaveBeenCalled();
  });

  it('changes the document revision if a non root level element was created', () => {
    // Create an editor containing a paragraph element
    const [editor] = createEditor([paragraphElement1], richTextDocument1.id);

    // Render the hook to simulate it being used in the editor component
    renderHook(() => useDebouncedUpdates(richTextDocument1.id, sessionId));

    act(() => {
      // Insert a link element into the paragrpah element
      Transforms.insertNodes(editor, linkElement1, { at: [0, 0] });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Get the updated document
    const document = RTDocuments.get(richTextDocument1.id);

    // Document revision should be different
    expect(document.revision).not.toBe(richTextDocument1.revision);
    // New document revision should be in the session's `documentRevisions`
    expect(
      useRichTextEditorStore.getState().sessions[sessionId].documentRevisions,
    ).toContain(document.revision);
  });

  it('changes the revision if a non root level element was deleted', () => {
    // Create an editor containing a paragraph element with a link
    // element as a child.
    const [editor] = createEditor([
      {
        ...paragraphElement1,
        children: [{ text: '' }, linkElement1, { text: '' }],
      },
    ]);

    // Render the hook to simulate it being used in the editor component
    renderHook(() => useDebouncedUpdates(richTextDocument1.id, sessionId));

    act(() => {
      // Remove the link element
      Transforms.removeNodes(editor, { at: [0, 1] });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Get the updated document
    const document = RTDocuments.get(richTextDocument1.id);

    // Document revision should be different
    expect(document.revision).not.toBe(richTextDocument1.revision);
  });

  it('changes the revision if a element is updated', () => {
    // Create an editor containing an empty paragraph element
    const [editor] = createEditor([
      {
        ...paragraphElement1,
        children: [{ text: '' }],
      },
    ]);

    // Render the hook to simulate it being used in the editor component
    renderHook(() => useDebouncedUpdates(richTextDocument1.id, sessionId));

    act(() => {
      // Add text to the paragraph
      Transforms.insertText(editor, 'Hello world', { at: [0, 0] });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Get the updated document
    const document = RTDocuments.get(richTextDocument1.id);

    // Document revision should be different
    expect(document.revision).not.toBe(richTextDocument1.revision);
  });

  it('uses the `setChildren` method to change the document revision if children have changed', () => {
    // Spy on the `RTDocuments.setRevision` method to make sure
    // that it is used to set the new revision.
    jest.spyOn(RTDocuments, 'setRevision');

    // Create an editor containing a paragraph element
    const [editor] = createEditor([paragraphElement1], richTextDocument1.id);

    // Render the hook to simulate it being used in the editor component
    renderHook(() => useDebouncedUpdates(richTextDocument1.id, sessionId));

    act(() => {
      // Insert a second paragraph element
      Transforms.insertNodes(editor, paragraphElement2, { at: [1] });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // Get the updated document
    const document = RTDocuments.get(richTextDocument1.id);

    // Document revision should be different
    expect(document.revision).not.toBe(richTextDocument1.revision);
    // New document revision should be in the session's `documentRevisions`
    expect(
      useRichTextEditorStore.getState().sessions[sessionId].documentRevisions,
    ).toContain(document.revision);
    // Should not call `RTDocuments.setRevision`
    expect(RTDocuments.setRevision).not.toHaveBeenCalled();
  });
});
