import {
  AddExistingEntryDataKey,
  DatabaseEntriesDataKey,
  NewDatabaseEntriesDataKey,
  NewEntryPickerDataKey,
} from '@minddrop/ui-components';
import { BoardViewData } from './types';

export const defaultBoardViewData: BoardViewData = {
  columns: [[], [], []],
};

// Data types the board's drop zones accept
export const BOARD_ACCEPTED_DATA_TYPES = [
  DatabaseEntriesDataKey,
  NewDatabaseEntriesDataKey,
  AddExistingEntryDataKey,
  NewEntryPickerDataKey,
];
