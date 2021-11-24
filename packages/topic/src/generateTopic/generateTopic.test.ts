import { generateTopic } from './generateTopic';

describe('generateTopic', () => {
  it('supports generating root topics', () => {
    const topic = generateTopic();

    expect(topic.root).toBe(true);
    expect(topic.parents.length).toBe(0);
  });

  it('supports generating subtopics', () => {
    const topic = generateTopic({}, 'parent-id');

    expect(topic.root).toBe(false);
    expect(topic.parents[0]).toBe('parent-id');
  });
});
