import { Core } from '@minddrop/core';
import { Topic } from '@minddrop/topics';
import { ColumnItem, TopicViewColumnsData } from '../types';

/**
 * The view's onCreate callback.
 *
 * @param core A MindDrop core instance.
 * @param topic The topic to which the view instance is being added.
 */
export function onCreate(core: Core, topic: Topic): TopicViewColumnsData {
  // Spread the topic's drops evenly between the columns
  const columnItems: ColumnItem[][] = [];

  for (let i = 4; i > 0; i--) {
    const items: ColumnItem[] = topic.drops
      .splice(0, Math.ceil(topic.drops.length / i))
      .map((dropId) => ({ type: 'drop', id: dropId }));

    columnItems.push(items);
  }

  return {
    columns: {
      0: columnItems[0],
      1: columnItems[1],
      2: columnItems[2],
      3: columnItems[3],
    },
  };
}
