import { Topic } from '@minddrop/topics';
import { TopicViewProps } from '../components/TopicView';

export const tCoastalNavigationView: TopicViewProps = {
  id: 't-coastal-navigation-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'app:topic',
  topicId: 't-coastal-navigation',
};

export const tOffshoreNavigationView: TopicViewProps = {
  id: 't-offshore-navigation-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'app:topic',
  topicId: 't-offshore-navigation',
};

export const tNavigationView: TopicViewProps = {
  id: 't-navigation-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'app:topic',
  topicId: 't-navigation',
};

export const tBoatsView: TopicViewProps = {
  id: 't-boats-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'app:topic',
  topicId: 't-boats',
};

export const tAnchoringView: TopicViewProps = {
  id: 't-anchoring-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'app:topic',
  topicId: 't-anchoring',
};

export const tSailingView: TopicViewProps = {
  id: 't-sailing-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'app:topic',
  topicId: 't-sailing',
};

export const tUntitledView: TopicViewProps = {
  id: 't-untitled-view',
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 'app:topic',
  topicId: 't-untitled',
};

export const tCoastalNavigation: Topic = {
  id: 't-coastal-navigation',
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  title: 'Coastal navigation',
  subtopics: [],
  views: [tCoastalNavigationView.id],
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
  views: [tSailingView.id],
  drops: [],
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

export const topicViews = [
  tCoastalNavigationView,
  tOffshoreNavigationView,
  tNavigationView,
  tBoatsView,
  tAnchoringView,
  tSailingView,
  tUntitledView,
];
