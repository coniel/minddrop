import { createContext } from 'react';

/**
 * The IDs of the editor's selected blocks.
 *
 * Provided as context rather than read from the app's selection
 * within each block, so that a change to the selection re-renders
 * the blocks. Slate memoises an element against its own part of
 * the editor's selection, which does not change when a block is
 * selected or deselected in the app.
 */
export const BlockSelectionContext = createContext<ReadonlySet<string>>(
  new Set(),
);
