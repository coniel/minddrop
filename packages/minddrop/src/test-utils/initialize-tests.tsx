import { initializeCore } from '@minddrop/core';
import {
  LocalPersistentStore,
  GlobalPersistentStore,
} from '@minddrop/persistent-store';
import {
  ResourceDocument,
  ResourceStorageAdapterConfig,
} from '@minddrop/resources';
import { FileStorageApi } from '@minddrop/files';
import { BackendUtilsApi } from '@minddrop/utils';
import { cleanup as cleanupRender } from '@minddrop/test-utils';
import { TOPICS_TEST_DATA, TopicsResource } from '@minddrop/topics';
import { Views } from '@minddrop/views';
import { initializeApp, registerViews } from '../initializeApp';

const { rootTopicIds, topics } = TOPICS_TEST_DATA;

export const core = initializeCore({ appId: 'app', extensionId: 'app' });

export let database: Record<string, ResourceDocument> = {};

export const resourceStorageAdapter: ResourceStorageAdapterConfig = {
  id: 'test',
  getAll: async () => Object.values(database),
  create: async (doc) => {
    database[doc.id] = doc;
  },
  update: async (id, update) => {
    database[id] = update.after;
  },
  delete: async (doc) => {
    delete database[doc.id];
  },
};

export const fileStorageAdapter: FileStorageApi = {
  getUrl: jest.fn(),
  save: jest.fn(),
  download: jest.fn(),
};

export const backendUtilsAdapter: BackendUtilsApi = {
  getWebpageMedata: jest.fn(),
};

export async function setup() {
  // Register default views
  registerViews();

  // Load test topics
  TopicsResource.store.load(core, topics);

  await initializeApp({
    resourceStorageAdapter,
    fileStorageAdapter,
    backendUtilsAdapter,
    installedExtensions: [],
  });

  // Load persistent store data
  GlobalPersistentStore.set(core, 'rootTopics', rootTopicIds);
}

export function cleanup() {
  cleanupRender();
  // Clear persistent store data
  GlobalPersistentStore.store.clear();
  LocalPersistentStore.store.clear();

  // Clear views store
  Views.clear(core);

  // Clear the database
  database = {};
}
