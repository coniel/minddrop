import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { InvalidParameterError, omitPath } from '@minddrop/utils';
import { ViewsStore } from '../ViewsStore';
import { ViewUpdatedEvent, ViewUpdatedEventData } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  setup,
  view_gallery_1,
} from '../test-utils';
import { View } from '../types';
import { getViewFilePath } from '../utils';
import { updateView } from './updateView';

const update = {
  databaseDesignMap: {
    'database-foo': 'design-foo',
  },
};
const updatedView: View = {
  ...view_gallery_1,
  databaseDesignMap: {
    ...view_gallery_1.databaseDesignMap,
    ...update.databaseDesignMap,
  },
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
      databaseDesignMap: update.databaseDesignMap,
    });
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
