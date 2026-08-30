import { Editor as SlateEditor } from 'slate';
import { afterEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@minddrop/test-utils';
import {
  cleanup,
  createTestEditorWithText,
  getWikilinks,
  keyDownEvent,
} from '../test-utils';
import { Editor, EditorReference, ReferenceSource } from '../types';
import { useWikilinkMenu } from './useWikilinkMenu';

const references: EditorReference[] = [
  { reference: 'Book', label: 'Book', description: 'Books' },
  { reference: 'Today', label: 'Today', description: 'Notes' },
  { reference: 'Reading list', label: 'Reading list', description: 'Notes' },
];

// A source offering the first two references as recent and matching the
// third by its label
const source: ReferenceSource = {
  getRecent: () => references.slice(0, 2),
  search: (query) =>
    references.filter((reference) => reference.label.includes(query)),
};

/**
 * Renders the hook over an editor holding an opening bracket and types the
 * second one, completing the trigger.
 *
 * @param editor The editor, holding a trailing opening bracket.
 * @returns The render result.
 */
function openMenu(editor: Editor) {
  const rendered = renderHook(() => useWikilinkMenu(editor, source));

  // The second bracket's keydown arms the menu before the character lands
  act(() => {
    rendered.result.current.handleKeyDown(keyDownEvent('['));
  });

  // The bracket is then typed as usual, completing the trigger
  act(() => {
    editor.insertText('[');
  });

  act(() => {
    rendered.result.current.handleChange();
  });

  return rendered;
}

describe('useWikilinkMenu', () => {
  afterEach(cleanup);

  it('opens when the trigger is completed', () => {
    const editor = createTestEditorWithText('[');
    const { result } = openMenu(editor);

    // Nothing has been typed, so the recent references are offered
    expect(result.current.referenceMenuProps.open).toBe(true);
    expect(result.current.referenceMenuProps.showHint).toBe(true);
    expect(result.current.referenceMenuProps.references).toEqual(
      references.slice(0, 2),
    );
  });

  it('does not open without the first bracket', () => {
    const editor = createTestEditorWithText('a');
    const { result } = renderHook(() => useWikilinkMenu(editor, source));

    act(() => {
      result.current.handleKeyDown(keyDownEvent('['));
    });

    act(() => {
      editor.insertText('[');
    });

    act(() => {
      result.current.handleChange();
    });

    expect(result.current.referenceMenuProps.open).toBe(false);
  });

  it('filters the references by the typed query', () => {
    const editor = createTestEditorWithText('[');
    const { result } = openMenu(editor);

    act(() => {
      editor.insertText('Read');
    });

    act(() => {
      result.current.handleChange();
    });

    expect(result.current.referenceMenuProps.showHint).toBe(false);
    expect(result.current.referenceMenuProps.references).toEqual([
      references[2],
    ]);
  });

  it('links the chosen reference in place of the trigger and query', () => {
    const editor = createTestEditorWithText('[');
    const { result } = openMenu(editor);

    act(() => {
      editor.insertText('Read');
    });

    act(() => {
      result.current.handleChange();
    });

    act(() => {
      result.current.handleKeyDown(keyDownEvent('Enter'));
    });

    // The trigger and query are gone, replaced by the link
    expect(getWikilinks(editor)).toMatchObject([
      { reference: 'Reading list', children: [{ text: 'Reading list' }] },
    ]);
    expect(SlateEditor.string(editor, [0])).toBe('Reading list');
  });

  it('moves the highlight with the arrow keys', () => {
    const editor = createTestEditorWithText('[');
    const { result } = openMenu(editor);

    act(() => {
      result.current.handleKeyDown(keyDownEvent('ArrowDown'));
    });

    expect(result.current.referenceMenuProps.activeIndex).toBe(1);

    // The highlight wraps around the end of the list
    act(() => {
      result.current.handleKeyDown(keyDownEvent('ArrowDown'));
    });

    expect(result.current.referenceMenuProps.activeIndex).toBe(0);
  });

  it('closes on Escape, leaving the typed text in place', () => {
    const editor = createTestEditorWithText('[');
    const { result } = openMenu(editor);

    act(() => {
      result.current.handleKeyDown(keyDownEvent('Escape'));
    });

    expect(result.current.referenceMenuProps.open).toBe(false);
    expect(SlateEditor.string(editor, [0])).toBe('[[');
  });

  it('closes when the trigger is backspaced over', () => {
    const editor = createTestEditorWithText('[');
    const { result } = openMenu(editor);

    // Remove the second bracket, breaking the trigger
    act(() => {
      editor.deleteBackward('character');
    });

    act(() => {
      result.current.handleChange();
    });

    expect(result.current.referenceMenuProps.open).toBe(false);
  });
});
