import { act, MockDate } from '@minddrop/test-utils';
import { updateDrop } from './updateDrop';
import { UpdateDropData } from '../types';
import { cleanup, core, setup, textDrop1 } from '../test-utils';
import { getDrop } from '../getDrop';

const changes: UpdateDropData = {
  color: 'blue',
};

describe('updateDrop', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    MockDate.reset();
  });

  it('returns the updated drop', () => {
    MockDate.set('01/02/2000');

    // Update the drop
    const updated = updateDrop(core, textDrop1.id, changes);

    // Should return updated drop
    expect(updated.color).toBe('blue');
    // Updates the updatedAt timestamp
    expect(updated.updatedAt.getTime()).toBe(new Date('01/02/2000').getTime());
  });

  it('updates the drop in the store', () => {
    // Update the drop
    const updated = updateDrop(core, textDrop1.id, changes);

    // Get the drop from the store
    const drop = getDrop(textDrop1.id);

    // Store drop should match returned drop
    expect(drop).toEqual(updated);
  });

  it("dispatches a 'drops:update' event", (done) => {
    // Listen to 'drops:update' events
    core.addEventListener('drops:update', (payload) => {
      // Get the updated drop
      const updated = getDrop(textDrop1.id);

      expect(payload.data).toEqual({
        before: textDrop1,
        after: updated,
        changes: { ...changes, updatedAt: new Date('01/02/2000') },
      });
      done();
    });

    act(() => {
      MockDate.set('01/02/2000');
      updateDrop(core, textDrop1.id, changes);
    });
  });
});
