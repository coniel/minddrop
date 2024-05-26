import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { toKeyName } from 'is-hotkey';
import { Node, Transforms } from 'slate';
import { setup, cleanup, createTestEditor } from '../test-utils';
import { Editor, InlineMenuConfig } from '../types';
import { withInlineMenus } from './withInlineMenu';

const slashCommand: InlineMenuConfig = {
  character: '/',
  onOpen: vi.fn(),
  onQueryChange: vi.fn(),
  close: vi.fn(),
};

const atCommand: InlineMenuConfig = {
  character: '@',
  onOpen: vi.fn(),
  onQueryChange: vi.fn(),
  close: vi.fn(),
};

const mockKeyboardEvent = {
  key: toKeyName('/'),
} as React.KeyboardEvent<HTMLDivElement>;

describe('withInlineMenu', () => {
  let editor: Editor;
  let onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => boolean;

  beforeEach(() => {
    setup();

    editor = createTestEditor();
    onKeyDown = withInlineMenus(editor, [slashCommand, atCommand]);

    // Call the `onKeyDown` callback, simulating a '/' keypress
    // to open the menu.
    onKeyDown(mockKeyboardEvent);
    // Insert the '/' into the document.
    editor.insertText('/');
  });

  afterEach(cleanup);

  describe('onKeyDown callback', () => {
    it('opens the menu corresponding to a trigger character', () => {
      // Should fire `onOpen` with the action and `onCloseMenu`
      // callback when the trigger key is pressed (see `beforeEach`).
      expect(slashCommand.onOpen).toHaveBeenCalledWith(
        mockKeyboardEvent,
        expect.any(Function),
      );
    });
  });

  describe.skip('onCloseMenu callback', () => {
    it('ends the tracking of query changes', () => {
      // Create an inline menu config which calls `onCloseMenu`
      // inside of `onOpen`.
      const withOnCloseMenu: InlineMenuConfig = {
        ...slashCommand,
        onQueryChange: vi.fn(),
        onOpen: (editor, onCloseMenu) => onCloseMenu(),
      };
      onKeyDown = withInlineMenus(editor, [withOnCloseMenu]);

      // Call the `onKeyDown` callback, simulating a '/' keypress
      // to open the menu.
      onKeyDown(mockKeyboardEvent);

      // Insert a query string after the trigger character
      editor.insertText('foo');

      // Delete backwards by a character
      editor.deleteBackward('character');

      // Should not call `onQueryChange`
      expect(withOnCloseMenu.onQueryChange).not.toHaveBeenCalled();
    });

    it('clears the trigger character and query text if desired', () => {
      // Create an inline menu config which calls `onCloseMenu`
      // with `clearQuery` set to true when the query changes.
      let closeMenuCallback: (clearQuery: boolean) => void;
      const withOnCloseMenu: InlineMenuConfig = {
        ...slashCommand,
        onQueryChange: (query) => {
          if (query === 'foo') {
            closeMenuCallback(true);
          }
        },
        onOpen: (editor, onCloseMenu) => {
          closeMenuCallback = onCloseMenu;
        },
      };
      onKeyDown = withInlineMenus(editor, [withOnCloseMenu]);

      // Call the `onKeyDown` callback, simulating a '/' keypress
      // to open the menu.
      onKeyDown(mockKeyboardEvent);

      // Insert a query string after the trigger character
      editor.insertText('foo');

      // Should remove the trigger character and query text
      expect(Node.string(Node.get(editor, [0, 0]))).toBe('');
    });
  });

  describe('onQueryChange', () => {
    it('fires when text is inserted after the trigger', () => {
      // Insert a query string after the trigger character
      editor.insertText('foo');

      // Should call `onQueryChange` with the query string
      expect(slashCommand.onQueryChange).toHaveBeenCalledWith('foo');
    });

    it('fires when text is removed from the query', () => {
      // Insert a query string after the trigger character
      editor.insertText('foo');

      // Delete backwards by a character
      editor.deleteBackward('character');

      // Should call `onQueryChange` with the updated query string
      expect(slashCommand.onQueryChange).toHaveBeenCalledWith('fo');
    });
  });

  it('closes the menu if the trigger character is deleted', () => {
    // Clear the inital call to `onQueryChange`
    vi.clearAllMocks();

    // Delete backwards by a character, removing the trigger
    editor.deleteBackward('character');

    // Should call the `close` callback
    expect(slashCommand.close).toHaveBeenCalled();
    // Should not call the `onQueryChange` callback
    expect(slashCommand.onQueryChange).not.toHaveBeenCalled();
  });

  it('closes the menu if text is inserted before the trigger character', () => {
    // Delete backwards by a character to remove the trigger and close
    // the menu (undo the `beforeEach` behaviour).
    editor.deleteBackward('character');

    // Clear the `close` call caused above
    vi.clearAllMocks();

    // Insert some text, followed the the trigger character
    editor.insertText('foo/');

    // Fire the `onKeyDown` callback to simulate the trigger
    // character being pressed.
    onKeyDown(mockKeyboardEvent);

    // Move the selection to before the trigger character
    Transforms.select(editor, { path: [0, 0], offset: 1 });
    // Insert text
    editor.insertText('a');

    // Should call the `close` callback
    expect(slashCommand.close).toHaveBeenCalled();
  });

  it.skip('closes the menu if text is inserted at the trigger point', () => {
    // Move the selection to the trigger character point
    Transforms.select(editor, { path: [0, 0], offset: 0 });
    // Insert text
    Transforms.insertText(editor, 'a');

    // Should call the `close` callback
    expect(slashCommand.close).toHaveBeenCalled();
  });
});
