import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ItemReferences } from '@minddrop/item-references';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  dataViewType_gallery,
  dataViewType_referencing,
  setup,
} from '../test-utils';
import { resolveDataViewConfig } from './resolveDataViewConfig';

const { workspace_2 } = WorkspaceFixtures;

describe('resolveDataViewConfig', () => {
  beforeEach(() => {
    setup({});

    // Register an adapter claiming 'address:' references, naming the
    // workspace matched in when one is given.
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => id,
      match: (reference, workspaceId) => {
        if (!reference.startsWith('address:')) {
          return null;
        }

        const id = reference.slice('address:'.length);

        return {
          type: 'database-entry',
          id: workspaceId ? `${workspaceId}:${id}` : id,
        };
      },
    });
  });

  afterEach(async () => {
    await cleanup();
    ItemReferences.unregisterAdapter('database-entry');
  });

  it("resolves references through the view type's hook", () => {
    expect(
      resolveDataViewConfig(dataViewType_referencing.type, {
        data: { items: ['address:database-entry_one'] },
      }),
    ).toEqual({ data: { items: ['database-entry_one'] } });
  });

  it('resolves references in the given workspace', () => {
    expect(
      resolveDataViewConfig(
        dataViewType_referencing.type,
        { data: { items: ['address:database-entry_one'] } },
        workspace_2.id,
      ),
    ).toEqual({ data: { items: [`${workspace_2.id}:database-entry_one`] } });
  });

  it('drops references that cannot be resolved', () => {
    expect(
      resolveDataViewConfig(dataViewType_referencing.type, {
        data: { items: ['unknown', 'address:database-entry_one'] },
      }),
    ).toEqual({ data: { items: ['database-entry_one'] } });
  });

  it('passes configs of view types without the hook through unchanged', () => {
    const config = { data: { items: ['address:database-entry_one'] } };

    expect(resolveDataViewConfig(dataViewType_gallery.type, config)).toBe(
      config,
    );
  });

  it('passes configs of unregistered view types through unchanged', () => {
    const config = { options: {} };

    expect(resolveDataViewConfig('unregistered', config)).toBe(config);
  });
});
