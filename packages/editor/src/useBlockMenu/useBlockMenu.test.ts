import { Editor as SlateEditor, Transforms } from 'slate';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { initializeI18n } from '@minddrop/i18n';
import { act, renderHook } from '@minddrop/test-utils';
import {
  cleanup,
  createTestEditor,
  emptyParagraphElement,
  keyDownEvent,
  paragraphElement1,
} from '../test-utils';
import { Editor } from '../types';
import { useBlockMenu } from './useBlockMenu';

/**
 * Renders the hook over an editor holding an empty block and types the
 * trigger character, opening the menu.
 *
 * @returns The editor and the render result.
 */
function openMenu() {
  const editor = createTestEditor([emptyParagraphElement]);

  Transforms.select(editor, SlateEditor.start(editor, [0]));

  const rendered = renderHook(() => useBlockMenu(editor));

  // The trigger's keydown arms the menu before the character lands
  act(() => {
    rendered.result.current.handleKeyDown(keyDownEvent('/'));
  });

  // The character is then typed as usual
  act(() => {
    editor.insertText('/');
  });

  act(() => {
    rendered.result.current.handleChange();
  });

  return { editor, ...rendered };
}

// Types a query after the trigger and syncs the menu with it
function typeQuery(
  editor: Editor,
  result: { current: ReturnType<typeof useBlockMenu> },
  query: string,
): void {
  act(() => {
    editor.insertText(query);
  });

  act(() => {
    result.current.handleChange();
  });
}

describe('useBlockMenu', () => {
  // Entries are filtered against their translated labels
  beforeAll(() => initializeI18n());

  afterEach(cleanup);

  it('opens when the trigger character is typed', () => {
    const { result } = openMenu();

    // Nothing has been typed after the trigger, so the hint is shown
    expect(result.current.blockMenuProps.open).toBe(true);
    expect(result.current.blockMenuProps.showHint).toBe(true);
    expect(result.current.blockMenuProps.menuItems.length).toBeGreaterThan(0);
  });

  it('does not open within a word', () => {
    const editor = createTestEditor([paragraphElement1]);
    const { result } = renderHook(() => useBlockMenu(editor));

    // The cursor sits directly after a character
    Transforms.select(editor, SlateEditor.end(editor, [0]));

    act(() => {
      result.current.handleKeyDown(keyDownEvent('/'));
    });

    act(() => {
      editor.insertText('/');
    });

    act(() => {
      result.current.handleChange();
    });

    expect(result.current.blockMenuProps.open).toBe(false);
  });

  it('filters the entries by the typed query', () => {
    const { editor, result } = openMenu();

    typeQuery(editor, result, 'heading');

    // Only the heading entries match the query
    expect(result.current.blockMenuProps.showHint).toBe(false);
    expect(
      result.current.blockMenuProps.menuItems.every(
        (menuItem) => menuItem.type === 'heading',
      ),
    ).toBe(true);
  });

  it('hides the menu while the query matches nothing', () => {
    const { editor, result } = openMenu();

    typeQuery(editor, result, 'nomatch');

    expect(result.current.blockMenuProps.open).toBe(false);

    // Correcting the query brings the menu back without retyping the trigger
    act(() => {
      editor.deleteBackward('word');
    });

    act(() => {
      result.current.handleChange();
    });

    expect(result.current.blockMenuProps.open).toBe(true);
  });

  it('inserts the highlighted entry on Enter', () => {
    const { editor, result } = openMenu();

    typeQuery(editor, result, 'h3');

    act(() => {
      result.current.handleKeyDown(keyDownEvent('Enter'));
    });

    // The trigger and query are replaced by the entry's block
    expect(editor.children[0]).toMatchObject({ type: 'heading', level: 3 });
    expect(SlateEditor.string(editor, [0])).toBe('');
  });

  it('moves the highlight with the arrow keys', () => {
    const { result } = openMenu();

    act(() => {
      result.current.handleKeyDown(keyDownEvent('ArrowDown'));
    });

    expect(result.current.blockMenuProps.activeIndex).toBe(1);

    act(() => {
      result.current.handleKeyDown(keyDownEvent('ArrowUp'));
    });

    expect(result.current.blockMenuProps.activeIndex).toBe(0);
  });

  it('restarts the highlight when the query changes', () => {
    const { editor, result } = openMenu();

    act(() => {
      result.current.handleKeyDown(keyDownEvent('ArrowDown'));
    });

    typeQuery(editor, result, 'h');

    expect(result.current.blockMenuProps.activeIndex).toBe(0);
  });

  it('closes on Escape, leaving the typed text in place', () => {
    const { editor, result } = openMenu();

    act(() => {
      result.current.handleKeyDown(keyDownEvent('Escape'));
    });

    expect(result.current.blockMenuProps.open).toBe(false);
    expect(SlateEditor.string(editor, [0])).toBe('/');
  });

  it('closes when the trigger character is backspaced over', () => {
    const { editor, result } = openMenu();

    act(() => {
      editor.deleteBackward('character');
    });

    act(() => {
      result.current.handleChange();
    });

    expect(result.current.blockMenuProps.open).toBe(false);
  });

  it('inserts an entry chosen with the pointer', () => {
    const { editor, result } = openMenu();

    // The index of a known entry within the listed items
    const index = result.current.blockMenuProps.menuItems.findIndex(
      (menuItem) => menuItem.label === 'editor.elements.heading-2.name',
    );

    act(() => {
      result.current.blockMenuProps.onSelect(index);
    });

    expect(editor.children[0]).toMatchObject({ type: 'heading', level: 2 });
  });
});
