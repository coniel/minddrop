import { Editor } from '@minddrop/editor';
import { PaneEditorsStore } from './PaneEditorsStore';

/**
 * Records an editor as rendered in a view pane.
 *
 * @param paneKey - The key of the pane the editor renders in.
 * @param editor - The editor instance.
 */
export function registerPaneEditor(paneKey: string, editor: Editor): void {
  // Add the editor to the pane's editors
  PaneEditorsStore.setState((state) => {
    // Look up the pane's editors. A new pane starts with none.
    const pane = state.panes[paneKey] ?? { editors: [], focused: null };

    // Append the editor
    return {
      panes: {
        ...state.panes,
        [paneKey]: { ...pane, editors: [...pane.editors, editor] },
      },
    };
  });
}
