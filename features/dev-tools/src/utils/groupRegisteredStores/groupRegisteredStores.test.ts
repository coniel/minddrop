import { describe, expect, it } from 'vitest';
import { RegisteredStore } from '@minddrop/stores';
import { groupRegisteredStores } from './groupRegisteredStores';

const useStore = (() => ({})) as RegisteredStore['useStore'];

const entriesStore: RegisteredStore = {
  name: 'Databases:Entries',
  type: 'array',
  useStore,
};
const databasesStore: RegisteredStore = {
  name: 'Databases:Databases',
  type: 'object',
  useStore,
};
const viewsStore: RegisteredStore = {
  name: 'Views:Registered',
  type: 'object',
  useStore,
};
const namelessStore: RegisteredStore = {
  name: 'App',
  type: 'key-value',
  useStore,
};

describe('groupRegisteredStores', () => {
  it('returns nothing for no stores', () => {
    expect(groupRegisteredStores([])).toEqual([]);
  });

  it('groups stores by namespace', () => {
    expect(
      groupRegisteredStores([entriesStore, viewsStore, databasesStore]),
    ).toEqual([
      { namespace: 'Databases', stores: [databasesStore, entriesStore] },
      { namespace: 'Views', stores: [viewsStore] },
    ]);
  });

  it('sorts groups by namespace', () => {
    expect(
      groupRegisteredStores([viewsStore, entriesStore]).map(
        (group) => group.namespace,
      ),
    ).toEqual(['Databases', 'Views']);
  });

  it('groups stores without a namespace under their name', () => {
    expect(groupRegisteredStores([namelessStore])).toEqual([
      { namespace: 'App', stores: [namelessStore] },
    ]);
  });
});
