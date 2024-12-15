import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest';
import { Ast, Element } from '@minddrop/ast';
import { setup, cleanup, createTestEditor } from '../test-utils';
import { withInlineShortcuts } from './withInlineShortcuts';
import { InlineShortcut } from '../types';
import { Transforms } from 'slate';
import { emptyParagraphElement, linkElement1 } from '../test-utils/editor.data';

const createEditor = (
  shortcuts: InlineShortcut[],
  content: Element[] = [
    { ...emptyParagraphElement, children: [{ text: 'Hello world ' }] },
  ],
) => withInlineShortcuts(createTestEditor(content), shortcuts);

describe('withInlineShortcuts', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('inserts the text if not a shortcut', () => {
    // Create an editor with a shortcut applied
    const editor = createEditor([{ triggers: ['*'], action: vi.fn() }]);

    // Insert a charater into the editor
    Transforms.insertText(editor, 'a', { at: [0, 0] });

    // It should insert the character
    expect(editor.children[0]).toMatchObject({ children: [{ text: 'a' }] });
  });

  describe('string shortcut', () => {
    it('handles single character shortcut', () => {
      // Create a shortcut which fires immedeatly upon
      // '*' being typed.
      const shortcut: InlineShortcut = {
        triggers: ['*'],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied
      const editor = createEditor([shortcut]);

      // Insert the shortcut trigger into the editor
      editor.insertText('*');

      // Should fire the shortcut action
      expect(shortcut.action).toHaveBeenCalledWith(editor);
    });

    it('handles multi character shortcut', () => {
      // Create a shortcut which fires immedeatly upon
      // '**' being typed.
      const shortcut: InlineShortcut = {
        triggers: ['**'],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing
      // the first character of the shortcut.
      const editor = createEditor(
        [shortcut],
        [{ ...emptyParagraphElement, children: [{ text: '*' }] }],
      );

      // Insert the second shortcut trigger character into the editor
      editor.insertText('*');

      // Should fire the shortcut action
      expect(shortcut.action).toHaveBeenCalledWith(editor);
    });

    it('prioritizes longer shortcut triggers', () => {
      // Shortcut which fires immedeatly upon '*' being typed
      const singleShortcut: InlineShortcut = {
        triggers: ['*'],
        action: vi.fn(),
      };
      // Shortcut which fires immedeatly upon '~*' being typed.
      const doubleShortcut: InlineShortcut = {
        triggers: ['~*'],
        action: vi.fn(),
      };

      // Create an editor with the shortcuts applied containing
      // the first character of the double shortcut.
      const editor = createEditor(
        [singleShortcut, doubleShortcut],
        [{ ...emptyParagraphElement, children: [{ text: '~' }] }],
      );

      // Insert '*' (trigger character of both shortcuts) into
      // the editor.
      editor.insertText('*');

      // Should fire the double shortcut action
      expect(doubleShortcut.action).toHaveBeenCalledWith(editor);
    });

    it('works when shortcut is inserted in between existing text', () => {
      // Create a shortcut which fires immedeatly upon
      // '**' being typed.
      const shortcut: InlineShortcut = {
        triggers: ['**'],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing the
      // first character of the shortcut placed in between text.
      const editor = createEditor(
        [shortcut],
        [{ ...emptyParagraphElement, children: [{ text: 'hello * world' }] }],
      );

      // Move the carret to just after the '*' character
      Transforms.setSelection(editor, { focus: { path: [0, 0], offset: 7 } });
      // Insert the second shortcut trigger character into the editor
      editor.insertText('*');

      // Should fire the shortcut action
      expect(shortcut.action).toHaveBeenCalledWith(editor);
    });

    it('removes the start of the shortcut string while maintaining the focus point', () => {
      // Create a shortcut which fires immedeatly upon
      // '**' being typed.
      const shortcut: InlineShortcut = {
        triggers: ['**'],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing the
      // first character of the shortcut placed in between text.
      const editor = createEditor(
        [shortcut],
        [{ ...emptyParagraphElement, children: [{ text: 'hello * world' }] }],
      );

      // Move the carret to just after the '*' character
      Transforms.setSelection(editor, { focus: { path: [0, 0], offset: 7 } });
      // Insert the second shortcut trigger character into the editor
      editor.insertText('*');

      // Should remove the shortcut string
      expect(editor.children[0]).toMatchObject({
        children: [{ text: 'hello  world' }],
      });

      // Insert some text
      editor.insertText('new');

      // Should insert text at shortcut location
      expect(editor.children[0]).toMatchObject({
        children: [{ text: 'hello new world' }],
      });
    });
  });

  describe('start/end shortcut', () => {
    it('does not fire witout shortcut start trigger', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '*' characters.
      const shortcut: InlineShortcut = {
        triggers: [{ start: '*', end: '*' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing
      // text but without the shortcut start trigger.
      const editor = createEditor(
        [shortcut],
        [{ ...emptyParagraphElement, children: [{ text: 'hello world' }] }],
      );

      // Insert the shortcut end trigger into the editor
      editor.insertText('*');

      // Should not fire the shortcut action
      expect(shortcut.action).not.toHaveBeenCalled();
    });

    it('does not fire witout wrapped text', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '**' characters.
      const shortcut: InlineShortcut = {
        triggers: [{ start: '**', end: '**' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied in which
      // the shortcut will not wrap any text.
      const editor = createEditor(
        [shortcut],
        [{ ...emptyParagraphElement, children: [{ text: 'hello world***' }] }],
      );

      // Insert the shortcut end trigger into the editor
      editor.insertText('*');

      // Should not fire the shortcut action
      expect(shortcut.action).not.toHaveBeenCalled();
    });

    it('handles single character shortcut', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '*' characters.
      const shortcut: InlineShortcut = {
        triggers: [{ start: '*', end: '*' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing
      // text prefixed by the start trigger.
      const editor = createEditor(
        [shortcut],
        [{ ...emptyParagraphElement, children: [{ text: '*hello world' }] }],
      );

      // Insert the shortcut end trigger into the editor
      editor.insertText('*');

      // Should fire the shortcut action
      expect(shortcut.action).toHaveBeenCalledWith(editor);
    });

    it('handles multi character shortcut', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '**' characters.
      const shortcut: InlineShortcut = {
        triggers: [{ start: '**', end: '**' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing
      // text prefixed by the start trigger and followed by the
      // first half of the end trigger.
      const editor = createEditor(
        [shortcut],
        [{ ...emptyParagraphElement, children: [{ text: '**hello world*' }] }],
      );

      // Insert the second shortcut end trigger character into the editor
      editor.insertText('*');

      // Should fire the shortcut action
      expect(shortcut.action).toHaveBeenCalledWith(editor);
    });

    it('supports triggers which are a partial match of other triggers', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '*' characters.
      const singleShortcut: InlineShortcut = {
        triggers: [{ start: '*', end: '*' }],
        action: vi.fn(),
      };
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '**' characters.
      const doubleShortcut: InlineShortcut = {
        triggers: [{ start: '**', end: '**' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing text
      // prefixed by the start trigger of the short shortcut.
      const editor = createEditor(
        [singleShortcut, doubleShortcut],
        [{ ...emptyParagraphElement, children: [{ text: '*hello world' }] }],
      );

      // Insert '*' (end trigger character)
      editor.insertText('*');

      // Should not fire the double shortcut action
      expect(doubleShortcut.action).not.toHaveBeenCalled();
      // Should fire the single shortcut action
      expect(singleShortcut.action).toHaveBeenCalledWith(editor);
    });

    it('prioritizes longer shortcut triggers', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '*' characters.
      const singleShortcut: InlineShortcut = {
        triggers: [{ start: '*', end: '*' }],
        action: vi.fn(),
      };
      // Create a shortcut which fires upon a piece of text
      // being wrapped between '*' and '**'.
      const mixedShortcut: InlineShortcut = {
        triggers: [{ start: '*', end: '**' }],
        action: vi.fn(),
      };
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '**' characters.
      const doubleShortcut: InlineShortcut = {
        triggers: [{ start: '**', end: '**' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing text
      // prefixed by the start trigger of the long shortcut.
      const editor = createEditor(
        [singleShortcut, mixedShortcut, doubleShortcut],
        [{ ...emptyParagraphElement, children: [{ text: '**hello world' }] }],
      );

      // Insert '*' twice (trigger character of both shortcuts)
      // into the editor.
      editor.insertText('*');
      editor.insertText('*');

      // Should not fire the single shortcut action
      expect(singleShortcut.action).not.toHaveBeenCalled();
      // Should not fire the mixed shortcut action
      expect(mixedShortcut.action).not.toHaveBeenCalled();
      // Should fire the double shortcut action
      expect(doubleShortcut.action).toHaveBeenCalledWith(editor);
    });

    it('prioritizes start/end shortcuts over string shortcuts', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '*' characters.
      const startEndShortcut: InlineShortcut = {
        triggers: [{ start: '*', end: '*' }],
        action: vi.fn(),
      };
      // Create a shortcut which fires immedeatly upon
      // '*' being typed.
      const stringShortcut: InlineShortcut = {
        triggers: ['*'],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing text
      // prefixed by the start trigger.
      const editor = createEditor(
        [startEndShortcut, stringShortcut],
        [{ ...emptyParagraphElement, children: [{ text: '*hello world' }] }],
      );

      // Insert '*' (trigger character of both shortcuts) into
      // the editor.
      editor.insertText('*');

      // Should fire the start/end shortcut action
      expect(startEndShortcut.action).toHaveBeenCalledWith(editor);
    });

    it('works when shortcut is inserted in between existing text', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '*' characters.
      const shortcut: InlineShortcut = {
        triggers: [{ start: '*', end: '*' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing text
      // prefixed by the start trigger and placed in between other
      // text.
      const editor = createEditor(
        [shortcut],
        [
          {
            ...emptyParagraphElement,
            children: [{ text: 'hello *new world' }],
          },
        ],
      );

      // Move the carret to just after the end trigger '*' character
      Transforms.setSelection(editor, { focus: { path: [0, 0], offset: 10 } });
      // Insert the shortcut end trigger into the editor
      editor.insertText('*');

      // Should fire the shortcut action
      expect(shortcut.action).toHaveBeenCalledWith(editor);
    });

    it('removes both start and end trigger strings', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '**' characters.
      const shortcut: InlineShortcut = {
        triggers: [{ start: '**', end: '**' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing text
      // prefixed by the start trigger and followed by the first
      // half of the end trigger, placed in between other text.
      const editor = createEditor(
        [shortcut],
        [
          {
            ...emptyParagraphElement,
            children: [{ text: 'hello **new* world' }],
          },
        ],
      );

      // Move the carret to just after the first end trigger '*'
      Transforms.setSelection(editor, { focus: { path: [0, 0], offset: 12 } });
      // Insert the shortcut end trigger into the editor
      editor.insertText('*');

      // Should remove the shortcut string
      expect(editor.children[0]).toMatchObject({
        children: [{ text: 'hello new world' }],
      });
    });

    it('selects the text wrapped by start/end triggers', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '**' characters.
      const shortcut: InlineShortcut = {
        triggers: [{ start: '**', end: '**' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing text
      // prefixed by the start trigger and followed by the first
      // half of the end trigger, placed in between other text.
      const editor = createEditor(
        [shortcut],
        [
          {
            ...emptyParagraphElement,
            children: [{ text: 'hello **new* world' }],
          },
        ],
      );

      // Move the carret to just after the first end trigger '*'
      Transforms.setSelection(editor, { focus: { path: [0, 0], offset: 12 } });
      // Insert the shortcut end trigger into the editor
      editor.insertText('*');

      // Should select the wrapped word
      expect(editor.selection).toEqual({
        anchor: { path: [0, 0], offset: 6 },
        focus: { path: [0, 0], offset: 9 },
      });
    });

    it('works accross multiple inline nodes with triggers within the node text', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '**' characters.
      const shortcut: InlineShortcut = {
        triggers: [{ start: '**', end: '**' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing text
      // prefixed by the start trigger and followed by the first
      // half of the end trigger, placed in between other text.
      const editor = createEditor(
        [shortcut],
        [
          {
            ...emptyParagraphElement,
            children: [
              { text: 'Check out ' },
              { text: 'the **cool ', italic: true },
              linkElement1,
              { text: ' right* now', italic: true },
              { text: '!' },
            ],
          },
        ],
      );

      // Move the carret to just after the first end trigger '*'
      Transforms.setSelection(editor, { focus: { path: [0, 3], offset: 7 } });
      // Insert the shortcut end trigger into the editor
      editor.insertText('*');

      // Should fire the action
      expect(shortcut.action).toHaveBeenCalledWith(editor);
      // Should remove start/end triggers
      expect(Ast.toPlainText(editor.children as Element[])).toBe(
        'Check out the cool MindDrop website right now!',
      );
      // Should select the wrapped nodes
      expect(editor.selection).toEqual({
        anchor: { path: [0, 1], offset: 4 },
        focus: { path: [0, 3], offset: 6 },
      });
    });

    it('works accross multiple inline nodes with triggers at the edge of their nodes', () => {
      // Create a shortcut which fires upon a piece of text
      // being wrapped by '**' characters.
      const shortcut: InlineShortcut = {
        triggers: [{ start: '**', end: '**' }],
        action: vi.fn(),
      };

      // Create an editor with the shortcut applied containing text
      // prefixed by the start trigger and followed by the first
      // half of the end trigger, placed in between other text.
      const editor = createEditor(
        [shortcut],
        [
          {
            ...emptyParagraphElement,
            children: [
              { text: 'Check out **' },
              { text: 'the ', italic: true },
              linkElement1,
              { text: ' today', italic: true },
              { text: '*!' },
            ],
          },
        ],
      );

      // Move the carret to just after the first end trigger '*'
      Transforms.setSelection(editor, { focus: { path: [0, 4], offset: 1 } });
      // Insert the shortcut end trigger into the editor
      editor.insertText('*');

      // Should fire the action
      expect(shortcut.action).toHaveBeenCalledWith(editor);
      // Should remove start/end triggers
      expect(Ast.toPlainText(editor.children as Element[])).toBe(
        'Check out the MindDrop website today!',
      );
      // Should select the wrapped nodes
      expect(editor.selection).toEqual({
        anchor: { path: [0, 1], offset: 0 },
        focus: { path: [0, 3], offset: 6 },
      });
    });
  });
});
