import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  registerItemReferenceAdapter,
  unregisterItemReferenceAdapter,
} from '@minddrop/item-references';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewsLoadedEvent } from '../events';
import {
  MockFs,
  cleanup,
  dataViewType_referencing,
  dataView_gallery_1,
  dataViews,
  setup,
} from '../test-utils';
import { getViewFilePath } from '../utils';
import { initializeDataViews } from './initializeDataViews';

// The loaded views including their references index
const loadedViews = dataViews.map((view) => ({ ...view, references: [] }));

describe('initializeDataViews', () => {
  beforeEach(() => setup({ loadViews: false }));

  afterEach(cleanup);

  it('loads views into the store', async () => {
    await initializeDataViews();

    expect(DataViewsStore.getAllArray()).toEqual(loadedViews);
  });

  it('dispatches a views loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DataViewsLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(loadedViews);
        done();
      });

      initializeDataViews();
    }));

  it('resolves item references and indexes them', async () => {
    // Register an adapter claiming 'address:' references
    registerItemReferenceAdapter({
      type: 'database-entry',
      serialize: (id) => id,
      match: (reference) =>
        reference.startsWith('address:')
          ? { type: 'database-entry', id: reference.slice('address:'.length) }
          : null,
    });

    // A view file holding a durable reference in its data
    const referencingView = {
      ...dataView_gallery_1,
      id: 'data-view_referencing-1',
      type: dataViewType_referencing.type,
      data: { items: ['address:database-entry_one'] },
    };

    MockFs.addFiles([
      {
        path: getViewFilePath(referencingView.id),
        textContent: JSON.stringify(referencingView),
      },
    ]);

    await initializeDataViews();

    const loaded = DataViewsStore.get(referencingView.id);

    // The loaded data holds resolved item IDs, indexed as references
    expect(loaded?.data).toEqual({ items: ['database-entry_one'] });
    expect(loaded?.references).toEqual(['database-entry_one']);

    unregisterItemReferenceAdapter('database-entry');
  });
});
