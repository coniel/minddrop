import { renderHook, act } from '@minddrop/test-utils';
import { DataInsert } from '@minddrop/core';
import {
  useDataInsertsStore,
  addDropDataInsert,
  getDropDataInsert,
  useDataInsert,
} from './drop-data-inserts-store';

const dataInsert: DataInsert = {
  action: 'insert',
  types: [],
  data: {},
  files: [],
};

describe('drop data inserts store', () => {
  afterEach(() => {
    act(() => {
      // Clear the store
      useDataInsertsStore.getState().clear();
    });
  });

  describe('addDropDataInsert', () => {
    it('adds a data insert to the store', () => {
      // Add a data insert into the store
      addDropDataInsert('drop-id', dataInsert);

      // Should add the data insert to the store
      expect(useDataInsertsStore.getState().dataInserts['drop-id']).toEqual(
        dataInsert,
      );
    });
  });

  describe('getDropDataInsert', () => {
    it('returns a data insert from the store', () => {
      // Add a data insert into the store
      addDropDataInsert('drop-id', dataInsert);

      // Get the data insert
      const data = getDropDataInsert('drop-id');

      // Should return the data insert
      expect(data).toEqual(dataInsert);
    });

    it('returns `null` if there is no data insert', () => {
      // Get the data insert for a drop which has none
      const data = getDropDataInsert('missing');

      // Should return `null`
      expect(data).toBeNull();
    });
  });

  describe('useDataInsert', () => {
    it('returns a data insert from the store', () => {
      // Add a data insert into the store
      addDropDataInsert('drop-id', dataInsert);

      // Get the data insert
      const { result } = renderHook(() => useDataInsert('drop-id'));

      // Should return the data insert
      expect(result.current).toEqual(dataInsert);
    });

    it('returns `null` if there is no data insert', () => {
      // Get the data insert for a drop which has none
      const { result } = renderHook(() => useDataInsert('missing'));

      // Should return `null`
      expect(result.current).toBeNull();
    });
  });
});
