import { generateTopic } from '../generateTopic';
import { TopicMap } from '../types';
import { filterTopics } from './filterTopics';

const activeTopic = generateTopic();
const deletedTopic = {
  ...generateTopic(),
  deleted: true,
  deletedAt: new Date(),
};

const topics: TopicMap = {
  [activeTopic.id]: activeTopic,
  [deletedTopic.id]: deletedTopic,
};

describe('filterTopics', () => {
  it('returns only active topics by default', () => {
    const result = filterTopics(topics, {});

    expect(Object.keys(result).length).toBe(1);
    expect(result[activeTopic.id]).toBeDefined();
  });

  it('filters out active topics', () => {
    const result = filterTopics(topics, { active: false });

    expect(Object.keys(result).length).toBe(0);
  });

  it('filters in active topics', () => {
    const result = filterTopics(topics, { active: true });

    expect(Object.keys(result).length).toBe(1);
    expect(result[activeTopic.id]).toBeDefined();
  });

  it('filters in deleted topics', () => {
    const result = filterTopics(topics, { deleted: true });

    expect(Object.keys(result).length).toBe(1);
    expect(result[deletedTopic.id]).toBeDefined();
  });
});
