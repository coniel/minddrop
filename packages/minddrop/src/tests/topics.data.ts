import { ResourceView } from '@minddrop/app';
import { Topic } from '@minddrop/topics';

export const tCoastalNavigation: Topic = {
  id: 't-coastal-navigation',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Coastal navigation',
  subtopics: [],
  drops: [],
  tags: [],
};

export const tOffshoreNavigation: Topic = {
  id: 't-offshore-navigation',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Offshore navigation',
  subtopics: [],
  drops: [],
  tags: [],
};

export const tNavigation: Topic = {
  id: 't-navigation',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Navigation',
  subtopics: [tCoastalNavigation.id, tOffshoreNavigation.id],
  drops: [],
  tags: [],
};

export const tBoats: Topic = {
  id: 't-boats',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Boats',
  subtopics: [],
  drops: [],
  tags: [],
};

export const tAnchoring: Topic = {
  id: 't-anchoring',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Anchoring',
  subtopics: [],
  drops: [],
  tags: [],
};

export const tSailing: Topic = {
  id: 'topic-1',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Sailing',
  subtopics: [tNavigation.id, tBoats.id, tAnchoring.id],
  drops: [],
  tags: [],
};

export const tUntitled: Topic = {
  id: 'topic-untitled',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: '',
  subtopics: [],
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

export const tSailingView: ResourceView = {
  id: 'topic',
  title: tSailing.title,
  breadcrumbs: [
    {
      id: 'topic',
      title: tSailing.title,
      resource: {
        id: tSailing.id,
        type: 'topic',
      },
    },
  ],
  resource: {
    id: tSailing.id,
    type: 'topic',
  },
};

export const tNavigationView: ResourceView = {
  id: 'topic',
  title: tNavigation.title,
  breadcrumbs: [
    tSailingView,
    {
      id: 'topic',
      title: tNavigation.title,
      resource: {
        id: tNavigation.id,
        type: 'topic',
      },
    },
  ],
  resource: {
    id: tNavigation.id,
    type: 'topic',
  },
};

export const tCoastalNavigationView: ResourceView = {
  id: 'topic',
  title: tCoastalNavigation.title,
  breadcrumbs: [
    tSailingView,
    tNavigationView,
    {
      id: 'topic',
      title: tCoastalNavigation.title,
      resource: {
        id: tCoastalNavigation.id,
        type: 'topic',
      },
    },
  ],
  resource: {
    id: tCoastalNavigation.id,
    type: 'topic',
  },
};
