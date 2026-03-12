import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { ViewsStore } from '../ViewsStore';
import { ViewUpdatedEvent, ViewUpdatedEventData } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  setup,
  view_gallery_1,
  view_virtual_1,
} from '../test-utils';
import { View } from '../types';
import { getViewFilePath } from '../utils';
import { updateView } from './updateView';

const update = {
  options: { layout: 'grid' },
};
const updatedView: View = {
  ...view_gallery_1,
  options: update.options,
  lastModified: mockDate,
};

describe('updateView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the view in the store', async () => {
    await updateView(view_gallery_1.id, update);

    expect(ViewsStore.get(view_gallery_1.id)).toEqual(updatedView);
  });

  it('writes the view to the file system', async () => {
    await updateView(view_gallery_1.id, update);

    expect(MockFs.readJsonFile(getViewFilePath(view_gallery_1.id))).toEqual(
      updatedView,
    );
  });

  it('returns the updated view', async () => {
    const result = await updateView(view_gallery_1.id, update);

    expect(result).toEqual(updatedView);
  });

  it('shallow merges update data if deepMerge is false', async () => {
    const result = await updateView(view_gallery_1.id, update, false);

    expect(result).toEqual({
      ...updatedView,
      options: update.options,
    });
  });

  it('does not write to the file system for virtual views', async () => {
    // Add a virtual view to the store
    ViewsStore.add(view_virtual_1);

    await updateView(view_virtual_1.id, { name: 'Updated' });

    // Should not have created a file
    expect(MockFs.exists(getViewFilePath(view_virtual_1.id))).toBe(false);
  });

  it('allows changing the ID of a virtual view', async () => {
    // Add a virtual view to the store
    ViewsStore.add(view_virtual_1);

    const result = await updateView(view_virtual_1.id, {
      id: 'new-virtual-id',
    });

    // Old ID should be removed
    expect(ViewsStore.get(view_virtual_1.id)).toBeNull();

    // New ID should exist
    expect(ViewsStore.get('new-virtual-id')).not.toBeNull();
    expect(result.id).toBe('new-virtual-id');
  });

  it('throws when attempting to change the ID of a non-virtual view', async () => {
    await expect(
      updateView(view_gallery_1.id, { id: 'new-id' }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('dispatches a view updated event', async () =>
    new Promise<void>((done) => {
      ViewsStore.add(updatedView);

      Events.addListener<ViewUpdatedEventData>(
        ViewUpdatedEvent,
        'test',
        (payload) => {
          expect(payload.data.original).toEqual(view_gallery_1);
          expect(payload.data.updated).toEqual(updatedView);
          done();
        },
      );

      updateView(view_gallery_1.id, update);
    }));
});
