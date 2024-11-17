import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { DataInsert } from '@minddrop/core';
import {
  setup,
  cleanup,
  selectedItem1,
  selectedItem2,
  selectedItem3,
} from '../test-utils';
import { SELECTION_DATA_KEY } from '../constants';
import { fromDataInsert } from './fromDataInsert';

const dataInsert: DataInsert = {
  action: 'move',
  types: [SELECTION_DATA_KEY],
  data: {
    [SELECTION_DATA_KEY]: JSON.stringify([
      selectedItem1.getData(),
      selectedItem2.getData(),
      selectedItem3.getData(),
    ]),
  },
};

describe('fromDataInsert', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all selection items from the data insert', () => {
    // Get selection items from a data insert
    const items = fromDataInsert(dataInsert);

    // Should return all selection items
    expect(items).toEqual([
      selectedItem1.getData(),
      selectedItem2.getData(),
      selectedItem3.getData(),
    ]);
  });

  it('returns an empty array if the data insert does not contain selection items', () => {
    // Get selection items from a data insert
    const items = fromDataInsert({ ...dataInsert, data: {}, types: [] });

    // Should return an empty array
    expect(items).toEqual([]);
  });
});
