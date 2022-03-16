import { Core, DataInsert } from '@minddrop/core';
import { generateId } from '@minddrop/utils';
import { CreateTextDropData } from '../types';

/**
 * Generates the data to create a new text drop.
 *
 * @param core A MindDrop core instance.
 * @param dataInsert Inserted data.
 * @returns The data to create a text drop.
 */
export function createTextDrop(
  core: Core,
  dataInsert?: DataInsert,
): CreateTextDropData {
  const drop: CreateTextDropData = {
    type: 'text',
    contentRevision: generateId(),
    content: JSON.stringify([{ type: 'paragraph', children: [{ text: '' }] }]),
  };

  if (dataInsert && dataInsert.types.includes('text/plain')) {
    // Set the inserted plain text as the content
    drop.content = JSON.stringify([
      {
        type: 'paragraph',
        children: [{ text: dataInsert.data['text/plain'] }],
      },
    ]);
  }

  return drop;
}
