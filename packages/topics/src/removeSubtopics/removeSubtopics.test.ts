import { removeSubtopics } from './removeSubtopics';
import {
  cleanup,
  core,
  setup,
  tAnchoring,
  tBoats,
  tSailing,
} from '../test-utils';
import { getTopic } from '../getTopic';
import { doesNotContain } from '@minddrop/utils';
import { getTopics } from '../getTopics';

describe('removeSubtopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes subtopics from the topic', () => {
    // Remove the subtopics
    removeSubtopics(core, tSailing.id, [tAnchoring.id, tBoats.id]);

    // Get the updated topic
    const topic = getTopic(tSailing.id);

    // Topic should no longer contain removed subtopics
    expect(
      doesNotContain(topic.subtopics, [tAnchoring.id, tBoats.id]),
    ).toBeTruthy();
  });

  it('returns the updated topic', () => {
    // Remove a subtopic
    const result = removeSubtopics(core, tSailing.id, [tAnchoring.id]);

    // Get the updated topic
    const topic = getTopic(tSailing.id);

    // Returned value should match updated topic
    expect(result).toEqual(topic);
  });

  it('removes the topic as a parent on the subtopics', () => {
    // Remove a subtopic
    removeSubtopics(core, tSailing.id, [tAnchoring.id]);

    // Get the updated subtopic
    const subtopic = getTopic(tAnchoring.id);

    // Subtopic should no longer have topic as a parent
    expect(
      doesNotContain(subtopic.parents, [{ type: 'topic', id: tSailing.id }]),
    ).toBeTruthy();
  });

  it("dispatches a 'topics:remove-subtopics' event", (done) => {
    // Listen to 'topics:remove-subtopics' event
    core.addEventListener('topics:remove-subtopics', (payload) => {
      // Get the updated topic
      const topic = getTopic(tSailing.id);
      // Get the updated subtopics
      const subtopics = getTopics([tAnchoring.id, tBoats.id]);

      // Payload data should contain updated topic
      expect(payload.data.topic).toEqual(topic);
      // Payload data should contain updated subtopics
      expect(payload.data.subtopics).toEqual(subtopics);
      done();
    });

    // Remove the subtopics
    removeSubtopics(core, tSailing.id, [tAnchoring.id, tBoats.id]);
  });
});
