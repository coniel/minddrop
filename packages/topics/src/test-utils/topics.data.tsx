import React from 'react';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { View, Views } from '@minddrop/views';
import { Topic, TopicView, TopicViewInstance } from '../types';

const { htmlDrop1, textDrop1, textDrop2, textDrop3 } = DROPS_TEST_DATA;

export interface TopicColumnsView extends TopicViewInstance {
  columns: Record<number, string[]>;
}

export const view: View = {
  id: 'topics:columns-view',
  type: 'instance',
  component: () => <div />,
};

export const topicView: TopicView = {
  id: 'topic-view',
  view: view.id,
  name: 'Columns',
  description: 'Organise drops into a column based layout.',
  create: (core) => {
    const columnsView = Views.createInstance(core, {
      view: view.id,
      columns: [[], [], [], []],
    });

    return columnsView;
  },
  onDelete: () => null,
  onAddDrops: () => null,
  onRemoveDrops: () => null,
};

export const tCoastalNavigationView: TopicColumnsView = {
  id: 't-coastal-navigation-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'topics:columns-view',
  topicId: 't-coastal-navigation',
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
  topicId: 't-coastal-navigation',
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
  topicId: 't-offshore-navigation',
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
  topicId: 't-navigation',
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
  topicId: 't-boats',
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
  topicId: 't-anchoring',
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
  topicId: 't-sailing',
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
  topicId: 't-sailing',
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
  topicId: 't-untitled',
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

export const views = [view];

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
