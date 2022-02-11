import React from 'react';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { Topic, TopicView, TopicViewConfig, TopicViewInstance } from '../types';

const { htmlDrop1, textDrop1, textDrop2, textDrop3 } = DROPS_TEST_DATA;

export interface TopicColumnsViewData {
  columns: Record<number, string[]>;
}

export type TopicColumnsView = TopicViewInstance & TopicColumnsViewData;

export const topicViewColumnsConfig: TopicViewConfig = {
  id: 'topics:columns-view',
  type: 'instance',
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
  type: 'instance',
  component: () => <div />,
  name: 'No callbacks',
  description: 'This view does not have any of the optional callbacks.',
};

export const unregisteredTopicViewConfig: TopicViewConfig = {
  id: 'topics:unregistered-view',
  type: 'instance',
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
  ...topicViewColumnsConfig,
};

export const topicViewWithoutCallbacks: TopicView = {
  extension: 'topics',
  ...topicViewWithoutCallbacksConfig,
};

export const unregisteredTopicView: TopicView = {
  extension: 'topics',
  ...unregisteredTopicViewConfig,
};

export const tCoastalNavigationView: TopicColumnsView = {
  id: 't-coastal-navigation-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'topics:columns-view',
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
  view: 'topics:columns-view',
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
  view: 'topics:columns-view',
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
  view: 'topics:columns-view',
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
  view: 'topics:columns-view',
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
  view: 'topics:columns-view',
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
  view: 'topics:columns-view',
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
  view: 'topics:columns-view',
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
  view: 'topics:columns-view',
  topic: 't-untitled',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

export const tCoastalNavigation: Topic = {
  id: 't-coastal-navigation',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Coastal navigation',
  subtopics: [],
  views: [tCoastalNavigationView.id, tCoastalNavigationView2.id],
  drops: [],
  tags: [],
};

export const tOffshoreNavigation: Topic = {
  id: 't-offshore-navigation',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Offshore navigation',
  subtopics: [],
  views: [tOffshoreNavigationView.id],
  drops: [],
  tags: [],
};

export const tNavigation: Topic = {
  id: 't-navigation',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Navigation',
  subtopics: [tCoastalNavigation.id, tOffshoreNavigation.id],
  views: [tNavigationView.id],
  drops: [],
  tags: [],
};

export const tBoats: Topic = {
  id: 't-boats',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Boats',
  subtopics: [],
  views: [tBoatsView.id],
  drops: [],
  tags: [],
};

export const tAnchoring: Topic = {
  id: 't-anchoring',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Anchoring',
  subtopics: [],
  views: [tAnchoringView.id],
  drops: [],
  tags: [],
};

export const tSailing: Topic = {
  id: 't-sailing',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Sailing',
  subtopics: [tNavigation.id, tBoats.id, tAnchoring.id],
  views: [tSailingView.id, tSailingView2.id],
  drops: [textDrop1.id, textDrop2.id, textDrop3.id, htmlDrop1.id],
  tags: [],
};

export const tUntitled: Topic = {
  id: 'topic-untitled',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: '',
  subtopics: [],
  views: [tUntitledView.id],
  drops: [],
  tags: [],
};

export const rootTopicIds = [tSailing.id, tUntitled.id];

export const topics = [
  tCoastalNavigation,
  tOffshoreNavigation,
  tNavigation,
  tBoats,
  tAnchoring,
  tSailing,
  tUntitled,
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
];

export const trail = [tSailing.id, tNavigation.id, tCoastalNavigation.id];

export const topicViewConfigs = [
  topicViewColumnsConfig,
  topicViewWithoutCallbacksConfig,
];
