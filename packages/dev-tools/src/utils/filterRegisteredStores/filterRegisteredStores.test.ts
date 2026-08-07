import { describe, expect, it } from 'vitest';
import { RegisteredStore } from '@minddrop/stores';
import { RegisteredStoreGroup } from '../../types';
import { filterRegisteredStores } from './filterRegisteredStores';

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

const databases: RegisteredStoreGroup = {
  namespace: 'Databases',
  stores: [databasesStore, entriesStore],
};
const views: RegisteredStoreGroup = {
  namespace: 'Views',
  stores: [viewsStore],
};

const groups = [databases, views];

describe('filterRegisteredStores', () => {
  it('returns every group without search text', () => {
    expect(filterRegisteredStores(groups, '  ')).toEqual(groups);
  });

  it('keeps only the matching stores, ignoring case', () => {
    expect(filterRegisteredStores(groups, 'ENTRIES')).toEqual([
      { namespace: 'Databases', stores: [entriesStore] },
    ]);
  });

  it('drops groups without a matching store', () => {
    expect(filterRegisteredStores(groups, 'registered')).toEqual([views]);
  });

  it('keeps every store of a group whose namespace matches', () => {
    expect(filterRegisteredStores(groups, 'databases')).toEqual([databases]);
  });

  it('returns nothing when no store matches', () => {
    expect(filterRegisteredStores(groups, 'nothing')).toEqual([]);
  });
});
