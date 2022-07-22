import { Core } from '@minddrop/core';
import {
  GlobalPersistentStore,
  LocalPersistentStore,
  LocalPersistentStoreDataSchema,
  GlobalPersistentStoreDataSchema,
} from '@minddrop/persistent-store';
import { Topics } from '@minddrop/topics';
import { useAppStore } from '../useAppStore';
import { App } from '../App';
import { OpenViewEvent, OpenViewEventData } from '../types';

export interface LocalPersistentData {
  view: string;
  viewInstance: string | null;
  topicViews: Record<string, string>;
  topicTrail: string[];
  expandedTopics: string[];
  sidebarWidth: number;
}

export interface GlobalPersistentData {
  rootTopics: string[];
  archivedRootTopics: string[];
}

export const localPersistentDataSchema: LocalPersistentStoreDataSchema<LocalPersistentData> =
  {
    view: {
      type: 'string',
      allowEmpty: false,
    },
    viewInstance: {
      type: [
        { type: 'resource-id', resource: 'views:view-instance' },
        { type: 'null' },
      ],
    },
    topicViews: {
      type: 'record',
      values: {
        type: 'string',
        allowEmpty: false,
      },
    },
    topicTrail: {
      type: 'array',
      allowEmpty: true,
      items: {
        type: 'string',
      },
    },
    expandedTopics: {
      type: 'array',
      allowEmpty: true,
      items: {
        type: 'string',
      },
    },
    sidebarWidth: {
      type: 'number',
    },
  };

export const globalPersistentDataSchema: GlobalPersistentStoreDataSchema<GlobalPersistentData> =
  {
    rootTopics: {
      type: 'resource-ids',
      resource: 'topics:topic',
    },
    archivedRootTopics: {
      type: 'resource-ids',
      resource: 'topics:topic',
    },
  };

export function onRun(core: Core) {
  // Initialize the persistent stores
  LocalPersistentStore.initialize(core, localPersistentDataSchema, {
    view: 'app:home',
    viewInstance: null,
    topicViews: {},
    topicTrail: [],
    expandedTopics: [],
    sidebarWidth: 300,
  });
  GlobalPersistentStore.initialize(core, globalPersistentDataSchema, {
    rootTopics: [],
    archivedRootTopics: [],
  });

  // Get root topics from the global persistent store
  const rootTopics = GlobalPersistentStore.get(core, 'rootTopics', []);
  // Load root topics into app store
  useAppStore.getState().addRootTopics(rootTopics);

  const viewId = LocalPersistentStore.get<string>(core, 'view', 'app:home');
  const viewInstanceId = LocalPersistentStore.get<string>(
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
    'app:view:open',
    (payload) => {
      const { view, instance } = payload.data;

      // Save view and view instance to local persistent store
      LocalPersistentStore.set(core, 'view', view.id);
      LocalPersistentStore.set(
        core,
        'viewInstance',
        instance ? instance.id : null,
      );

      // Clear selection
      App.clearSelection(core);
    },
  );

  Topics.addEventListener(core, 'topics:topic:delete', ({ data }) => {
    // Get root topics
    const rootTopics = App.getRootTopics();

    // If the topic is a root topic, remove it from
    // root topics.
    if (rootTopics.find(({ id }) => data.id === id)) {
      App.removeRootTopics(core, [data.id]);
    }
  });
}

export function onDisable(core: Core) {
  // Remove all event listeners
  core.removeAllEventListeners();
  // Reset the store
  useAppStore.getState().clear();
}
