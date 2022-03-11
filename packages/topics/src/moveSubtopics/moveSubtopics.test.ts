import { contains, doesNotContain } from '@minddrop/utils';
import { getTopic } from '../getTopic';
import { getTopics } from '../getTopics';
import {
  setup,
  cleanup,
  core,
  tSailing,
  tAnchoring,
  tNavigation,
  tUntitled,
} from '../test-utils';
import { moveSubtopics } from './moveSubtopics';

describe('moveSubtopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes subtopics from their parent', () => {
    // Move the subtopics
    moveSubtopics(core, tSailing.id, tUntitled.id, [
      tAnchoring.id,
      tNavigation.id,
    ]);

    // Get the updated parent topic
    const parent = getTopic(tSailing.id);

    // Should no longer contain the subtopics
    expect(
      doesNotContain(parent.subtopics, [tAnchoring.id, tNavigation.id]),
    ).toBeTruthy();
  });

  it('adds the subtopics to the new parent', () => {
    // Move the subtopics
    moveSubtopics(core, tSailing.id, tUntitled.id, [
      tAnchoring.id,
      tNavigation.id,
    ]);

    // Get the updated new parent topic
    const parent = getTopic(tUntitled.id);

    // Should contain the subtopics
    expect(
      contains(parent.subtopics, [tAnchoring.id, tNavigation.id]),
    ).toBeTruthy();
  });

  it('dispatches a `topics:move-subtopics` event', (done) => {
    // Listen to 'topics:move-subtopics' event
    core.addEventListener('topics:move-subtopics', (payload) => {
      // Get the updated original parent topic
      const fromTopic = getTopic(tSailing.id);
      // Get the updated new parent topic
      const toTopic = getTopic(tUntitled.id);
      // Get the updated subtopics
      const subtopics = getTopics([tAnchoring.id, tNavigation.id]);

      // Payload data should contain updated original parent as 'fromTopic'
      expect(payload.data.fromTopic).toEqual(fromTopic);
      // Payload data should contain updated new parent as 'toTopic'
      expect(payload.data.toTopic).toEqual(toTopic);
      // Payload data should contain updated subtopics
      expect(payload.data.subtopics).toEqual(subtopics);
      done();
    });

    // Move the subtopics
    moveSubtopics(core, tSailing.id, tUntitled.id, [
      tAnchoring.id,
      tNavigation.id,
    ]);
  });
});
