import React from 'react';
import { initializeCore } from '@minddrop/core';
import * as TopicsExtension from '@minddrop/topics';
import * as DropsExtension from '@minddrop/drops';
import * as ViewExtension from '@minddrop/views';
import * as AppExtension from '@minddrop/app';
import * as PersistentStoreExtension from '@minddrop/persistent-store';
import ExtensionTextDrop from '@minddrop/text-drop';
import ExtensionTopicViewColumns, {
  TOPIC_VIEW_COLUMNS_TEST_DATA,
} from '@minddrop/topic-view-columns';
import { TOPICS_TEST_DATA, Topics } from '@minddrop/topics';
import { DROPS_TEST_DATA, Drops } from '@minddrop/drops';
import { ExtensionConfig, Extensions } from '@minddrop/extensions';
import { ViewConfig, Views, VIEWS_TEST_DATA } from '@minddrop/views';
import { PersistentStore } from '@minddrop/persistent-store';
import {
  RichTextDocuments,
  RichTextElements,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import {
  ParagraphElementConfig,
  HeadingOneElementConfig,
  ToDoElementConfig,
} from '@minddrop/rich-text-editor';

const { rootTopicIds, topics } = TOPICS_TEST_DATA;

const { richTextElements, richTextDocuments, richTextDocument1 } =
  RICH_TEXT_TEST_DATA;

const topicIds = topics.map((topic) => topic.id);

const core = initializeCore({ appId: 'app', extensionId: 'app' });
const globalPersistentStore = { rootTopics: rootTopicIds };
const localPersistentStore = {
  sidebarWidth: 302,
  expandedTopics: [],
  view: TOPIC_VIEW_COLUMNS_TEST_DATA.topicViewColumnsInstance.view,
  viewInstance: TOPIC_VIEW_COLUMNS_TEST_DATA.topicViewColumnsInstance.id,
};

const homeViewConfig: ViewConfig = {
  id: 'app:home',
  type: 'static',
  component: () => <div>Home view</div>,
};

Views.register(core, homeViewConfig);

VIEWS_TEST_DATA.viewConfigs.forEach((config) => Views.register(core, config));
Views.loadInstances(core, VIEWS_TEST_DATA.viewInstances);

PersistentStoreExtension.onRun(core);
DropsExtension.onRun(core);
ViewExtension.onRun(core);
TopicsExtension.onRun(core);

PersistentStore.setGlobalStore(core, globalPersistentStore);
PersistentStore.setLocalStore(core, localPersistentStore);

Drops.load(
  core,
  DROPS_TEST_DATA.drops.map((drop) => ({
    ...drop,
    richTextDocument: richTextDocument1.id,
    parents: [
      {
        type: 'topic',
        id: TOPIC_VIEW_COLUMNS_TEST_DATA.topicViewColumnsInstance.topic,
      },
    ],
  })),
);
Topics.load(core, TOPICS_TEST_DATA.topics);
Views.loadInstances(core, [
  TOPIC_VIEW_COLUMNS_TEST_DATA.topicViewColumnsInstance,
]);

([ExtensionTopicViewColumns, ExtensionTextDrop] as ExtensionConfig[]).forEach(
  (extension) => {
    const core = initializeCore({ appId: 'app', extensionId: extension.id });
    Extensions.register(core, extension);

    if (extension.onRun) {
      extension.onRun(core);
    }

    Extensions.enableOnTopics(core, extension.id, topicIds);
  },
);

// Register element types
[ParagraphElementConfig, HeadingOneElementConfig, ToDoElementConfig].forEach(
  (config) => {
    RichTextElements.register(core, config);
  },
);

// Load rich text elements
RichTextElements.load(core, richTextElements);

// Load rich text documents
RichTextDocuments.load(core, richTextDocuments);

AppExtension.onRun(core);
