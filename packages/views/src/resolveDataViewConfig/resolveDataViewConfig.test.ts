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
import { resolveDataViewConfig } from './resolveDataViewConfig';

describe('resolveDataViewConfig', () => {
  beforeEach(() => {
    setup({});

    // Register an adapter claiming 'address:' references
    registerItemReferenceAdapter({
      type: 'database-entry',
      serialize: (id) => id,
      match: (reference) =>
        reference.startsWith('address:')
          ? { type: 'database-entry', id: reference.slice('address:'.length) }
          : null,
    });
  });

  afterEach(() => {
    cleanup();
    unregisterItemReferenceAdapter('database-entry');
  });

  it("resolves references through the view type's hook", () => {
    expect(
      resolveDataViewConfig(viewType_referencing.type, {
        data: { items: ['address:database-entry_one'] },
      }),
    ).toEqual({ data: { items: ['database-entry_one'] } });
  });

  it('drops references that cannot be resolved', () => {
    expect(
      resolveDataViewConfig(viewType_referencing.type, {
        data: { items: ['unknown', 'address:database-entry_one'] },
      }),
    ).toEqual({ data: { items: ['database-entry_one'] } });
  });

  it('passes configs of view types without the hook through unchanged', () => {
    const config = { data: { items: ['address:database-entry_one'] } };

    expect(resolveDataViewConfig(viewType_gallery.type, config)).toBe(config);
  });

  it('passes configs of unregistered view types through unchanged', () => {
    const config = { options: {} };

    expect(resolveDataViewConfig('unregistered', config)).toBe(config);
  });
});
