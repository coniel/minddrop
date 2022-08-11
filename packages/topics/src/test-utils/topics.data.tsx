import React from 'react';
import {
  TRDDataSchema,
  Resources,
  ResourceFieldValidator,
} from '@minddrop/resources';
import { ArrayValidator } from '@minddrop/utils';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TopicViewConfig, TopicViewInstance, Topic } from '../types';

const { drop1, drop2, drop3, drop4, drop5, drop6 } = DROPS_TEST_DATA;

export interface TopicColumnsViewData {
  columns: Record<number, string[]>;
}

export type TopicColumnsView = TopicViewInstance & TopicColumnsViewData;

const columnValidator: ArrayValidator<ResourceFieldValidator> = {
  type: 'array',
  allowEmpty: true,
  items: {
    type: 'string',
  },
};

export const columnsViewDataSchema: TRDDataSchema<{}, TopicColumnsViewData> = {
  columns: {
    type: 'object',
    schema: {
      0: columnValidator,
      1: columnValidator,
      2: columnValidator,
      3: columnValidator,
      4: columnValidator,
      5: columnValidator,
      6: columnValidator,
      7: columnValidator,
      8: columnValidator,
    },
  },
};

export const topicViewColumnsConfig: TopicViewConfig = {
  id: 'minddrop:topic-view:columns',
  component: () => <div />,
  dataSchema: columnsViewDataSchema,
  name: 'Columns',
  description: 'Organise drops into a column based layout.',
  initializeData: () => {
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
  dataSchema: columnsViewDataSchema,
  name: 'No callbacks',
  description: 'This view does not have any of the optional callbacks.',
};

export const unregisteredTopicViewConfig: TopicViewConfig = {
  id: 'topics:unregistered-view',
  dataSchema: columnsViewDataSchema,
  component: () => <div />,
  name: 'Unregistered',
  description: 'This view is not registered.',
  initializeData: () => {
    return {
      columns: { 0: [], 1: [], 2: [], 3: [] },
    };
  },
  onDelete: () => null,
  onAddDrops: () => null,
  onRemoveDrops: () => null,
};

export const tCoastalNavigationView: TopicColumnsView = {
  id: 't-coastal-navigation-view',
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
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
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
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
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
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
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
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
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
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
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
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
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
  topic: 't-sailing',
  columns: {
    0: [drop1.id, drop2.id],
    1: [drop3.id],
    2: [drop5.id],
    3: [],
  },
};

export const tSailingView2: TopicColumnsView = {
  id: 't-sailing-view-2',
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
  topic: 't-sailing',
  columns: {
    0: [drop1.id, drop2.id],
    1: [drop3.id],
    2: [drop5.id],
    3: [],
  },
};

export const tUntitledView: TopicColumnsView = {
  id: 't-untitled-view',
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
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
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
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
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
  topic: 't-two-drops',
  columns: {
    0: [drop1.id],
    1: [drop2.id],
    2: [],
    3: [],
  },
};

export const tSixDropsView: TopicColumnsView = {
  id: 't-six-drops-view',
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
  topic: 't-six-drops',
  columns: {
    0: [drop1.id, drop2.id],
    1: [drop3.id],
    2: [drop4.id, drop5.id],
    3: [drop6.id],
  },
};

export const tEmptyView: TopicColumnsView = {
  id: 't-empty-view',
  extension: 'views',
  resource: 'views:view-instance',
  revision: 'rev-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  parents: [],
  type: 'minddrop:topic-view:columns',
  topic: 't-empty',
  columns: {
    0: [],
    1: [],
    2: [],
    3: [],
  },
};

const defaultData = {
  title: '',
  subtopics: [],
  archivedSubtopics: [],
  drops: [],
  archivedDrops: [],
  views: [],
  tags: [],
};

export const tCoastalNavigation: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: 'Coastal navigation',
    views: [tCoastalNavigationView.id, tCoastalNavigationView2.id],
  }),
  parents: [{ resource: 'topics:topic', id: 't-navigation' }],
  id: 't-coastal-navigation',
};

export const tOffshoreNavigation: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: 'Offshore navigation',
    views: [tOffshoreNavigationView.id],
  }),
  parents: [{ resource: 'topics:topic', id: 't-navigation' }],
  id: 't-offshore-navigation',
};

export const tNavigation: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: 'Navigation',
    subtopics: [tCoastalNavigation.id, tOffshoreNavigation.id],
    views: [tNavigationView.id],
  }),
  parents: [{ resource: 'topics:topic', id: 't-sailing' }],
  id: 't-navigation',
};

export const tBoats: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: 'Boats',
    views: [tBoatsView.id],
  }),
  parents: [{ resource: 'topics:topic', id: 't-sailing' }],
  id: 't-boats',
};

export const tAnchoring: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: 'Anchoring',
    views: [tAnchoringView.id],
  }),
  parents: [{ resource: 'topics:topic', id: 't-sailing' }],
  id: 't-anchoring',
};

export const tSailing: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: 'Sailing',
    subtopics: [tNavigation.id, tBoats.id, tAnchoring.id],
    views: [tSailingView.id, tSailingView2.id],
    drops: [drop1.id, drop2.id, drop3.id, drop5.id],
  }),
  id: 't-sailing',
};

export const tUntitled: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: '',
    views: [tUntitledView.id],
  }),
  id: 't-untitled',
};

export const tNoDrops: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: 'No drops',
    views: [tNoDropsView.id],
  }),
  id: 't-no-drops',
};

export const tTwoDrops: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: 'Two drops',
    views: [tTwoDropsView.id],
    drops: [drop1.id, drop2.id],
  }),
  id: 't-two-drops',
};

export const tSixDrops: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    title: 'Six drops',
    views: [tSixDropsView.id],
    drops: [drop1.id, drop2.id, drop3.id, drop4.id, drop5.id, drop6.id],
  }),
  id: 't-six-drops',
};

export const tEmpty: Topic = {
  ...Resources.generateDocument('topics:topic', {
    ...defaultData,
    views: [tEmptyView.id],
  }),
  id: 't-empty',
};

export const rootTopicIds = [
  tSailing.id,
  tUntitled.id,
  tTwoDrops.id,
  tSixDrops.id,
];

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
