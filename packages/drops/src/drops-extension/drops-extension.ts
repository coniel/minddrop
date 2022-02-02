import { Core } from '@minddrop/core';
import { Drop } from '../types';
import { useDropsStore } from '../useDropsStore';

export function onRun(core: Core) {
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
        store.setDrop(drop);
      }
    },
  });
}

export function onDisable(core: Core) {
  // Clear the store
  useDropsStore.getState().clearDrops();
  useDropsStore.getState().clearRegistered();
  // Remove event listeners
  core.removeAllEventListeners();
}
