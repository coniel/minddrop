import { InvalidParameterError } from '@minddrop/utils';
import { setup, cleanup, tSailing, core } from '../test-utils';
import { TopicsResource } from '../TopicsResource';
import { sortSubtopics } from './sortSubtopics';

describe('sortSubtopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the provided subtopic IDs do not match current subtopic IDs', () => {
    // Call with subtopic IDs which do not match the
    // current subtopic IDs.
    expect(() =>
      sortSubtopics(core, tSailing.id, [
        // Remove the first subtopic ID
        ...tSailing.subtopics.slice(1),
        // Add an extra topic ID
        'other-topic',
      ]),
    ).toThrowError(InvalidParameterError);

    // Call with a missing subtopic ID
    expect(() =>
      sortSubtopics(core, tSailing.id, [...tSailing.subtopics.slice(1)]),
    ).toThrowError(InvalidParameterError);

    // Call with an extra subtopic
    expect(() =>
      sortSubtopics(core, tSailing.id, [...tSailing.subtopics, 'extra-topic']),
    ).toThrowError(InvalidParameterError);
  });

  it('updates the topic with the new subtopics order', () => {
    // The new subtopic order. Move the first subtopic
    // to the end.
    const newOrder = [...tSailing.subtopics.slice(1), tSailing.subtopics[0]];

    // Sort the  subtopics
    sortSubtopics(core, tSailing.id, newOrder);

    // Get the updated topic
    const updated = TopicsResource.get(tSailing.id);

    // Subtopic order should be updated
    expect(updated.subtopics).toEqual(newOrder);
  });

  it('dispatches a `topics:topic:sort-subtopics` event', (done) => {
    // The new subtopic order. Move the first subtopic
    // to the end.
    const newOrder = [...tSailing.subtopics.slice(1), tSailing.subtopics[0]];

    // Listen to 'topics:topic:sort-subtopics' events
    core.addEventListener('topics:topic:sort-subtopics', (payload) => {
      // Get the updated topic
      const topic = TopicsResource.get(tSailing.id);

      // Payload data should be the updated topic
      expect(payload.data).toEqual(topic);
      done();
    });

    // Sort the subtopics
    sortSubtopics(core, tSailing.id, newOrder);
  });
});
