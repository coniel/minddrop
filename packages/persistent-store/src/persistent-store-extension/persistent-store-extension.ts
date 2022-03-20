import { Core } from '@minddrop/core';
import { PersistentStoreDocument } from '../types';
import { usePersistentStore } from '../usePersistentStore';

export function onRun(core: Core) {
  // Register global store resource
  core.registerResource<PersistentStoreDocument>({
    type: 'persistent-store:global-stores',
    createEvent: 'persistent-store:create-global',
    updateEvent: 'persistent-store:update-global',
    onLoad: (docs) => {
      // There is only one global store document in the database
      const doc = docs[0];

      if (doc) {
        // Load the global store into the store
        usePersistentStore.getState().load('global', doc);
      }
    },
  });

  // Register local store resource
  core.registerResource<PersistentStoreDocument>({
    type: 'persistent-store:local-stores',
    createEvent: 'persistent-store:create-local',
    updateEvent: 'persistent-store:update-local',
    onLoad: (docs) => {
      // Get the local store doc with the matching app ID
      const doc = docs.find((d) => d.id === core.appId);

      if (doc) {
        // Load the local store into the store
        usePersistentStore.getState().load('local', doc);
      }
    },
  });
}
