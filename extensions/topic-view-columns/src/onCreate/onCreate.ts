import { Core } from '@minddrop/core';
import { Topic } from '@minddrop/topics';
import { generateId } from '@minddrop/utils';
import { ColumnItem, Columns, TopicViewColumnsData } from '../types';

/**
 * The view's onCreate callback.
 *
 * @param core A MindDrop core instance.
 * @param topic The topic to which the view instance is being added.
 */
export function onCreate(core: Core, topic: Topic): TopicViewColumnsData {
  // Spread the topic's drops evenly between the columns
  const columns: Columns = [];

  for (let i = 3; i > 0; i--) {
    const items: ColumnItem[] = topic.drops
      .splice(0, Math.ceil(topic.drops.length / i))
      .map((dropId) => ({ type: 'drop', id: dropId }));

    columns.push({ id: generateId(), items });
  }

  return {
    columns,
  };
}
