import { Core, initializeCore } from '@minddrop/core';
import { PersistentStore } from '@minddrop/persistent-store';
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
 * @param topicId The ID of the topic to open.
 * @param viewInstanceId The ID of the topic view instance to open.
 */
export function openTopicView(
  core: Core,
  topicId: string,
  viewInstanceId?: string,
): void {
  // We need a core with 'app' as the extensionId for PersistentStore
  const appCore = initializeCore({ appId: core.appId, extensionId: 'app' });
  // Get the topic
  const topic = Topics.get(topicId);
  // The topic's default view instance
  const defaultView = topic.views[0];
  // The previously opened view for this topic
  const previousView = PersistentStore.getLocalValue(appCore, 'topicViews', {})[
    topicId
  ];

  if (viewInstanceId) {
    // If a view instance ID is specified, open that one
    App.openViewInstance(core, viewInstanceId);
  } else {
    // Open the topic's default (first) view instance
    App.openViewInstance(core, previousView || defaultView);
  }

  PersistentStore.setLocalValue(
    appCore,
    'topicViews',
    FieldValue.objectUnion({
      [topicId]: viewInstanceId || previousView || defaultView,
    }),
  );
}
