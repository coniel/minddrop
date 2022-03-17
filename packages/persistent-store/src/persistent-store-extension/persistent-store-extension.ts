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
      const doc = docs[0] || {};
      usePersistentStore.getState().load('global', doc);
    },
  });

  // Register local store resource
  core.registerResource<PersistentStoreDocument>({
    type: 'persistent-store:local-stores',
    createEvent: 'persistent-store:create-local',
    updateEvent: 'persistent-store:update-local',
    onLoad: (docs) => {
      const doc = docs.find((d) => d.id === core.appId) || {};

      usePersistentStore.getState().load('local', doc);
    },
  });
}
