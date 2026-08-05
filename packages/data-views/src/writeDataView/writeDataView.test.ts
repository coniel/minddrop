import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  registerItemReferenceAdapter,
  unregisterItemReferenceAdapter,
} from '@minddrop/item-references';
import { InvalidParameterError } from '@minddrop/utils';
import { DataViewsStore } from '../DataViewsStore';
import {
  MockFs,
  cleanup,
  dataViewType_referencing,
  dataView_gallery_1,
  dataView_virtual_1,
  setup,
} from '../test-utils';
import { DataView } from '../types';
import { getViewFilePath } from '../utils';
import { getViewsDirPath } from '../utils/getViewsDirPath';
import { writeDataView } from './writeDataView';

// A view referencing an entry via the referencing view type's data
const referencingView: DataView = {
  ...dataView_gallery_1,
  id: 'data-view_referencing-1',
  type: dataViewType_referencing.type,
  data: { items: ['database-entry_one'] },
  references: ['database-entry_one'],
};

describe('writeDataView', () => {
  beforeEach(() => setup({ loadViewFiles: false }));

  afterEach(cleanup);

  it('writes the view to the file system', async () => {
    await writeDataView(dataView_gallery_1.id);

    expect(MockFs.readJsonFile(getViewFilePath(dataView_gallery_1.id))).toEqual(
      dataView_gallery_1,
    );
  });

  it('creates the Views directory if it does not exist', async () => {
    // Remove the data views directory
    MockFs.removeDir(getViewsDirPath());

    await writeDataView(dataView_gallery_1.id);

    expect(MockFs.exists(getViewsDirPath())).toBe(true);
  });

  it('serializes item references and strips the references index', async () => {
    // Register an adapter converting entry IDs to addresses
    registerItemReferenceAdapter({
      type: 'database-entry',
      serialize: (id) => `address:${id}`,
      match: () => null,
    });

    DataViewsStore.set(referencingView);

    await writeDataView(referencingView.id);

    const written = MockFs.readJsonFile<DataView>(
      getViewFilePath(referencingView.id),
    );

    // The written data holds durable references
    expect(written.data).toEqual({ items: ['address:database-entry_one'] });

    // The references index is not persisted
    expect('references' in written).toBe(false);

    unregisterItemReferenceAdapter('database-entry');
  });

  it('throws when writing a virtual view', async () => {
    // Add a virtual data view to the store
    DataViewsStore.set(dataView_virtual_1);

    await expect(writeDataView(dataView_virtual_1.id)).rejects.toThrow(
      InvalidParameterError,
    );
  });
});
