import { Editor } from '@minddrop/editor';
import { PaneEditorsStore } from './PaneEditorsStore';

/**
 * Marks an editor as the one last focused in its view pane.
 *
 * @param paneKey - The key of the pane the editor renders in.
 * @param editor - The editor instance.
 */
export function updateFocusedPaneEditor(paneKey: string, editor: Editor): void {
  // Set the editor as the pane's focused one
  PaneEditorsStore.setState((state) => {
    // Look up the pane's editors
    const pane = state.panes[paneKey];

    if (!pane) {
      return state;
    }

    // Replace the pane's focused editor
    return {
      panes: { ...state.panes, [paneKey]: { ...pane, focused: editor } },
    };
  });
}
