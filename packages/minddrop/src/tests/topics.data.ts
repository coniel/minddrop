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

export const rootTopicIds = [tSailing.id];

export const topics = [
  tCoastalNavigation,
  tOffshoreNavigation,
  tNavigation,
  tBoats,
  tAnchoring,
  tSailing,
];
