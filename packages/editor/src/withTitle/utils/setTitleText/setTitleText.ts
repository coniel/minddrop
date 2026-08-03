import { Editor as SlateEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { Transforms } from '../../../Transforms';
import { Editor } from '../../../types';

export interface SetTitleTextOptions {
  /**
   * When false, the change is not recorded in the undo history.
   * Defaults to true.
   */
  saveHistory?: boolean;
}

/**
 * Replaces the text of the title element (the editor's first
 * node) with the given text. Assumes the title feature is
 * enabled.
 *
 * @param editor - The editor instance.
 * @param text - The new title text.
 * @param options - History saving options.
 */
export function setTitleText(
  editor: Editor,
  text: string,
  options: SetTitleTextOptions = {},
): void {
  // Skip history saving when requested
  if (options.saveHistory === false) {
    HistoryEditor.withoutSaving(editor as unknown as HistoryEditor, () =>
      replaceTitleText(editor, text),
    );

    return;
  }

  replaceTitleText(editor, text);
}

/**
 * Replaces the title element's text in a single normalization
 * pass.
 */
function replaceTitleText(editor: Editor, text: string): void {
  SlateEditor.withoutNormalizing(editor, () => {
    // Range covering the entire title text
    const titleRange = {
      anchor: SlateEditor.start(editor, [0]),
      focus: SlateEditor.end(editor, [0]),
    };

    // Clear the title text when the new text is empty
    if (text === '') {
      Transforms.delete(editor, { at: titleRange });

      return;
    }

    // Replace the title text with the new text
    Transforms.insertText(editor, text, { at: titleRange });
  });
}
