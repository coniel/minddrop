import { initializeCore } from '@minddrop/core';
import { Resources } from '@minddrop/resources';
import { LocalPersistentStore } from '../LocalPersistentStore';
import { GlobalPersistentStore } from '../GlobalPersistentStore';
import {
  GlobalPersistentStoreDataSchema,
  LocalPersistentStoreDataSchema,
} from '../types';
import { LocalStoreResource } from '../LocalStoreResource';
import { GlobalStoreResource } from '../GlobalStoreResource';

export const core = initializeCore({
  appId: 'app',
  extensionId: 'persistent-store',
});

export interface StoreData {
  foo: string;
  bar?: number;
  baz?: number;
}

export const coreA1 = initializeCore({
  appId: 'app-1',
  extensionId: 'extension:a',
});
export const coreA2 = initializeCore({
  appId: 'app-2',
  extensionId: 'extension:a',
});
export const coreB1 = initializeCore({
  appId: 'app-1',
  extensionId: 'extension:b',
});
export const coreB2 = initializeCore({
  appId: 'app-2',
  extensionId: 'extension:b',
});
export const coreC1 = initializeCore({
  appId: 'app-1',
  extensionId: 'extension:c',
});
export const coreC2 = initializeCore({
  appId: 'app-2',
  extensionId: 'extension:c',
});

export const storeDataSchema: LocalPersistentStoreDataSchema<StoreData> = {
  foo: {
    type: 'string',
    required: true,
  },
  bar: {
    type: 'number',
    required: false,
  },
  baz: {
    type: 'string',
    required: false,
  },
};

export const storeDefaultData: StoreData = {
  foo: 'foo',
  bar: 1234,
};

function generateStoreDocuments(scope: string) {
  const documents = [
    ...[coreA1, coreA2].map((core) =>
      Resources.generateDocument(`persistent-stores:${scope}`, {
        ...storeDefaultData,
        type: core.extensionId,
        app: core.appId,
        extension: core.extensionId,
      }),
    ),
    ...[coreB1, coreB2].map((core) =>
      Resources.generateDocument(`persistent-stores:${scope}`, {
        ...storeDefaultData,
        type: core.extensionId,
        app: core.appId,
        extension: core.extensionId,
      }),
    ),
  ];

  if (scope === 'global') {
    return documents.map((document) => {
      const applessDocument = { ...document };
      delete applessDocument.app;
      return applessDocument;
    });
  }

  return documents;
}

export function setup() {
  // Initialize test local stores
  LocalStoreResource.register(coreA1, {
    type: coreA1.extensionId,
    dataSchema: storeDataSchema,
  });
  LocalStoreResource.register(coreB1, {
    type: coreB1.extensionId,
    dataSchema: storeDataSchema,
  });
  LocalStoreResource.register(coreC1, {
    type: coreC1.extensionId,
    dataSchema: storeDataSchema,
  });
  LocalStoreResource.store.load(coreA1, generateStoreDocuments('local'));

  // Initialize test global stores
  GlobalStoreResource.register(coreA1, {
    type: coreA1.extensionId,
    dataSchema: storeDataSchema as GlobalPersistentStoreDataSchema<StoreData>,
  });
  GlobalStoreResource.register(coreB1, {
    type: coreB1.extensionId,
    dataSchema: storeDataSchema as GlobalPersistentStoreDataSchema<StoreData>,
  });
  GlobalStoreResource.register(coreC1, {
    type: coreC1.extensionId,
    dataSchema: storeDataSchema as GlobalPersistentStoreDataSchema<StoreData>,
  });
  GlobalStoreResource.store.load(coreA1, generateStoreDocuments('global'));
}

export function cleanup() {
  // Clear the local persistent store
  LocalPersistentStore.store.clear();
  LocalPersistentStore.typeConfigsStore.clear();
  // Clear the global persistent store
  GlobalPersistentStore.store.clear();
  GlobalPersistentStore.typeConfigsStore.clear();
}
