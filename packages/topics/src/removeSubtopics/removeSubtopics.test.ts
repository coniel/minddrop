import { removeSubtopics } from './removeSubtopics';
import {
  cleanup,
  core,
  setup,
  tAnchoring,
  tBoats,
  tSailing,
} from '../test-utils';
import { doesNotContain } from '@minddrop/utils';
import { TopicsResource } from '../TopicsResource';

describe('removeSubtopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes subtopics from the topic', () => {
    // Remove the subtopics
    removeSubtopics(core, tSailing.id, [tAnchoring.id, tBoats.id]);

    // Get the updated topic
    const topic = TopicsResource.get(tSailing.id);

    // Topic should no longer contain removed subtopics
    expect(
      doesNotContain(topic.subtopics, [tAnchoring.id, tBoats.id]),
    ).toBeTruthy();
  });

  it('returns the updated topic', () => {
    // Remove a subtopic
    const result = removeSubtopics(core, tSailing.id, [tAnchoring.id]);

    // Get the updated topic
    const topic = TopicsResource.get(tSailing.id);

    // Returned value should match updated topic
    expect(result).toEqual(topic);
  });

  it('removes the topic as a parent on the subtopics', () => {
    // Remove a subtopic
    removeSubtopics(core, tSailing.id, [tAnchoring.id]);

    // Get the updated subtopic
    const subtopic = TopicsResource.get(tAnchoring.id);

    // Subtopic should no longer have topic as a parent
    expect(
      doesNotContain(subtopic.parents, [
        { resource: 'topics:topic', id: tSailing.id },
      ]),
    ).toBeTruthy();
  });

  it("dispatches a 'topics:topic:remove-subtopics' event", (done) => {
    // Listen to 'topics:topic:remove-subtopics' event
    core.addEventListener('topics:topic:remove-subtopics', (payload) => {
      // Get the updated topic
      const topic = TopicsResource.get(tSailing.id);
      // Get the updated subtopics
      const subtopics = TopicsResource.get([tAnchoring.id, tBoats.id]);

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
