import { ResourceReferences, Resources } from '@minddrop/resources';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { TopicViewColumnsInstance } from '../types';

const { tSixDrops } = TOPICS_TEST_DATA;
const { drop1, drop2, drop3, drop4 } = DROPS_TEST_DATA;

export const topicViewColumnsInstance: TopicViewColumnsInstance =
  Resources.generateDocument('views:view-instance', {
    extension: 'minddrop:topic-view:columns',
    type: 'minddrop:topic-view:columns',
    topic: tSixDrops.id,
    columns: [
      {
        id: 'column-0',
        items: [ResourceReferences.generate('drops:drop', drop1.id)],
      },
      {
        id: 'column-1',
        items: [
          ResourceReferences.generate('drops:drop', drop2.id),
          ResourceReferences.generate('drops:drop', drop3.id),
        ],
      },
      {
        id: 'column-2',
        items: [ResourceReferences.generate('drops:drop', drop4.id)],
      },
    ],
  });

export const emptyTopicViewColumnsInstance: TopicViewColumnsInstance =
  Resources.generateDocument('views:view-instance', {
    extension: 'minddrop:topic-view:columns',
    type: 'minddrop:topic-view:columns',
    topic: tSixDrops.id,
    columns: [
      {
        id: 'column-0',
        items: [],
      },
      {
        id: 'column-1',
        items: [],
      },
      {
        id: 'column-2',
        items: [],
      },
    ],
  });
