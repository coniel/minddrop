import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewsStore } from '../ContentViewsStore';
import { cleanup, contentView_gallery_1, mockDate, setup } from '../test-utils';
import { ContentView } from '../types';
import { updateContentViewOptions } from './updateContentViewOptions';

const options = { layout: 'grid' };

const updatedView: ContentView = {
  ...contentView_gallery_1,
  options,
  lastModified: mockDate,
  references: [],
};

describe('updateContentViewOptions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view options in the store', async () => {
    await updateContentViewOptions(contentView_gallery_1.id, options);

    expect(ContentViewsStore).toHaveItem(contentView_gallery_1.id, updatedView);
  });

  it('returns the updated view', async () => {
    const result = await updateContentViewOptions(
      contentView_gallery_1.id,
      options,
    );

    expect(result).toEqual(updatedView);
  });

  it('shallow merges options if deepMerge is false', async () => {
    const result = await updateContentViewOptions(
      contentView_gallery_1.id,
      options,
      false,
    );

    expect(result).toEqual(updatedView);
  });
});
