import { ParentReferences } from '@minddrop/core';
import {
  RichTextElement,
  RichTextElements,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import { act, renderHook } from '@minddrop/test-utils';
import { Node } from 'slate';
import { setup, cleanup, core } from '../test-utils';
import { Transforms } from '../Transforms';
import { Editor } from '../types';
import { useEditorSession } from './useEditorSession';

const { richTextDocument1, paragraphElement1 } = RICH_TEXT_TEST_DATA;

/**
 * Create a new editor instance using the `useEditorSession`
 * hook.
 *
 * @returns An editor instance.
 */
function createEditorSession(): Editor {
  const { result } = renderHook(() =>
    useEditorSession(core, richTextDocument1.id),
  );

  return result.current;
}

describe('useEditorSession', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('configures the `withParentReferences` plugin', () => {
    // Create an editor
    const editor = createEditorSession();

    act(() => {
      // Add a new paragraph element
      Transforms.insertNodes(editor, {
        ...paragraphElement1,
        parents: [],
        id: 'new-paragraph',
      });
    });

    // Get the inserted element from the document
    const element = Node.get(editor, [0]) as RichTextElement;

    // The element should have the document as a parent
    expect(
      ParentReferences.contains('rich-text-document', element.parents),
    ).toBeTruthy();
  });

  it('configures the `useDebouncedUpdates` hook', () => {
    jest.useFakeTimers();

    // Create an editor
    const editor = createEditorSession();

    act(() => {
      // Add a new paragraph element
      Transforms.insertNodes(editor, {
        ...paragraphElement1,
        parents: [],
        id: 'new-paragraph',
      });
    });

    act(() => {
      // Run timers to call the debounced update function
      jest.runAllTimers();
    });

    // The element should be created as a RichTextElement,
    // getting it should not throw an error.
    expect(() => RichTextElements.get('new-paragraph')).not.toThrow();
  });
});
