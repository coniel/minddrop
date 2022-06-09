import { RDDataSchema, Resources } from '@minddrop/resources';
import { TopicData, CreateTopicData, UpdateTopicData } from './types';

const dataSchema: RDDataSchema<TopicData> = {
  title: {
    type: 'string',
    required: true,
    allowEmpty: true,
  },
  subtopics: {
    type: 'resource-ids',
    resource: 'topics:topic',
    required: true,
    addAsParent: true,
  },
  archivedSubtopics: {
    type: 'resource-ids',
    resource: 'topics:topic',
    required: true,
    addAsParent: true,
  },
  drops: {
    type: 'resource-ids',
    resource: 'drops:drop',
    required: true,
    addAsParent: true,
  },
  archivedDrops: {
    type: 'resource-ids',
    resource: 'drops:drop',
    required: true,
    addAsParent: true,
  },
  views: {
    type: 'resource-ids',
    resource: 'views:view-instance',
    required: true,
    addAsParent: true,
  },
  tags: {
    type: 'resource-ids',
    resource: 'tags:tag',
    required: true,
  },
};

export const TopicsResource = Resources.create<
  TopicData,
  CreateTopicData,
  UpdateTopicData
>({
  resource: 'topics:topic',
  dataSchema,
  defaultData: {
    title: '',
    subtopics: [],
    archivedSubtopics: [],
    drops: [],
    archivedDrops: [],
    views: [],
    tags: [],
  },
});
