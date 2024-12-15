import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { registerSelectionItemType } from '../SelectionItemTypeConfigsStore';
import {
  cleanup,
  selectedItem1,
  selectedItem3,
  selectionItemTypeConfig,
  setup,
} from '../test-utils';
import { useSelectionStore } from '../useSelectionStore';
import { deleteSelection } from './deleteSelection';

const onDelete = vi.fn();

describe('deleteSelection', () => {
  beforeEach(() => {
    setup();

    // Register a serializer
    registerSelectionItemType({ ...selectionItemTypeConfig, onDelete });

    // Set some items as the current selection
    useSelectionStore
      .getState()
      .addSelectedItems([selectedItem1, selectedItem3]);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('deletes the selection items', () => {
    // Trigger a delete
    deleteSelection();

    // Should delete the selection
    expect(onDelete).toHaveBeenCalled();
  });

  it('dispatches a `selection:delete` event', () =>
    new Promise<void>((done) => {
      Events.addListener('selection:delete', 'test', (payload) => {
        // Payload data should be the selection
        expect(payload.data).toEqual([selectedItem1, selectedItem3]);
        done();
      });

      // Trigger a delete
      deleteSelection();
    }));
});
