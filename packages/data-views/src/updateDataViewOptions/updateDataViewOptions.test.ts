import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewsStore } from '../DataViewsStore';
import { cleanup, dataView_gallery_1, mockDate, setup } from '../test-utils';
import { DataView } from '../types';
import { updateDataViewOptions } from './updateDataViewOptions';

const options = { layout: 'grid' };

const updatedView: DataView = {
  ...dataView_gallery_1,
  options,
  lastModified: mockDate,
  references: [],
};

describe('updateDataViewOptions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view options in the store', async () => {
    await updateDataViewOptions(dataView_gallery_1.id, options);

    expect(DataViewsStore.get(dataView_gallery_1.id)).toEqual(updatedView);
  });

  it('returns the updated view', async () => {
    const result = await updateDataViewOptions(dataView_gallery_1.id, options);

    expect(result).toEqual(updatedView);
  });

  it('shallow merges options if deepMerge is false', async () => {
    const result = await updateDataViewOptions(
      dataView_gallery_1.id,
      options,
      false,
    );

    expect(result).toEqual(updatedView);
  });
});
