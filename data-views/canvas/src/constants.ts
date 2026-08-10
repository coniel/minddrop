import {
  AddExistingEntryDataKey,
  DatabaseEntriesDataKey,
  NewDatabaseEntriesDataKey,
  NewEntryPickerDataKey,
} from '@minddrop/ui-databases';
import { CanvasViewData } from './types';

export const defaultCanvasViewData: CanvasViewData = {
  nodes: [],
  connections: [],
};

// Width of newly placed entry nodes
export const DEFAULT_NODE_WIDTH = 300;

// Estimated height of an auto-height entry node, used when
// laying out nodes whose rendered height is not known
export const ESTIMATED_NODE_HEIGHT = 320;

// Gap between auto-placed nodes
export const NODE_GAP = 24;

// Number of nodes per row when auto-placing unplaced entries
export const UNPLACED_ROW_SIZE = 4;

// Gap between existing content and auto-placed unplaced entries
export const UNPLACED_SECTION_GAP = 100;

// Duration of the connection toolbar's exit transition before it
// unmounts, matching the theme's fast duration token
export const CONNECTION_TOOLBAR_EXIT_DURATION = 100;

// Data types the canvas accepts drops of
export const CANVAS_ACCEPTED_DATA_TYPES = [
  DatabaseEntriesDataKey,
  NewDatabaseEntriesDataKey,
  AddExistingEntryDataKey,
  NewEntryPickerDataKey,
];
