import { doesNotContain } from '@minddrop/utils';
import { Drop } from '../types';
import { getDrop } from '../getDrop';
import { setup, cleanup, core, textDrop1 } from '../test-utils';
import { removeParentsFromDrop } from './removeParentsFromDrop';
import { addParentsToDrop } from '../addParentsToDrop/addParentsToDrop';

describe('removeParentsToDrop', () => {
  beforeEach(() => {
    setup();

    // Add three parents to the drop
    addParentsToDrop(core, textDrop1.id, ['parent-1', 'parent-2', 'parent-3']);
  });

  afterEach(cleanup);

  it('removes the parents to the drop', () => {
    // Remove two parents from the drop
    removeParentsFromDrop(core, textDrop1.id, ['parent-1', 'parent-2']);

    // Get the updated drop
    const drop = getDrop(textDrop1.id);

    // Should no longer contain the two first parents
    expect(doesNotContain(drop.parents, ['parent-1', 'parent-2']));
  });

  it('returns the updated drop', () => {
    // Remove parents from the drop
    const drop = removeParentsFromDrop(core, textDrop1.id, ['parent-1']);

    // Should be the updated drop
    expect(drop.parents.includes('parent-1')).toBeFalsy();
  });

  it('dispatches a `drops:remove-parents` event', (done) => {
    let drop: Drop;

    core.addEventListener('drops:remove-parents', (payload) => {
      // Payload data should contain updated drop
      expect(payload.data.drop).toEqual(drop);
      // Payload data should contain removeed parent IDs
      expect(payload.data.parents).toEqual(['parent-1']);
      done();
    });

    // Remove the parent
    drop = removeParentsFromDrop(core, textDrop1.id, ['parent-1']);
  });
});
