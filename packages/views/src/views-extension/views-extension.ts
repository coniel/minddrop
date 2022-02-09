import { Core } from '@minddrop/core';
import { clear } from '../clear';
import { loadViewInstances } from '../loadViewInstances';
import { ViewInstance } from '../types';
import { useViewsStore } from '../useViewsStore';

export function onRun(core: Core) {
  // Register the 'views:view-instance' resource
  core.registerResource<ViewInstance>({
    type: 'views:view-instance',
    createEvent: 'views:create-instance',
    updateEvent: 'views:update-instance',
    deleteEvent: 'views:delete-instance',
    onLoad: (viewInstances) => loadViewInstances(core, viewInstances),
    onChange: (viewInstance1, deleted) => {
      const store = useViewsStore.getState();
      if (deleted) {
        store.removeInstance(viewInstance1.id);
      } else {
        store.setInstance(viewInstance1);
      }
    },
  });
}

export function onDisable(core: Core) {
  // Clear the store
  clear(core);
  // Remove event listeners
  core.removeAllEventListeners();
}
