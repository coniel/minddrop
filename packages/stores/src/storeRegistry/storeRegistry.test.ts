import { afterEach, describe, expect, it } from 'vitest';
import { StoreApi, UseBoundStore, create } from 'zustand';
import {
  dropWorkspaceRecords,
  registerStore,
  storeRegistry,
  subscribeToStoreRegistry,
} from './storeRegistry';

const useStore = create(() => ({})) as UseBoundStore<StoreApi<unknown>>;

afterEach(() => {
  delete storeRegistry['Test:Store'];
  delete storeRegistry['Test:Other'];
});

describe('registerStore', () => {
  it('adds the store to the registry', () => {
    registerStore('Test:Store', 'array', useStore);

    expect(storeRegistry['Test:Store']).toEqual({
      name: 'Test:Store',
      type: 'array',
      useStore,
    });
  });
});

describe('subscribeToStoreRegistry', () => {
  it('calls the callback when a store is registered', () => {
    const registered: string[] = [];
    const unsubscribe = subscribeToStoreRegistry(() => {
      registered.push(...Object.keys(storeRegistry));
    });

    registerStore('Test:Store', 'array', useStore);
    unsubscribe();

    expect(registered).toContain('Test:Store');
  });

  it('stops calling the callback once unsubscribed', () => {
    let callCount = 0;
    const unsubscribe = subscribeToStoreRegistry(() => {
      callCount += 1;
    });

    unsubscribe();
    registerStore('Test:Store', 'array', useStore);

    expect(callCount).toBe(0);
  });

  it('calls every subscriber', () => {
    let firstCalls = 0;
    let secondCalls = 0;
    const unsubscribeFirst = subscribeToStoreRegistry(() => {
      firstCalls += 1;
    });
    const unsubscribeSecond = subscribeToStoreRegistry(() => {
      secondCalls += 1;
    });

    registerStore('Test:Store', 'array', useStore);
    registerStore('Test:Other', 'object', useStore);
    unsubscribeFirst();
    unsubscribeSecond();

    expect(firstCalls).toBe(2);
    expect(secondCalls).toBe(2);
  });
});

describe('dropWorkspaceRecords', () => {
  it('drops the workspace from every store scoped by workspace', () => {
    const dropped: string[] = [];

    registerStore('Test:Store', 'array', useStore, (workspaceId) => {
      dropped.push(`store:${workspaceId}`);
    });
    registerStore('Test:Other', 'object', useStore, (workspaceId) => {
      dropped.push(`other:${workspaceId}`);
    });

    dropWorkspaceRecords('workspace-1');

    expect(dropped).toEqual(['store:workspace-1', 'other:workspace-1']);
  });

  it('skips stores which are not scoped by workspace', () => {
    registerStore('Test:Store', 'array', useStore);

    expect(() => dropWorkspaceRecords('workspace-1')).not.toThrow();
  });
});
