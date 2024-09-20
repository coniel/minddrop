import isUrl from 'is-url';
import { MindDropDataTransfer, MindDropDataTransferAction } from '../types';

/**
 * Create a MindDropDataInsert object from a DataTransfer.
 *
 * @param dataTransfer The DataTransfer from which to create the DataInsert.
 * @returns A DataInsert object.
 */
export function toMindDropDataTransfer(
  dataTransfer: DataTransfer,
): MindDropDataTransfer {
  const data: Record<string, string> = {};

  dataTransfer.types.forEach((type) => {
    data[type] = dataTransfer.getData(type);
  });

  const dataInsert: MindDropDataTransfer = {
    action: 'insert',
    types: [],
    data: {},
  };

  // Add files if there are any
  if (dataTransfer.files && dataTransfer.files.length) {
    dataInsert.files = Array.from(dataTransfer.files);
  }

  // Set the MindDrop action if present
  if (dataTransfer.types.includes('minddrop/action')) {
    dataInsert.action = dataTransfer.getData(
      'minddrop/action',
    ) as MindDropDataTransferAction;
    delete data['minddrop/action'];
  }

  // Add 'text/uri-list' data if 'text/plain' is a URL
  if (
    dataTransfer.types.includes('text/plain') &&
    isUrl(dataTransfer.getData('text/plain'))
  ) {
    dataInsert.types.push('text/uri-list');
    dataInsert.data['text/uri-list'] = dataTransfer.getData('text/plain');
  }

  // Add remaining data as raw data
  Object.keys(data).forEach((type) => {
    dataInsert.data[type] = dataTransfer.getData(type);
    dataInsert.types.push(type);
  });

  return dataInsert;
}
