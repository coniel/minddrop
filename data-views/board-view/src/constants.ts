import {
  AddExistingEntryDataKey,
  DatabaseEntriesDataKey,
  NewDatabaseEntriesDataKey,
} from '@minddrop/feature-databases';
import { BoardViewData } from './types';

export const defaultBoardViewData: BoardViewData = {
  columns: [[], [], []],
};

// Fallback icon for databases without a custom icon
export const DATABASE_FALLBACK_ICON = 'content-icon:shapes:inherit';

// Data types the board's drop zones accept
export const BOARD_ACCEPTED_DATA_TYPES = [
  DatabaseEntriesDataKey,
  NewDatabaseEntriesDataKey,
  AddExistingEntryDataKey,
];
