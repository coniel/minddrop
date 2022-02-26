import { Core } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
import { useAppStore } from '../useAppStore';
import { App } from '../App';
import { OpenViewEvent, OpenViewEventData } from '../types';

export function onRun(core: Core) {
  // Get root topics from the global persistent store
  const rootTopics = PersistentStore.getGlobalValue(core, 'rootTopics', []);
  // Load root topics into app store
  useAppStore.getState().addRootTopics(rootTopics);

  const viewId = PersistentStore.getLocalValue<string>(
    core,
    'view',
    'app:home',
  );
  const viewInstanceId = PersistentStore.getLocalValue<string>(
    core,
    'viewInstance',
    null,
  );

  // Set the initial view from the local persistent store
  if (viewInstanceId) {
    App.openViewInstance(core, viewInstanceId);
  } else {
    App.openView(core, viewId);
  }

  core.addEventListener<OpenViewEvent, OpenViewEventData>(
    'app:open-view',
    (payload) => {
      const { view, instance } = payload.data;
      PersistentStore.setLocalValue(core, 'view', view.id);
      PersistentStore.setLocalValue(
        core,
        'viewInstance',
        instance ? instance.id : null,
      );
    },
  );
}

export function onDisable(core: Core) {
  // Remove all event listeners
  core.removeAllEventListeners();
  // Reset the store
  useAppStore.getState().clear();
}
