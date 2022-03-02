import { getTopicParents } from './getTopicParents';
import {
  cleanup,
  core,
  setup,
  tNavigation,
  tSailing,
  tUntitled,
} from '../test-utils';
import { mapById } from '@minddrop/utils';
import { addSubtopics } from '../addSubtopics';
import { deleteTopic } from '../deleteTopic';

describe('getTopicParents', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("gets a topic's parents", () => {
    // Add 'Untitled' topic as a second parent to 'Navigation' topic
    const secondParent = addSubtopics(core, tUntitled.id, [tNavigation.id]);

    // Get the parents
    const parents = getTopicParents(tNavigation.id);

    // Should have 'Sailing' and 'Untitled' topics as parents
    expect(parents).toEqual(mapById([tSailing, secondParent]));
  });

  it('filters results', () => {
    // Add 'Untitled' topic as a second parent to 'Navigation' topic
    let secondParent = addSubtopics(core, tUntitled.id, [tNavigation.id]);

    // Delete 'Untitled' topic
    secondParent = deleteTopic(core, tUntitled.id);

    // Get deleted parents
    const parents = getTopicParents(tNavigation.id, { deleted: true });

    // Should return only 'Untitled' topic
    expect(parents).toEqual(mapById([secondParent]));
  });
});
