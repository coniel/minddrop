import { TopicViewColumnsInstance } from '../types';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { DROPS_TEST_DATA } from '@minddrop/drops';

const { tSixDrops, tSixDropsView } = TOPICS_TEST_DATA;
const { textDrop1, textDrop2, textDrop3, textDrop4, htmlDrop1, imageDrop1 } =
  DROPS_TEST_DATA;

export const colItemTextDrop1 = { type: 'drop', id: textDrop1.id };
export const colItemTextDrop2 = { type: 'drop', id: textDrop2.id };
export const colItemTextDrop3 = { type: 'drop', id: textDrop3.id };
export const colItemTextDrop4 = { type: 'drop', id: textDrop4.id };
export const colItemHtmlDrop1 = { type: 'drop', id: htmlDrop1.id };
export const colItemImageDrop1 = { type: 'drop', id: imageDrop1.id };

export const topicViewColumnsInstance: TopicViewColumnsInstance = {
  id: tSixDropsView.id,
  view: 'minddrop/topic-view-columns',
  topic: tSixDrops.id,
  createdAt: new Date('01/01/2000'),
  updatedAt: new Date('01/01/2000'),
  columns: [
    [colItemTextDrop1],
    [colItemTextDrop2, colItemTextDrop3],
    [colItemTextDrop4],
  ],
};
