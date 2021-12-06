import { initializeCore } from '@minddrop/core';
import { createTopic } from './createTopic';

let core = initializeCore('topics');

describe('createTopic', () => {
  afterEach(() => {
    core = initializeCore('topics');
  });

  it('creates a topic', () => {
    const topic = createTopic(core);

    expect(topic).toBeDefined();
    expect(topic.title).toBe('');
  });

  it('sets passed in data', () => {
    const topic = createTopic(core, { title: 'My topic' });
    expect(topic.title).toBe('My topic');
  });

  it("dispatches a 'topics:create' event", () => {
    const callback = jest.fn();

    core.addEventListener('topics:create', callback);

    const topic = createTopic(core, { title: 'My topic' });

    expect(callback).toHaveBeenCalledWith({
      source: 'topics',
      type: 'topics:create',
      data: topic,
    });
  });
});
