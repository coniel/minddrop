import { contains } from '@minddrop/utils';
import { addSubtopics } from './addSubtopics';
import {
  cleanup,
  core,
  setup,
  tNoDrops,
  tSailing,
  tSixDrops,
  tTwoDrops,
} from '../test-utils';
import { TopicsResource } from '../TopicsResource';

describe('addSubtopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds subtopics to the topic', () => {
    // Add the subtopics
    addSubtopics(core, tSailing.id, [tTwoDrops.id, tSixDrops.id]);

    // Get the updated topic
    const topic = TopicsResource.get(tSailing.id);

    // Should have added subtopics
    expect(topic.subtopics).toEqual([
      ...tSailing.subtopics,
      tTwoDrops.id,
      tSixDrops.id,
    ]);
  });

  it('adds subtopics to the specified index', () => {
    // Add the subtopics to the top of the subtopics list
    addSubtopics(core, tSailing.id, [tTwoDrops.id, tSixDrops.id], 0);

    // Get the updated topic
    const topic = TopicsResource.get(tSailing.id);

    // Subtopics should be at the top of the list
    expect(topic.subtopics).toEqual([
      tTwoDrops.id,
      tSixDrops.id,
      ...tSailing.subtopics,
    ]);
  });

  it('returns the updated topic', () => {
    // Add a subtopic
    const result = addSubtopics(core, tNoDrops.id, [tTwoDrops.id]);

    // Get the updated topic
    const topic = TopicsResource.get(tNoDrops.id);

    // Returned value should equal updated topic
    expect(result).toEqual(topic);
  });

  it('adds the topic as a parent on the subtopics', () => {
    // Add a subtopic
    addSubtopics(core, tNoDrops.id, [tTwoDrops.id]);

    // Get the updated subtopic
    const subtopic = TopicsResource.get(tTwoDrops.id);

    // Should have topic as a parent
    expect(
      contains(subtopic.parents, [
        { resource: 'topics:topic', id: tNoDrops.id },
      ]),
    ).toBeTruthy();
  });

  it('does not add subtopic if already present', () => {
    // Add a subtopic
    addSubtopics(core, tNoDrops.id, [tTwoDrops.id]);

    // Add the subtopic again along with another one
    const result = addSubtopics(core, tNoDrops.id, [
      tTwoDrops.id,
      tSixDrops.id,
    ]);

    // Returned value should equal updated topic
    expect(result.subtopics.length).toBe(2);
  });

  it("dispatches a 'topics:topic:add-subtopics' event", (done) => {
    // Listen to 'topics:add-subtopics' events
    core.addEventListener('topics:topic:add-subtopics', (payload) => {
      // Get the updated topic
      const topic = TopicsResource.get(tNoDrops.id);
      // Get the updated added subtopics
      const subtopics = TopicsResource.get([tTwoDrops.id, tSixDrops.id]);

      // Payload data should contain updated topic
      expect(payload.data.topic).toEqual(topic);
      // Payload should contain updated subtopics
      expect(payload.data.subtopics).toEqual(subtopics);
      done();
    });

    // Add the subtopics
    addSubtopics(core, tNoDrops.id, [tTwoDrops.id, tSixDrops.id]);
  });
});
