import { generateId } from '@minddrop/utils';
import { Topic } from '../types';

/**
 * Generates a topic including all required fields.
 *
 * @param data Optional default data.
 * @returns A new topic.
 */
export function generateTopic(data?: Partial<Topic>): Topic {
  return {
    title: '',
    subtopics: [],
    views: [],
    drops: [],
    archivedDrops: [],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    id: generateId(),
    ...data,
  };
}
