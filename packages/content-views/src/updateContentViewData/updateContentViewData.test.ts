import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewsStore } from '../ContentViewsStore';
import { cleanup, contentView_gallery_1, mockDate, setup } from '../test-utils';
import { ContentView } from '../types';
import { updateContentViewData } from './updateContentViewData';

const data = { items: ['a', 'b'] };

const updatedView: ContentView = {
  ...contentView_gallery_1,
  data,
  lastModified: mockDate,
  references: [],
};

describe('updateContentViewData', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view data in the store', async () => {
    await updateContentViewData(contentView_gallery_1.id, data);

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id, updatedView);
  });

  it('returns the updated view', async () => {
    const result = await updateContentViewData(contentView_gallery_1.id, data);

    expect(result).toEqual(updatedView);
  });

  it('shallow merges data if deepMerge is false', async () => {
    const result = await updateContentViewData(
      contentView_gallery_1.id,
      data,
      false,
    );

    expect(result).toEqual(updatedView);
  });
});
