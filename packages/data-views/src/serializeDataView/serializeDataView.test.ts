import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  dataViewType_referencing,
  dataView_virtual_1,
  setup,
} from '../test-utils';
import { DataView } from '../types';
import { serializeDataView } from './serializeDataView';

// A view carrying every runtime-only field
const view: DataView = {
  ...dataView_virtual_1,
  owner: 'database_1',
  ownerKey: 'key',
  references: ['database-entry_1'],
};

const { workspace_2 } = WorkspaceFixtures;

describe('serializeDataView', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('strips the runtime-only fields', () => {
    const storedView = serializeDataView(view);

    expect(storedView).not.toHaveProperty('virtual');
    expect(storedView).not.toHaveProperty('owner');
    expect(storedView).not.toHaveProperty('ownerKey');
    expect(storedView).not.toHaveProperty('references');
    expect(storedView.id).toBe(view.id);
  });

  it('includes the data source by default', () => {
    expect(serializeDataView(view).dataSource).toEqual(view.dataSource);
  });

  it('drops the data source when configured to', () => {
    expect(serializeDataView(view, { dataSource: false })).not.toHaveProperty(
      'dataSource',
    );
  });

  it('serializes the config references in the given workspace', () => {
    // Register an adapter naming the workspace serialized in
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id, workspaceId) => `${workspaceId}:${id}`,
      match: () => null,
    });

    // A view referencing an entry via the referencing view type's data
    const referencingView: DataView = {
      ...view,
      type: dataViewType_referencing.type,
      data: { items: ['database-entry_one'] },
    };

    expect(
      serializeDataView(referencingView, { workspaceId: workspace_2.id }).data,
    ).toEqual({ items: [`${workspace_2.id}:database-entry_one`] });

    ItemReferences.unregisterAdapter('database-entry');
  });
});
