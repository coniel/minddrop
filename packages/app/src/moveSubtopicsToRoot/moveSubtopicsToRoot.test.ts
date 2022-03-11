import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { contains, doesNotContain } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { getRootTopics } from '../getRootTopics';
import { moveSubtopicsToRoot } from './moveSubtopicsToRoot';

const { tSailing, tNavigation, tAnchoring } = TOPICS_TEST_DATA;

describe('moveSubtopicsToRoot', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the subtopics from the parent topic', () => {
    // Move the subtopics
    moveSubtopicsToRoot(core, tSailing.id, [tAnchoring.id, tNavigation.id]);

    // Get the updated parent topic
    const parent = Topics.get(tSailing.id);

    // Parent should no longer contain the subtopics
    expect(
      doesNotContain(parent.subtopics, [tAnchoring.id, tNavigation.id]),
    ).toBeTruthy();
  });

  it('adds the subtopics to the root level', () => {
    // Move the subtopics
    moveSubtopicsToRoot(core, tSailing.id, [tAnchoring.id, tNavigation.id]);

    // Get root topic IDs
    const rootTopics = getRootTopics().map((t) => t.id);

    // Root topics should contain the subtopics
    expect(contains(rootTopics, [tAnchoring.id, tNavigation.id])).toBeTruthy();
  });

  it('dispatches a `app:move-subtopics-root` event', (done) => {
    // Listen to 'app:move-subtopics-root' events
    core.addEventListener('app:move-subtopics-root', (payload) => {
      // Get the updated former parent topic
      const topic = Topics.get(tSailing.id);
      // Get the updated subtopics
      const subtopics = Topics.get([tAnchoring.id, tNavigation.id]);

      // Payload data should include former parent
      expect(payload.data.fromTopic).toEqual(topic);
      // Payload data should include updated subtopics
      expect(payload.data.subtopics).toEqual(subtopics);
      done();
    });

    // Move the subtopics
    moveSubtopicsToRoot(core, tSailing.id, [tAnchoring.id, tNavigation.id]);
  });
});
