import { Editor as SlateEditor, Transforms } from 'slate';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import {
  Ast,
  LinkElement,
  ParagraphElement,
  WikilinkElement,
} from '@minddrop/ast';
import {
  registerBackendUtilsAdapter,
  unregisterBackendUtilsAdapter,
} from '@minddrop/utils';
import { EditorShortcuts } from '../EditorShortcuts';
import { cleanup, createTestEditor } from '../test-utils';
import {
  listItemElement1,
  paragraphElement1,
} from '../test-utils/editor.fixtures';
import { Editor, EditorShortcutContext } from '../types';

// Runs the shortcut registered for a hotkey, as the hook does
function run(
  hotkey: string,
  editor: Editor,
  context: EditorShortcutContext = {},
): boolean {
  const shortcut = EditorShortcuts.find(
    (candidate) => candidate.hotkey === hotkey,
  );

  if (!shortcut) {
    throw new Error(`No shortcut registered for ${hotkey}`);
  }

  return shortcut.run(editor, context);
}

// The destinations opened through the backend, which opens them outside the
// app's own window
const opened: string[] = [];

registerBackendUtilsAdapter({
  getWebpageHtml: async () => '',
  openFile: async () => {},
  openUrl: async (url: string) => {
    opened.push(url);
  },
  showItemInFolder: async () => {},
});

describe('EditorShortcuts', () => {
  afterEach(() => {
    opened.length = 0;
    cleanup();
  });

  afterAll(unregisterBackendUtilsAdapter);

  describe('mod+enter', () => {
    it('follows the wikilink the cursor is within', () => {
      const onOpenWikilink = vi.fn();
      const editor = createTestEditor([
        Ast.generateElement<ParagraphElement>('paragraph', {
          children: [
            { text: '' },
            Ast.generateElement<WikilinkElement>('wikilink', {
              reference: 'Book',
              children: [{ text: 'Book' }],
            }),
            { text: '' },
          ],
        }),
      ]);

      Transforms.select(editor, SlateEditor.end(editor, [0, 1]));

      expect(run('mod+enter', editor, { onOpenWikilink })).toBe(true);
      expect(onOpenWikilink).toHaveBeenCalledWith('Book');
    });

    it('declines the keystroke when the cursor is not in a link', () => {
      const editor = createTestEditor([paragraphElement1]);

      Transforms.select(editor, SlateEditor.start(editor, [0]));

      // Declining leaves the keystroke to whatever else wants it
      expect(run('mod+enter', editor)).toBe(false);
    });

    it('is available in a read-only editor', () => {
      const shortcut = EditorShortcuts.find(
        (candidate) => candidate.hotkey === 'mod+enter',
      );

      // Following a link does not change the document
      expect(shortcut?.readOnly).toBe(true);
    });
  });

  describe('tab', () => {
    it('indents the block the cursor is in', () => {
      const editor = createTestEditor([
        listItemElement1,
        { ...paragraphElement1, ancestry: listItemElement1.ancestry },
      ]);

      Transforms.select(editor, SlateEditor.start(editor, [1]));
      run('tab', editor);

      // The second block joined a container of its own
      expect(run('shift+tab', editor)).toBe(true);
    });

    it('changes the document, so does not run in a read-only editor', () => {
      const shortcut = EditorShortcuts.find(
        (candidate) => candidate.hotkey === 'tab',
      );

      expect(shortcut?.readOnly).toBeUndefined();
    });
  });

  it('registers a link shortcut which opens a web address', () => {
    const editor = createTestEditor([
      Ast.generateElement<ParagraphElement>('paragraph', {
        children: [
          { text: '' },
          Ast.generateElement<LinkElement>('link', {
            url: 'https://minddrop.app',
            children: [{ text: 'MindDrop' }],
          }),
          { text: '' },
        ],
      }),
    ]);

    Transforms.select(editor, SlateEditor.end(editor, [0, 1]));

    expect(run('mod+enter', editor)).toBe(true);
    expect(opened).toEqual(['https://minddrop.app']);
  });
});
