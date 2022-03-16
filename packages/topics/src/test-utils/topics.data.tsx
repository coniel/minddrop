import React from 'react';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TopicView, TopicViewConfig, TopicViewInstance } from '../types';
import { generateTopic } from '../generateTopic';

const { htmlDrop1, textDrop1, textDrop2, textDrop3, textDrop4, imageDrop1 } =
  DROPS_TEST_DATA;

export interface TopicColumnsViewData {
  columns: Record<number, string[]>;
}

export type TopicColumnsView = TopicViewInstance & TopicColumnsViewData;

export const topicViewColumnsConfig: TopicViewConfig = {
  id: 'minddrop/topic-view-columns',
  component: () => <div />,
  name: 'Columns',
  description: 'Organise drops into a column based layout.',
  onCreate: () => {
    return {
      columns: { 0: [], 1: [], 2: [], 3: [] },
    };
  },
  onDelete: () => null,
  onAddDrops: () => null,
  onRemoveDrops: () => null,
};

export const topicViewWithoutCallbacksConfig: TopicViewConfig = {
  id: 'topics:no-callbacks',
  component: () => <div />,
  name: 'No callbacks',
  description: 'This view does not have any of the optional callbacks.',
};

export const unregisteredTopicViewConfig: TopicViewConfig = {
  id: 'topics:unregistered-view',
  component: () => <div />,
  name: 'Unregistered',
  description: 'This view is not registered.',
  onCreate: () => {
    return {
      columns: { 0: [], 1: [], 2: [], 3: [] },
    };
  },
  onDelete: () => null,
  onAddDrops: () => null,
  onRemoveDrops: () => null,
};

export const topicViewColumns: TopicView = {
  extension: 'topics',
  type: 'instance',
  ...topicViewColumnsConfig,
};

export const topicViewWithoutCallbacks: TopicView = {
  extension: 'topics',
  type: 'instance',
  ...topicViewWithoutCallbacksConfig,
};

export const unregisteredTopicView: TopicView = {
  extension: 'topics',
  type: 'instance',
  ...unregisteredTopicViewConfig,
};

export const tCoastalNavigationView: TopicColumnsView = {
  id: 't-coastal-navigation-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-coastal-navigation',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tCoastalNavigationView2: TopicColumnsView = {
  id: 't-coastal-navigation-view-2',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-coastal-navigation',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tOffshoreNavigationView: TopicColumnsView = {
  id: 't-offshore-navigation-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-offshore-navigation',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tNavigationView: TopicColumnsView = {
  id: 't-navigation-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-navigation',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tBoatsView: TopicColumnsView = {
  id: 't-boats-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-boats',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tAnchoringView: TopicColumnsView = {
  id: 't-anchoring-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-anchoring',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tSailingView: TopicColumnsView = {
  id: 't-sailing-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-sailing',
  columns: {
    0: [textDrop1.id, textDrop2.id],
    1: [textDrop3.id],
    2: [htmlDrop1.id],
    3: [],
  },
};

export const tSailingView2: TopicColumnsView = {
  id: 't-sailing-view-2',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-sailing',
  columns: {
    0: [textDrop1.id, textDrop2.id],
    1: [textDrop3.id],
    2: [htmlDrop1.id],
    3: [],
  },
};

export const tUntitledView: TopicColumnsView = {
  id: 't-untitled-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-untitled',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tNoDropsView: TopicColumnsView = {
  id: 't-no-drops-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-no-drops',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tTwoDropsView: TopicColumnsView = {
  id: 't-two-drops-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-two-drops',
  columns: {
    0: [textDrop1.id],
    1: [textDrop2.id],
    2: [],
    3: [],
  },
};

export const tSixDropsView: TopicColumnsView = {
  id: 't-six-drops-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-six-drops',
  columns: {
    0: [textDrop1.id, textDrop2.id],
    1: [textDrop3.id],
    2: [textDrop4.id, htmlDrop1.id],
    3: [imageDrop1.id],
  },
};

export const tEmptyView: TopicColumnsView = {
  id: 't-empty-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'minddrop/topic-view-columns',
  topic: 't-empty',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tCoastalNavigation = generateTopic({
  id: 't-coastal-navigation',
  title: 'Coastal navigation',
  parents: [{ type: 'topic', id: 't-navigation' }],
  views: [tCoastalNavigationView.id, tCoastalNavigationView2.id],
});

export const tOffshoreNavigation = generateTopic({
  id: 't-offshore-navigation',
  title: 'Offshore navigation',
  parents: [{ type: 'topic', id: 't-navigation' }],
  views: [tOffshoreNavigationView.id],
});

export const tNavigation = generateTopic({
  id: 't-navigation',
  title: 'Navigation',
  parents: [{ type: 'topic', id: 't-sailing' }],
  subtopics: [tCoastalNavigation.id, tOffshoreNavigation.id],
  views: [tNavigationView.id],
});

export const tBoats = generateTopic({
  id: 't-boats',
  title: 'Boats',
  parents: [{ type: 'topic', id: 't-sailing' }],
  views: [tBoatsView.id],
});

export const tAnchoring = generateTopic({
  id: 't-anchoring',
  title: 'Anchoring',
  parents: [{ type: 'topic', id: 't-sailing' }],
  views: [tAnchoringView.id],
});

export const tSailing = generateTopic({
  id: 't-sailing',
  title: 'Sailing',
  subtopics: [tNavigation.id, tBoats.id, tAnchoring.id],
  views: [tSailingView.id, tSailingView2.id],
  drops: [textDrop1.id, textDrop2.id, textDrop3.id, htmlDrop1.id],
});

export const tUntitled = generateTopic({
  id: 't-untitled',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  views: [tUntitledView.id],
});

export const tNoDrops = generateTopic({
  id: 't-no-drops',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  views: [tNoDropsView.id],
});

export const tTwoDrops = generateTopic({
  id: 't-two-drops',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Sailing',
  views: [tTwoDropsView.id],
  drops: [textDrop1.id, textDrop2.id],
});

export const tSixDrops = generateTopic({
  id: 't-six-drops',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Sailing',
  views: [tSixDropsView.id],
  drops: [
    textDrop1.id,
    textDrop2.id,
    textDrop3.id,
    textDrop4.id,
    htmlDrop1.id,
    imageDrop1.id,
  ],
});

export const tEmpty = generateTopic({
  id: 't-empty',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  views: [tEmptyView.id],
});

export const rootTopicIds = [tSailing.id, tUntitled.id];

export const topics = [
  tCoastalNavigation,
  tOffshoreNavigation,
  tNavigation,
  tBoats,
  tAnchoring,
  tSailing,
  tUntitled,
  tNoDrops,
  tTwoDrops,
  tSixDrops,
  tEmpty,
];

export const topicViewInstances = [
  tCoastalNavigationView,
  tCoastalNavigationView2,
  tOffshoreNavigationView,
  tNavigationView,
  tBoatsView,
  tAnchoringView,
  tSailingView,
  tSailingView2,
  tUntitledView,
  tNoDropsView,
  tTwoDropsView,
  tSixDropsView,
  tEmptyView,
];

export const trail = [tSailing.id, tNavigation.id, tCoastalNavigation.id];

export const topicViewConfigs = [
  topicViewColumnsConfig,
  topicViewWithoutCallbacksConfig,
];
