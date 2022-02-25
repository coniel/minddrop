import { isSubset } from '@minddrop/utils';
import { Drop } from '../types';
import { getDrop } from '../getDrop';
import { setup, cleanup, core, textDrop1 } from '../test-utils';
import { addParentsToDrop } from './addParentsToDrop';

describe('addParentsToDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the parents to the drop', () => {
    // Add parents to the drop
    addParentsToDrop(core, textDrop1.id, ['parent-1', 'parent-2']);

    // Get the updated drop
    const drop = getDrop(textDrop1.id);

    // Should have new parents
    expect(isSubset(['parent-1', 'parent-2'], drop.parents));
  });

  it('returns the updated drop', () => {
    // Add parents to the drop
    const drop = addParentsToDrop(core, textDrop1.id, ['parent']);

    // Should be the updated drop
    expect(drop.parents.includes('parent')).toBeTruthy();
  });

  it('dispatches a `drops:add-parents` event', (done) => {
    let drop: Drop;

    core.addEventListener('drops:add-parents', (payload) => {
      // Payload data should contain updated drop
      expect(payload.data.drop).toEqual(drop);
      // Payload data should contain added parent IDs
      expect(payload.data.parents).toEqual(['parent']);
      done();
    });

    // Add parents to drop
    drop = addParentsToDrop(core, textDrop1.id, ['parent']);
  });
});
