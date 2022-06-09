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
});
