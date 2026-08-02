import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewsStore } from '../DataViewsStore';
import { cleanup, mockDate, setup, view_gallery_1 } from '../test-utils';
import { DataView } from '../types';
import { updateDataViewData } from './updateDataViewData';

const data = { items: ['a', 'b'] };

const updatedView: DataView = {
  ...view_gallery_1,
  data,
  lastModified: mockDate,
};

describe('updateDataViewData', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view data in the store', async () => {
    await updateDataViewData(view_gallery_1.id, data);

    expect(DataViewsStore.get(view_gallery_1.id)).toEqual(updatedView);
  });

  it('returns the updated view', async () => {
    const result = await updateDataViewData(view_gallery_1.id, data);

    expect(result).toEqual(updatedView);
  });

  it('shallow merges data if deepMerge is false', async () => {
    const result = await updateDataViewData(view_gallery_1.id, data, false);

    expect(result).toEqual(updatedView);
  });
});
