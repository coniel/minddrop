import { TopicViewConfig } from '@minddrop/topics';
import { onAddDrops } from './onAddDrops';
import { onCreate } from './onCreate';
import { onRemoveDrops } from './onRemoveDrops';
import { TopicViewColumns } from './TopicViewColumns';

export const topicViewColumnsConfig: TopicViewConfig = {
  id: 'topic:columns',
  name: 'Columns',
  description: 'Organise drops into columns.',
  component: TopicViewColumns,
  onCreate,
  onAddDrops,
  onRemoveDrops,
};
