import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewsStore } from '../ViewsStore';
import { cleanup, mockDate, setup, view_gallery_1 } from '../test-utils';
import { View } from '../types';
import { updateViewData } from './updateViewData';

const data = { items: ['a', 'b'] };

const updatedView: View = {
  ...view_gallery_1,
  data,
  lastModified: mockDate,
};

describe('updateViewData', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view data in the store', async () => {
    await updateViewData(view_gallery_1.id, data);

    expect(ViewsStore.get(view_gallery_1.id)).toEqual(updatedView);
  });

  it('returns the updated view', async () => {
    const result = await updateViewData(view_gallery_1.id, data);

    expect(result).toEqual(updatedView);
  });

  it('shallow merges data if deepMerge is false', async () => {
    const result = await updateViewData(view_gallery_1.id, data, false);

    expect(result).toEqual(updatedView);
  });
});
