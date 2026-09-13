import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { serializeDataView } from '../serializeDataView';
import {
  cleanup,
  dataViewType_referencing,
  dataView_virtual_1,
  setup,
} from '../test-utils';
import { StoredDataView } from '../types';
import { deserializeDataView } from './deserializeDataView';

const { workspace_2 } = WorkspaceFixtures;

describe('deserializeDataView', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('restores the date fields', () => {
    // A stored view as parsed from JSON, with dates as ISO strings
    const storedView = JSON.parse(
      JSON.stringify(serializeDataView(dataView_virtual_1)),
    ) as StoredDataView;

    const view = deserializeDataView(storedView);

    expect(view.created).toBeInstanceOf(Date);
    expect(view.lastModified).toBeInstanceOf(Date);
  });

  it('round-trips a serialized view', () => {
    const storedView = serializeDataView(dataView_virtual_1, {
      dataSource: false,
    });

    expect(deserializeDataView(storedView)).toEqual(storedView);
  });

  it('resolves the config references in the given workspace', () => {
    // Register an adapter naming the workspace resolved in
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => id,
      match: (reference, workspaceId) => ({
        type: 'database-entry',
        id: `${workspaceId}:${reference}`,
      }),
    });

    // A stored view referencing an entry via the referencing view
    // type's data.
    const storedView: StoredDataView = {
      ...serializeDataView(dataView_virtual_1),
      type: dataViewType_referencing.type,
      data: { items: ['Books/One'] },
    };

    expect(deserializeDataView(storedView, workspace_2.id).data).toEqual({
      items: [`${workspace_2.id}:Books/One`],
    });

    ItemReferences.unregisterAdapter('database-entry');
  });
});
