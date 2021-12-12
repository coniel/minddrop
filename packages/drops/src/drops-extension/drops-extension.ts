import { Core } from '@minddrop/core';
import { Drops } from '../Drops';
import { Drop } from '../types';
import { useDropsStore } from '../useDropsStore';

export function onRun(core: Core) {
  // Listen to drops:load events and load drops into the store
  Drops.addEventListener(core, 'drops:load', (payload) =>
    useDropsStore.getState().loadDrops(payload.data),
  );

  // Listen to drops:clear events and clear the store
  Drops.addEventListener(core, 'drops:clear', useDropsStore.getState().clear);

  // Listen to drops:create events and add new drops to the store
  Drops.addEventListener(core, 'drops:create', (payload) =>
    useDropsStore.getState().addDrop(payload.data),
  );

  // Listen to drops:update events and update drops in the store
  Drops.addEventListener(core, 'drops:update', (payload) =>
    useDropsStore
      .getState()
      .updateDrop(payload.data.before.id, payload.data.after),
  );

  // Listen to drops:delete-permanently events and remove drops from the store
  Drops.addEventListener(core, 'drops:delete-permanently', (payload) =>
    useDropsStore.getState().removeDrop(payload.data.id),
  );

  // Register the drops:drop resource
  core.registerResource<Drop>({
    type: 'drops:drop',
    createEvent: 'drops:create',
    updateEvent: 'drops:update',
    deleteEvent: 'drops:delete-permanently',
    onLoad: (drops) => useDropsStore.getState().loadDrops(drops),
    onChange: (drop, deleted) => {
      const store = useDropsStore.getState();
      if (deleted) {
        store.removeDrop(drop.id);
      } else {
        store.loadDrops([drop]);
      }
    },
  });
}

export function onDisable(core: Core) {
  // Clear the store
  useDropsStore.getState().clear();
  // Remove event listeners
  core.removeAllEventListeners();
}
