import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../topics-extension';
import { createTopic } from '../createTopic';
import { Topic } from '../types';
import { addSubtopics } from './addSubtopics';

let core = initializeCore('topics');

// Set up extension
onRun(core);

describe('addSubtopics', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('topics');
    onRun(core);
  });

  it('adds subtopics to the topic', () => {
    let topic: Topic;
    let subtopic1: Topic;
    let subtopic2: Topic;

    act(() => {
      topic = createTopic(core);
      subtopic1 = createTopic(core);
      subtopic2 = createTopic(core);
    });

    const updated = addSubtopics(core, topic.id, [subtopic1.id, subtopic2.id]);

    expect(updated.subtopics.length).toBe(2);
    expect(updated.subtopics.includes(subtopic1.id)).toBe(true);
    expect(updated.subtopics.includes(subtopic2.id)).toBe(true);
  });

  it("dispatches a 'topics:add-subtopics' event", (done) => {
    let topic: Topic;
    let subtopic1: Topic;
    let subtopic2: Topic;

    function callback(payload) {
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.subtopics).toEqual({
        [subtopic1.id]: subtopic1,
        [subtopic2.id]: subtopic2,
      });
      done();
    }

    core.addEventListener('topics:add-subtopics', callback);

    act(() => {
      topic = createTopic(core);
      subtopic1 = createTopic(core);
      subtopic2 = createTopic(core);
    });

    topic = addSubtopics(core, topic.id, [subtopic1.id, subtopic2.id]);
  });
});
