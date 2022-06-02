import { Core, initializeCore } from '@minddrop/core';
import { LocalPersistentStore } from '@minddrop/persistent-store';
import { Topics } from '@minddrop/topics';
import { FieldValue } from '@minddrop/utils';
import { App } from '../App';

/**
 * Opens the previously opened (or default) view instance of
 * a given topic.
 *
 * If an instance view ID is passed in, opens that view instance.
 *
 * @param core A MindDrop core instance.
 * @param trail The IDs of the topics leading up to and including the topic to open.
 * @param viewInstanceId The ID of the topic view instance to open.
 */
export function openTopicView(
  core: Core,
  trail: string[],
  viewInstanceId?: string,
): void {
  // The topic to open is the last one in the trail
  const topicId = trail.slice(-1)[0];
  // We need a core with 'app' as the extensionId for PersistentStore
  const appCore = initializeCore({ appId: core.appId, extensionId: 'app' });
  // Get the topic
  const topic = Topics.get(topicId);
  // The topic's default view instance
  const defaultView = topic.views[0];
  // The previously opened view for this topic
  const previousView = LocalPersistentStore.get(appCore, 'topicViews', {})[
    topicId
  ];

  if (viewInstanceId) {
    // If a view instance ID is specified, open that one
    App.openViewInstance(core, viewInstanceId);
  } else {
    // Open the topic's default (first) view instance
    App.openViewInstance(core, previousView || defaultView);
  }

  // Save the view instance as the topic's last opened
  // view instance in the local persistent store.
  LocalPersistentStore.set(
    appCore,
    'topicViews',
    FieldValue.objectUnion({
      [topicId]: viewInstanceId || previousView || defaultView,
    }),
  );

  // Save the trail in the local persistent store
  LocalPersistentStore.set(appCore, 'topicTrail', trail);
}
