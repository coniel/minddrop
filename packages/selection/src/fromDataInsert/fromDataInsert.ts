import { DataInsert } from '@minddrop/core';
import { SelectionItem } from '../types';
import { SELECTION_DATA_KEY } from '../constants';

/**
 * Parses a data insert and retrieves all selection items.
 *
 * @param dataInsert - The data insert from which to parse selection items.
 * @returns An array of selection items.
 */
export function fromDataInsert(dataInsert: DataInsert): SelectionItem[] {
  if (dataInsert.types.includes(SELECTION_DATA_KEY)) {
    return JSON.parse(dataInsert.data[SELECTION_DATA_KEY]);
  }

  return [];
}
