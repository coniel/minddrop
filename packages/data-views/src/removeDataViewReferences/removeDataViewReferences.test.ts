import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViewsStore } from '../DataViewsStore';
import {
  MockFs,
  cleanup,
  dataViewType_referencing,
  dataView_gallery_1,
  setup,
} from '../test-utils';
import { DataView } from '../types';
import { getViewFilePath } from '../utils';
import { removeDataViewReferences } from './removeDataViewReferences';

// A persisted view referencing two entries
const referencingView: DataView = {
  ...dataView_gallery_1,
  id: 'data-view_referencing-1',
  type: dataViewType_referencing.type,
  data: { items: ['database-entry_one', 'database-entry_two'] },
  references: ['database-entry_one', 'database-entry_two'],
};

describe('removeDataViewReferences', () => {
  beforeEach(() => {
    setup({ loadViewFiles: false });

    DataViewsStore.set(referencingView);
  });

  afterEach(cleanup);

  it('removes the items from referencing views', async () => {
    await removeDataViewReferences(['database-entry_one']);

    const view = DataViewsStore.get(referencingView.id);

    // The view's config and references index drop the removed item
    expect(view?.data).toEqual({ items: ['database-entry_two'] });
    expect(view?.references).toEqual(['database-entry_two']);

    // The cleaned config is persisted
    const written = MockFs.readJsonFile<DataView>(
      getViewFilePath(referencingView.id),
    );
    expect(written.data).toEqual({ items: ['database-entry_two'] });
  });

  it('does not update views without matching references', async () => {
    await removeDataViewReferences(['database-entry_other']);

    // The unaffected view is not written to disk
    expect(MockFs.exists(getViewFilePath(referencingView.id))).toBe(false);
  });
});
