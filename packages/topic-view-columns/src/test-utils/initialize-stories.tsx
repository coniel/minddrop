import React from 'react';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { initializeCore } from '@minddrop/core';
import { topicViewColumnsConfig } from '../config';
import { topicViewColumnsInstance } from './topic-view-columns.data';
import { Views } from '@minddrop/views';
import { Drop } from '@minddrop/ui';
import { Extensions, EXTENSIONS_TEST_DATA } from '@minddrop/extensions';

const { topicExtension } = EXTENSIONS_TEST_DATA;
const { topics } = TOPICS_TEST_DATA;
const { dropTypeConfigs, drops } = DROPS_TEST_DATA;

// Initialize core instances
export const core = initializeCore({ appId: 'app', extensionId: 'app' });
const extensionCore = initializeCore({
  appId: 'app',
  extensionId: topicExtension.id,
});
const topicsCore = initializeCore({ appId: 'app', extensionId: 'topics' });
const viewsCore = initializeCore({ appId: 'app', extensionId: 'views' });

// Register drop types using the extensionCore so that
// they are tied to the extension
dropTypeConfigs.forEach((config) =>
  Drops.register(extensionCore, {
    ...config,
    component: ({ markdown }) => <Drop>{markdown}</Drop>,
  }),
);

// Register extension enabled for all topics
Extensions.register(core, {
  ...topicExtension,
  topics: topics.map((topic) => topic.id),
});

// Load test drops into drops store
Drops.load(core, drops);

// Load test topics into topics store
Topics.load(topicsCore, topics);

// Register the view
Topics.registerView(core, topicViewColumnsConfig);

// Load test view instances into the view store
Views.loadInstances(viewsCore, [topicViewColumnsInstance]);
