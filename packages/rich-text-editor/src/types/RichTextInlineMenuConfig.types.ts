import React from 'react';

/**
 * Callback to be fired when an inline menu is closed.
 *
 * @param clearQuery - When true, the query string and trigger character will be removed from the editor.
 */
type CloseMenuCallback = (clearQuery?: boolean) => void;

export interface RichTextInlineMenuConfig {
  /**
   * The character which triggers the menu.
   */
  character: string;

  /**
   * Callback fired when the menu is opened.
   *
   * @param event - The trigger character key down event.
   * @param closeCallback - Callback to be fired when the menu is closed.
   */
  onOpen(
    event: React.KeyboardEvent<HTMLDivElement>,
    onCloseMenu: CloseMenuCallback,
  ): void;

  /**
   * Callback fired when the search query (text typed after the
   * trigger character) changes.
   */
  onQueryChange(query: string): void;

  /**
   * Callback fired to close the menu. Used to close the menu
   * if the trigger character is deleted.
   */
  close(): void;
}
