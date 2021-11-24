import { generateId } from '@minddrop/utils';
import { CreateTopicData, Topic } from '../types';

/**
 * Generates a topic including all required fields.
 *
 * @param data Optional default data.
 * @param parent The parent topic of the generated topic. If ommited, topic will be a root topic.
 * @returns A new topic.
 */
export function generateTopic(data?: CreateTopicData, parent?: string): Topic {
  return {
    root: !parent,
    title: '',
    parents: parent ? [parent] : [],
    subtopics: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
    id: generateId(),
  };
}
