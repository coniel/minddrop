import { Core } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { useAppStore } from '../useAppStore';
import { App } from '../App';
import { OpenViewEvent, OpenViewEventData, View } from '../types';

export function onRun(core: Core) {
  const view = PersistentStore.getLocalValue<View>(core, 'view', {
    id: 'home',
    title: 'Home',
  });

  // Set the initial view from the local
  // persistent store
  App.openView(core, view);

  core.addEventListener<OpenViewEvent, OpenViewEventData>(
    'app:open-view',
    (payload) => {
      PersistentStore.setLocalValue(core, 'view', payload.data);
    },
  );
}

export function onDisable(core: Core) {
  // Remove all event listeners
  core.removeAllEventListeners();
  // Reset the store
  useAppStore.getState().clear();
}
