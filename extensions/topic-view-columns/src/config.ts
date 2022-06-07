import { TopicViewConfig } from '@minddrop/topics';
import { onAddDrops } from './onAddDrops';
import { onCreate } from './onCreate';
import { onRemoveDrops } from './onRemoveDrops';
import { TopicViewColumns } from './TopicViewColumns';
import { TopicViewColumnsData } from './types';

export const topicViewColumnsConfig: TopicViewConfig<TopicViewColumnsData> = {
  id: 'minddrop:topic-view:columns',
  name: 'Columns',
  description: 'Organise drops into columns.',
  component: TopicViewColumns,
  initializeData: onCreate,
  onAddDrops,
  onRemoveDrops,
  dataSchema: {
    columns: {
      type: 'array',
      items: {
        type: 'object',
        schema: {
          id: {
            type: 'string',
            required: true,
            allowEmpty: false,
          },
          items: {
            type: 'resource-references',
            required: true,
          },
        },
      },
    },
  },
};
