import { Editor } from '@minddrop/editor';
import { createVanillaStore } from '@minddrop/stores';

export interface PaneEditors {
  /**
   * The editors rendered in the pane, in mount order.
   */
  editors: Editor[];

  /**
   * The editor last focused in the pane. Null until one is focused.
   */
  focused: Editor | null;
}

interface PaneEditorsState {
  /**
   * The editors rendered in each pane, keyed by pane key.
   */
  panes: Record<string, PaneEditors>;
}

// The editors rendered in each view pane
export const PaneEditorsStore = createVanillaStore<PaneEditorsState>(() => ({
  panes: {},
}));
