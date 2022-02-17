import { TopicViewInstance } from './TopicViewInstance.types';
import { AddDropsMetadata } from './TopicView.types';
import { TopicView } from './TopicView.types';

export type TopicViewConfig<
  I extends TopicViewInstance = TopicViewInstance,
  M extends AddDropsMetadata = AddDropsMetadata,
> = Omit<TopicView<I, M>, 'extension' | 'type'>;
