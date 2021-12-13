import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../topics-extension';
import { createTopic } from '../createTopic';
import { Topic } from '../types';
import { removeSubtopics } from './removeSubtopics';
import { addSubtopics } from '../addSubtopics';

let core = initializeCore('topics');

// Set up extension
onRun(core);

describe('removeSubtopics', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('topics');
    onRun(core);
  });

  it('removes subtopics from the topic', () => {
    let topic: Topic;
    let subtopic1: Topic;
    let subtopic2: Topic;
    let subtopic3: Topic;

    act(() => {
      topic = createTopic(core);
      subtopic1 = createTopic(core);
      subtopic2 = createTopic(core);
      subtopic3 = createTopic(core);
      addSubtopics(core, topic.id, [subtopic1.id, subtopic2.id, subtopic3.id]);
    });

    const updated = removeSubtopics(core, topic.id, [
      subtopic1.id,
      subtopic2.id,
    ]);

    expect(updated.subtopics.length).toBe(1);
    expect(updated.subtopics.includes(subtopic1.id)).toBe(false);
    expect(updated.subtopics.includes(subtopic2.id)).toBe(false);
    expect(updated.subtopics.includes(subtopic3.id)).toBe(true);
  });

  it("dispatches a 'topics:remove-subtopics' event", (done) => {
    let topic: Topic;
    let subtopic1: Topic;
    let subtopic2: Topic;
    let subtopic3: Topic;

    function callback(payload) {
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.subtopics).toEqual({
        [subtopic1.id]: subtopic1,
        [subtopic2.id]: subtopic2,
      });
      done();
    }

    core.addEventListener('topics:remove-subtopics', callback);

    act(() => {
      topic = createTopic(core);
      subtopic1 = createTopic(core);
      subtopic2 = createTopic(core);
      subtopic3 = createTopic(core);
      addSubtopics(core, topic.id, [subtopic1.id, subtopic2.id, subtopic3.id]);
    });

    topic = removeSubtopics(core, topic.id, [subtopic1.id, subtopic2.id]);
  });
});
