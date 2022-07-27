import { DataInsert } from '@minddrop/core';
import {
  setup,
  cleanup,
  selectedDrop1,
  selectedTopic1,
  selectedDrop2,
} from '../test-utils';
import { getFromDataInsert } from './getFromDataInsert';

const dataInsert: DataInsert = {
  action: 'move',
  types: [
    `minddrop-selection/${selectedDrop1.resource}`,
    `minddrop-selection/${selectedTopic1.resource}`,
  ],
  data: {
    [`minddrop-selection/${selectedDrop1.resource}`]: JSON.stringify([
      selectedDrop1,
      selectedDrop2,
    ]),
    [`minddrop-selection/${selectedTopic1.resource}`]: JSON.stringify([
      selectedTopic1,
    ]),
  },
};

describe('getFromDataInsert', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all selection items from the data insert', () => {
    // Get selection items from a data insert
    const items = getFromDataInsert(dataInsert);

    // Should return all selection items
    expect(items).toEqual([selectedDrop1, selectedDrop2, selectedTopic1]);
  });

  it('filters returned items by resource', () => {
    // Get 'drops:drop' selection items from a data insert
    const items = getFromDataInsert(dataInsert, 'drops:drop');

    // Should return only 'drops:drop' selection items
    expect(items).toEqual([selectedDrop1, selectedDrop2]);
  });
});
