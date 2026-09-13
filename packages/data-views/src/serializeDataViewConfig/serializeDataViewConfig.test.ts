import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  dataViewType_gallery,
  dataViewType_referencing,
  setup,
} from '../test-utils';
import { serializeDataViewConfig } from './serializeDataViewConfig';

const { workspace_2 } = WorkspaceFixtures;

describe('serializeDataViewConfig', () => {
  beforeEach(() => {
    setup({});

    // Register an adapter converting entry IDs to addresses, dropping
    // the 'missing' entry and naming the workspace serialized in when
    // one is given.
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id, workspaceId) => {
        if (id === 'database-entry_missing') {
          return null;
        }

        return workspaceId ? `${workspaceId}:${id}` : `address:${id}`;
      },
      match: () => null,
    });
  });

  it('serializes references in the given workspace', () => {
    expect(
      serializeDataViewConfig(
        dataViewType_referencing.type,
        { data: { items: ['database-entry_one'] } },
        workspace_2.id,
      ),
    ).toEqual({ data: { items: [`${workspace_2.id}:database-entry_one`] } });
  });

  afterEach(async () => {
    await cleanup();
    ItemReferences.unregisterAdapter('database-entry');
  });

  it("serializes references through the view type's hook", () => {
    expect(
      serializeDataViewConfig(dataViewType_referencing.type, {
        data: { items: ['database-entry_one'] },
      }),
    ).toEqual({ data: { items: ['address:database-entry_one'] } });
  });

  it('drops references that cannot be serialized', () => {
    expect(
      serializeDataViewConfig(dataViewType_referencing.type, {
        data: { items: ['database-entry_missing', 'database-entry_one'] },
      }),
    ).toEqual({ data: { items: ['address:database-entry_one'] } });
  });

  it('passes configs of view types without the hook through unchanged', () => {
    const config = { data: { items: ['database-entry_one'] } };

    expect(serializeDataViewConfig(dataViewType_gallery.type, config)).toBe(
      config,
    );
  });

  it('passes configs of unregistered view types through unchanged', () => {
    const config = { options: {} };

    expect(serializeDataViewConfig('unregistered', config)).toBe(config);
  });
});
