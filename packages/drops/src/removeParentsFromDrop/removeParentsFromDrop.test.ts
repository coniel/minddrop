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
    addParentsToDrop(core, textDrop1.id, [
      { type: 'topic', id: 'parent-1' },
      { type: 'topic', id: 'parent-2' },
      { type: 'topic', id: 'parent-3' },
    ]);
  });

  afterEach(cleanup);

  it('removes the parents to the drop', () => {
    // Remove two parents from the drop
    removeParentsFromDrop(core, textDrop1.id, [
      { type: 'topic', id: 'parent-1' },
      { type: 'topic', id: 'parent-2' },
    ]);

    // Get the updated drop
    const drop = getDrop(textDrop1.id);

    // Should no longer contain the two first parents
    expect(
      doesNotContain(drop.parents, [
        { type: 'topic', id: 'parent-1' },
        { type: 'topic', id: 'parent-2' },
      ]),
    ).toBeTruthy();
  });

  it('returns the updated drop', () => {
    // Remove parents from the drop
    const drop = removeParentsFromDrop(core, textDrop1.id, [
      { type: 'topic', id: 'parent-1' },
    ]);

    // Should be the updated drop
    expect(
      doesNotContain(drop.parents, [{ type: 'topic', id: 'parent-1' }]),
    ).toBeTruthy();
  });

  it('dispatches a `drops:remove-parents` event', (done) => {
    let drop: Drop;

    core.addEventListener('drops:remove-parents', (payload) => {
      // Payload data should contain updated drop
      expect(payload.data.drop).toEqual(drop);
      // Payload data should contain removed parent references
      expect(payload.data.parents).toEqual([{ type: 'topic', id: 'parent-1' }]);
      done();
    });

    // Remove the parent
    drop = removeParentsFromDrop(core, textDrop1.id, [
      { type: 'topic', id: 'parent-1' },
    ]);
  });

  it('deletes the drop when the last parent is removed', () => {
    // Remove all parents from the drop
    const drop = removeParentsFromDrop(core, textDrop1.id, [
      { type: 'topic', id: 'parent-1' },
      { type: 'topic', id: 'parent-2' },
      { type: 'topic', id: 'parent-3' },
    ]);

    // Drop should be deleted
    expect(drop.deleted).toBeTruthy();
  });
});
