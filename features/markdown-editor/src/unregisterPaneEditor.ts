import { Editor } from '@minddrop/editor';
import { PaneEditorsStore } from './PaneEditorsStore';

/**
 * Removes an editor from the view pane it was rendered in.
 *
 * @param paneKey - The key of the pane the editor rendered in.
 * @param editor - The editor instance.
 */
export function unregisterPaneEditor(paneKey: string, editor: Editor): void {
  // Remove the editor from the pane's editors
  PaneEditorsStore.setState((state) => {
    // Look up the pane's editors
    const pane = state.panes[paneKey];

    if (!pane) {
      return state;
    }

    // Rebuild the pane without the editor
    return {
      panes: {
        ...state.panes,
        [paneKey]: {
          // The remaining editors
          editors: pane.editors.filter((candidate) => candidate !== editor),
          // Clear the focused editor when it is the one removed
          focused: pane.focused === editor ? null : pane.focused,
        },
      },
    };
  });
}
