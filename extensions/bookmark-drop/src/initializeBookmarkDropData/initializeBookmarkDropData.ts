import { Core, DataInsert } from '@minddrop/core';
import { BookmarkDropData } from '../types';

/**
 * Generates the data to create a new text drop.
 *
 * @param core A MindDrop core instance.
 * @param dataInsert Inserted data.
 * @returns The data to create a text drop.
 */
export function initializeBookmarkDropData(
  core: Core,
  dataInsert?: DataInsert,
): BookmarkDropData {
  return {
    url: dataInsert ? dataInsert.data['text/url'] || '' : '',
    hasPreview: false,
  };
}
