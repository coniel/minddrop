import {
  ParentReferences,
  ParentReferenceValidationError,
} from '@minddrop/core';
import { contains } from '@minddrop/utils';
import { getDrop } from '../getDrop';
import { setup, cleanup, core, textDrop1 } from '../test-utils';
import { addParentsToDrop } from './addParentsToDrop';
import { deleteDrop } from '../deleteDrop';
import { DropNotFoundError } from '../errors';

const parentRef1 = ParentReferences.generate('topic', 'topic-1');
const parentRef2 = ParentReferences.generate('topic', 'topic-2');

describe('addParentsToDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the drop does not exist', () => {
    // Attempt to add parents to a non-existent drop. Should
    // throw a `DropNotFoundError`.
    expect(() => addParentsToDrop(core, 'missing', [parentRef1])).toThrowError(
      DropNotFoundError,
    );
  });

  it('validates the parents', () => {
    // Attempt to add an invalid parent to a drop. Should
    // throw a `ParentReferenceValidationError`.
    expect(() =>
      addParentsToDrop(
        core,
        textDrop1.id,
        // @ts-ignore
        [{ id: 'parent-id' }],
      ),
    ).toThrowError(ParentReferenceValidationError);
  });

  it('adds the parents to the drop', () => {
    // Add parents to the drop
    addParentsToDrop(core, textDrop1.id, [parentRef1, parentRef2]);

    // Get the updated drop
    const drop = getDrop(textDrop1.id);

    // Should have new parents
    expect(contains(drop.parents, [parentRef1, parentRef2])).toBeTruthy();
  });

  it('returns the updated drop', () => {
    // Add parents to the drop
    const result = addParentsToDrop(core, textDrop1.id, [parentRef1]);

    // Get the updated drop
    const drop = getDrop(textDrop1.id);

    // Should be the updated drop
    expect(drop).toEqual(result);
  });

  it('dispatches a `drops:add-parents` event', (done) => {
    // Listen to 'drops:add-parents' events
    core.addEventListener('drops:add-parents', (payload) => {
      // Get the updated drop
      const drop = getDrop(textDrop1.id);

      // Payload data should contain updated drop
      expect(payload.data.drop).toEqual(drop);
      // Payload data should contain added parent references
      expect(payload.data.parents).toEqual([parentRef1]);
      done();
    });

    // Add parents to drop
    addParentsToDrop(core, textDrop1.id, [parentRef1]);
  });

  it('restores drop and clears old parents if it was deleted', () => {
    // Add parent to the drop
    let result = addParentsToDrop(core, textDrop1.id, [parentRef1]);

    // Delete the drop
    deleteDrop(core, result.id);

    // Add another parent to the drop
    result = addParentsToDrop(core, textDrop1.id, [parentRef2]);

    // Get the updated drop
    const drop = getDrop(textDrop1.id);

    // Should be restored
    expect(drop.deleted).toBeFalsy();
    // Should have 'parent-2' as its only parent
    expect(drop.parents).toEqual([parentRef2]);
  });
});
