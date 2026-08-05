import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  registerItemReferenceAdapter,
  unregisterItemReferenceAdapter,
} from '@minddrop/item-references';
import { DataViewsStore } from '../../DataViewsStore';
import {
  MockFs,
  cleanup,
  dataViewType_referencing,
  dataView_gallery_1,
  setup,
} from '../../test-utils';
import { DataView } from '../../types';
import { getViewFilePath } from '../../utils';
import { onItemAddressesChanged } from './item-addresses-changed';

// A persisted view referencing the changed entry
const referencingView: DataView = {
  ...dataView_gallery_1,
  id: 'data-view_referencing-1',
  type: dataViewType_referencing.type,
  data: { items: ['database-entry_one'] },
  references: ['database-entry_one'],
};

describe('onItemAddressesChanged', () => {
  beforeEach(() => {
    setup({ loadViewFiles: false });

    // Register an adapter serializing IDs to observable addresses
    registerItemReferenceAdapter({
      type: 'database-entry',
      serialize: (id) => `address:${id}`,
      match: () => null,
    });

    DataViewsStore.set(referencingView);
  });

  afterEach(() => {
    cleanup();
    unregisterItemReferenceAdapter('database-entry');
  });

  it('rewrites persisted views referencing changed items', async () => {
    await onItemAddressesChanged([
      {
        id: 'database-entry_one',
        oldReference: 'old:database-entry_one',
        newReference: 'address:database-entry_one',
      },
    ]);

    const written = MockFs.readJsonFile<DataView>(
      getViewFilePath(referencingView.id),
    );

    // The rewritten file holds freshly serialized references
    expect(written.data).toEqual({ items: ['address:database-entry_one'] });
  });

  it('does not rewrite views without changed references', async () => {
    await onItemAddressesChanged([
      {
        id: 'database-entry_other',
        oldReference: 'old:database-entry_other',
        newReference: 'address:database-entry_other',
      },
    ]);

    // No file is written for the unaffected view
    expect(MockFs.exists(getViewFilePath(referencingView.id))).toBe(false);
  });
});
