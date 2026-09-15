import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  contentViewType_referencing,
  contentView_virtual_1,
  setup,
} from '../test-utils';
import { ContentView } from '../types';
import { serializeContentView } from './serializeContentView';

// A view carrying every runtime-only field
const view: ContentView = {
  ...contentView_virtual_1,
  owner: 'database_1',
  ownerKey: 'key',
  references: ['database-entry_1'],
};

const { workspace_2 } = WorkspaceFixtures;

describe('serializeContentView', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('strips the runtime-only fields', () => {
    const storedView = serializeContentView(view);

    expect(storedView).not.toHaveProperty('virtual');
    expect(storedView).not.toHaveProperty('owner');
    expect(storedView).not.toHaveProperty('ownerKey');
    expect(storedView).not.toHaveProperty('references');
    expect(storedView.id).toBe(view.id);
  });

  it('includes the data source by default', () => {
    expect(serializeContentView(view).dataSource).toEqual(view.dataSource);
  });

  it('drops the data source when configured to', () => {
    expect(
      serializeContentView(view, { dataSource: false }),
    ).not.toHaveProperty('dataSource');
  });

  it('serializes the config references in the given workspace', () => {
    // Register an adapter naming the workspace serialized in
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id, workspaceId) => `${workspaceId}:${id}`,
      match: () => null,
    });

    // A view referencing an entry via the referencing view type's data
    const referencingView: ContentView = {
      ...view,
      type: contentViewType_referencing.type,
      data: { items: ['database-entry_one'] },
    };

    expect(
      serializeContentView(referencingView, { workspaceId: workspace_2.id })
        .data,
    ).toEqual({ items: [`${workspace_2.id}:database-entry_one`] });

    ItemReferences.unregisterAdapter('database-entry');
  });
});
