import { generateTopic } from './generateTopic';

describe('generateTopic', () => {
  it('supports custom params', () => {
    const topic = generateTopic({ title: 'My topic' });

    expect(topic.title).toBe('My topic');
  });
});
