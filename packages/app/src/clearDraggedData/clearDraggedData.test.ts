import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { clearDraggedData } from './clearDraggedData';

describe('clearDraggedData', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears the dragged data in the store', () => {
    useAppStore
      .getState()
      .setDraggedData({ drops: ['drop-id'], topics: ['topic-id'] });

    clearDraggedData(core);

    expect(useAppStore.getState().draggedData).toEqual({
      drops: [],
      topics: [],
    });
  });

  it('dispatches a `app:drag-end`', (done) => {
    core.addEventListener('app:drag-end', () => {
      done();
    });

    clearDraggedData(core);
  });
});
