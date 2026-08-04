import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  registerItemReferenceAdapter,
  unregisterItemReferenceAdapter,
} from '@minddrop/item-references';
import {
  cleanup,
  setup,
  viewType_gallery,
  viewType_referencing,
} from '../test-utils';
import { serializeDataViewConfig } from './serializeDataViewConfig';

describe('serializeDataViewConfig', () => {
  beforeEach(() => {
    setup({});

    // Register an adapter converting entry IDs to addresses,
    // dropping the 'missing' entry
    registerItemReferenceAdapter({
      type: 'database-entry',
      serialize: (id) =>
        id === 'database-entry_missing' ? null : `address:${id}`,
      match: () => null,
    });
  });

  afterEach(() => {
    cleanup();
    unregisterItemReferenceAdapter('database-entry');
  });

  it("serializes references through the view type's hook", () => {
    expect(
      serializeDataViewConfig(viewType_referencing.type, {
        data: { items: ['database-entry_one'] },
      }),
    ).toEqual({ data: { items: ['address:database-entry_one'] } });
  });

  it('drops references that cannot be serialized', () => {
    expect(
      serializeDataViewConfig(viewType_referencing.type, {
        data: { items: ['database-entry_missing', 'database-entry_one'] },
      }),
    ).toEqual({ data: { items: ['address:database-entry_one'] } });
  });

  it('passes configs of view types without the hook through unchanged', () => {
    const config = { data: { items: ['database-entry_one'] } };

    expect(serializeDataViewConfig(viewType_gallery.type, config)).toBe(config);
  });

  it('passes configs of unregistered view types through unchanged', () => {
    const config = { options: {} };

    expect(serializeDataViewConfig('unregistered', config)).toBe(config);
  });
});
