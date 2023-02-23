import { toKeyName } from 'is-hotkey';
import { Point, Editor as SlateEditor, Transforms } from 'slate';
import { Editor, RTInlineMenuConfig } from '../types';

function runOnQueryChange(
  editor: Editor,
  triggerCharaterLocation: Point,
  onQueryChange: RTInlineMenuConfig['onQueryChange'],
) {
  // Get the text starting after the trigger character
  // up until the current focus.
  const query = SlateEditor.string(editor, {
    anchor: {
      ...triggerCharaterLocation,
      // +1 because we don't include the trigger character
      offset: triggerCharaterLocation.offset + 1,
    },
    focus: editor.selection.focus,
  });

  // Fire the menu's `onQueryChange` callback with the
  // updated query string.
  onQueryChange(query);
}

/**
 * Does something useful.
 */
export function withInlineMenus(
  editor: Editor,
  triggerConfigs: RTInlineMenuConfig[],
): (event: React.KeyboardEvent<HTMLDivElement>) => boolean {
  const { insertText, deleteBackward } = editor;

  // The config of the currently open menu
  let activeMenu: RTInlineMenuConfig | null = null;
  // The location at which the trigger character was typed
  let triggerCharaterLocation: Point | null = null;

  // Callback fired by the menu when it closes
  const onCloseMenu = (clearQuery = false) => {
    if (clearQuery) {
      // Delete the trigger character and query text
      Transforms.delete(editor, {
        at: {
          anchor: {
            ...triggerCharaterLocation,
            offset: triggerCharaterLocation.offset - 1,
          },
          focus: editor.selection.focus,
        },
      });
    }

    // Clear the active menu config
    activeMenu = null;
    // Clear the trigger character location
    triggerCharaterLocation = null;
  };

  // Create a `{ [keyCode]: RTInlineMenuConfig }` map of
  // trigger character key codes and their corresponding
  // inline menu config.
  const triggerActions: Record<string, RTInlineMenuConfig> =
    triggerConfigs.reduce(
      (map, config) => ({
        ...map,
        // Use the trigger character's name as the key
        [toKeyName(config.character)]: config,
      }),
      {},
    );

  // eslint-disable-next-line no-param-reassign
  editor.insertText = (text) => {
    // Get the point at which the text was inserted
    const insertPoint = editor.selection?.focus;

    // Insert the text as normal
    insertText(text);

    if (!activeMenu) {
      // If there is no active menu, stop here
      return;
    }

    if (insertPoint && Point.isBefore(insertPoint, triggerCharaterLocation)) {
      // If text was inserted before the trigger character,
      // close the menu.
      activeMenu.close();
      onCloseMenu();
      console.log('closing here');

      // Stop here
      return;
    }

    // Call the active menu's `onQueryChange` callback
    // with the updated query.
    runOnQueryChange(editor, triggerCharaterLocation, activeMenu.onQueryChange);
  };

  // eslint-disable-next-line no-param-reassign
  editor.deleteBackward = (...args) => {
    // Delete backwards as normal
    deleteBackward(...args);

    if (!activeMenu) {
      // If there is no active menu, stop here
      return;
    }

    if (Point.equals(editor.selection.focus, triggerCharaterLocation)) {
      // If the trigger character was deleted, close the menu
      activeMenu.close();
      onCloseMenu();

      // Stop here
      return;
    }

    // Call the active menu's `onQueryChange` callback
    // with the updated query.
    runOnQueryChange(editor, triggerCharaterLocation, activeMenu.onQueryChange);
  };

  return (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Check if the pressed key is a menu trigger key
    if (triggerActions[event.key]) {
      // Set the matched menu config as the active menu
      activeMenu = triggerActions[event.key];
      // Set the current editor focus point as the location
      // of the trigger character.
      triggerCharaterLocation = editor.selection.focus;

      // Open the menu
      activeMenu.onOpen(event, onCloseMenu);
    }

    // Returning false causes the character to be
    // inserted as usual.
    return false;
  };
}
