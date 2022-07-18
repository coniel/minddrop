import { act, cleanup as cleanupRender } from '@minddrop/test-utils';
import { Topic, Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { initializeCore } from '@minddrop/core';
import { ViewInstances, ViewConfig, Views } from '@minddrop/views';
import {
  ExtensionConfig,
  Extensions,
  EXTENSIONS_TEST_DATA,
} from '@minddrop/extensions';
import * as AppExtension from '@minddrop/app';
import * as DropsExtension from '@minddrop/drops';
import * as TopicsExtension from '@minddrop/topics';
import * as ViewsExtension from '@minddrop/views';
import * as ExtensionsExtension from '@minddrop/extensions';
import { Extension } from '../topic-view-columns-extension';
import { topicViewColumnsConfig } from '../config';
import {
  topicViewColumnsInstance,
  emptyTopicViewColumnsInstance,
} from './topic-view-columns.data';

const { topicExtension } = EXTENSIONS_TEST_DATA;
const { tSixDrops, topicViewInstances } = TOPICS_TEST_DATA;
const { dropTypeConfigs, dropConfig, drops } = DROPS_TEST_DATA;

export const topicWithView: Topic = {
  ...tSixDrops,
  views: [topicViewColumnsInstance.id],
};

// Initialize core instances
export const core = initializeCore({ appId: 'app', extensionId: 'app' });

const textDropExtension: ExtensionConfig = {
  id: 'text-drop',
  name: 'Text drop',
  description: 'Adds a text drop type',
  scopes: ['topic'],
  onRun: (core) => {
    Drops.register(core, { ...dropConfig, type: 'test-text-drop' });
  },
};

export const homeViewConfig: ViewConfig = {
  id: 'app:home',
  type: 'static',
  component: jest.fn(),
};

export function setup() {
  act(() => {
    Views.register(core, homeViewConfig);
    // Run core extensions
    ExtensionsExtension.onRun(core);
    AppExtension.onRun(core);
    ViewsExtension.onRun(core);
    DropsExtension.onRun(core);
    TopicsExtension.onRun(core);

    // Register drop types using the extensionCore so that
    // they are tied to the extension
    dropTypeConfigs.forEach((config) => Drops.register(core, config));

    // Register extensions
    Extensions.register(core, topicExtension);
    Extensions.register(core, textDropExtension);
    Extensions.register(core, Extension);
    Extension.onRun(core);
    textDropExtension.onRun({ ...core, extensionId: textDropExtension.id });

    // Load test drops into drops store
    Drops.store.load(core, drops);

    // Load test topics into topics store
    Topics.store.load(core, [topicWithView]);

    // Register test views
    [topicViewColumnsConfig].forEach((config) =>
      Topics.registerView(core, config),
    );

    // Load test view instances into the view store
    ViewInstances.store.load(core, [
      ...topicViewInstances.filter(
        (instance) => instance.id !== topicViewColumnsInstance.id,
      ),
      topicViewColumnsInstance,
      emptyTopicViewColumnsInstance,
    ]);

    // Enable extensions on the topic
    Extensions.enableOnTopics(core, topicExtension.id, [topicWithView.id]);
    Extensions.enableOnTopics(core, textDropExtension.id, [topicWithView.id]);
    Extensions.enableOnTopics(core, Extension.id, [topicWithView.id]);
  });
}

export function cleanup() {
  act(() => {
    core.removeAllEventListeners();

    // React testing library cleanup
    cleanupRender();

    AppExtension.onDisable(core);
    DropsExtension.onDisable(core);
    TopicsExtension.onDisable(core);
    ViewsExtension.onDisable(core);
    ExtensionsExtension.onDisable(core);
  });
}
