import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ViewsStore } from '../ViewsStore';
import { cleanup, mockDate, setup, view_gallery_1 } from '../test-utils';
import { View } from '../types';
import { updateViewOptions } from './updateViewOptions';

const options = { layout: 'grid' };

const updatedView: View = {
  ...view_gallery_1,
  options,
  lastModified: mockDate,
};

describe('updateViewOptions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view options in the store', async () => {
    await updateViewOptions(view_gallery_1.id, options);

    expect(ViewsStore.get(view_gallery_1.id)).toEqual(updatedView);
  });

  it('returns the updated view', async () => {
    const result = await updateViewOptions(view_gallery_1.id, options);

    expect(result).toEqual(updatedView);
  });

  it('shallow merges options if deepMerge is false', async () => {
    const result = await updateViewOptions(view_gallery_1.id, options, false);

    expect(result).toEqual(updatedView);
  });
});
