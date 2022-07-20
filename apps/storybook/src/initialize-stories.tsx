import React from 'react';
import { initializeCore } from '@minddrop/core';
import * as TopicsExtension from '@minddrop/topics';
import * as DropsExtension from '@minddrop/drops';
import * as ViewExtension from '@minddrop/views';
import * as AppExtension from '@minddrop/app';
import * as RichTextExtension from '@minddrop/rich-text';
import ExtensionTextDrop from '@minddrop/text-drop';
import ExtensionTopicViewColumns, {
  TOPIC_VIEW_COLUMNS_TEST_DATA,
} from '@minddrop/topic-view-columns';
import { TOPICS_TEST_DATA, Topics } from '@minddrop/topics';
import { DROPS_TEST_DATA, Drops } from '@minddrop/drops';
import { ExtensionConfig, Extensions } from '@minddrop/extensions';
import {
  ViewConfig,
  Views,
  ViewInstances,
  VIEWS_TEST_DATA,
} from '@minddrop/views';
import {
  GlobalPersistentStore,
  LocalPersistentStore,
} from '@minddrop/persistent-store';
import {
  RichTextDocuments,
  RichTextElements,
  RICH_TEXT_TEST_DATA,
} from '@minddrop/rich-text';
import { registerDefaultRichTextElementTypes } from '@minddrop/rich-text-editor';

const { rootTopicIds, topics, topicViewInstances } = TOPICS_TEST_DATA;

const { richTextElements, richTextDocuments, richTextDocument1 } =
  RICH_TEXT_TEST_DATA;

const topicIds = topics.map((topic) => topic.id);

const core = initializeCore({ appId: 'app', extensionId: 'app' });

const homeViewConfig: ViewConfig = {
  id: 'app:home',
  type: 'static',
  component: () => <div>Home view</div>,
};

Views.register(core, homeViewConfig);

VIEWS_TEST_DATA.viewConfigs.forEach((config) => Views.register(core, config));
ViewInstances.store.load(core, [
  ...VIEWS_TEST_DATA.viewInstances,
  ...topicViewInstances,
]);

DropsExtension.onRun(core);
ViewExtension.onRun(core);
TopicsExtension.onRun(core);
RichTextExtension.onRun(core);

Drops.store.load(
  core,
  DROPS_TEST_DATA.drops.map((drop) => {
    // Remove default text data
    const dropWithoutText = { ...drop };
    delete dropWithoutText.text;

    return {
      ...dropWithoutText,
      richTextDocument: richTextDocument1.id,
      parents: [
        {
          resource: 'topics:topic',
          id: TOPIC_VIEW_COLUMNS_TEST_DATA.topicViewColumnsInstance.topic,
        },
      ],
    };
  }),
);
Topics.store.load(core, TOPICS_TEST_DATA.topics);
ViewInstances.store.load(core, [
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

// Register default rich text element types
registerDefaultRichTextElementTypes(core);

// Load rich text elements
RichTextElements.store.load(core, richTextElements);

// Load rich text documents
RichTextDocuments.store.load(core, richTextDocuments);

AppExtension.onRun(core);
GlobalPersistentStore.set(core, 'rootTopics', rootTopicIds);
LocalPersistentStore.set(core, 'sidebarWidth', 300);
LocalPersistentStore.set(core, 'expandedTopics', []);
LocalPersistentStore.set(
  core,
  'view',
  TOPIC_VIEW_COLUMNS_TEST_DATA.topicViewColumnsInstance.type,
);
LocalPersistentStore.set(
  core,
  'viewInstance',
  TOPIC_VIEW_COLUMNS_TEST_DATA.topicViewColumnsInstance.id,
);
