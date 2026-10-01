import { Editor } from '@minddrop/editor';
import { PaneEditorsStore } from '../PaneEditorsStore';

/**
 * Resolves a view pane's editor. This is the editor last focused in
 * the pane, or the first rendered in it.
 *
 * @param paneKey - The key of the pane.
 * @returns The pane's editor, or null when it renders none.
 */
export function resolvePaneEditor(paneKey: string): Editor | null {
  // Look up the pane's editors
  const pane = PaneEditorsStore.getState().panes[paneKey];

  if (!pane) {
    return null;
  }

  // Prefer the last focused editor, then the first rendered
  return pane.focused ?? pane.editors[0] ?? null;
}
