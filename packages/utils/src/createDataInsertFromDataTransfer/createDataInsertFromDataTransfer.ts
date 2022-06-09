import { DataInsert } from '@minddrop/core';

/**
 * Create a DataInsert object from a DataTransfer.
 *
 * @param dataTransfer The DataTransfer from which to create the DataInsert.
 * @returns A DataInsert object.
 */
export function createDataInsertFromDataTransfer(
  dataTransfer: DataTransfer,
): DataInsert {
  const data: Record<string, string> = {};

  dataTransfer.types.forEach((type) => {
    data[type] = dataTransfer.getData(type);
  });

  const dataInsert: DataInsert = {
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
    ) as DataInsert['action'];
    delete data['minddrop/action'];
  }

  // Add the MindDrop source if present
  if (dataTransfer.types.includes('minddrop/source')) {
    dataInsert.source = JSON.parse(dataTransfer.getData('minddrop/source'));
    delete data['minddrop/source'];
  }

  // Add the MindDrop drops if present
  if (dataTransfer.types.includes('minddrop/drops')) {
    dataInsert.drops = JSON.parse(dataTransfer.getData('minddrop/drops'));
    delete data['minddrop/drops'];
  }

  // Add the MindDrop topics if present
  if (dataTransfer.types.includes('minddrop/topics')) {
    dataInsert.topics = JSON.parse(dataTransfer.getData('minddrop/topics'));
    delete data['minddrop/topics'];
  }

  // Add remaining data as raw data
  Object.keys(data).forEach((type) => {
    dataInsert.data[type] = dataTransfer.getData(type);
    dataInsert.types.push(type);
  });

  return dataInsert;
}
