import { getDropParentTopics } from './getDropParentTopics';
import { deleteTopic } from '../deleteTopic';
import { cleanup, core, setup, tAnchoring, tSailing } from '../test-utils';
import { Drops } from '@minddrop/drops';
import { addDropsToTopic } from '../addDropsToTopic';
import { getTopics } from '../getTopics';
import { mapById } from '@minddrop/utils';

describe('getDropParents', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("gets a drop's parent topics", () => {
    // Create a new drop
    const drop = Drops.create(core, { type: 'text' });

    // Add the drop to a couple of topics
    addDropsToTopic(core, tSailing.id, [drop.id]);
    addDropsToTopic(core, tAnchoring.id, [drop.id]);

    // Get the updated parents
    const parents = getTopics([tSailing.id, tAnchoring.id]);

    // Get the drop's parents
    const result = getDropParentTopics(drop.id);

    // Should return the parents
    expect(result).toEqual(parents);
  });

  it('filters results', () => {
    // Create a new drop
    const drop = Drops.create(core, { type: 'text' });

    // Add the drop to a couple of topics
    addDropsToTopic(core, tSailing.id, [drop.id]);
    addDropsToTopic(core, tAnchoring.id, [drop.id]);

    // Delete one of the parents
    const deletedParent = deleteTopic(core, tSailing.id);

    // Get the drop's parents
    const result = getDropParentTopics(drop.id, { deleted: true });

    // Should return the parents
    expect(result).toEqual(mapById([deletedParent]));
  });
});
