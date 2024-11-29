import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { Block } from '../types';
import { BlocksStore } from './BlocksStore';
import { block1, block2, blocks } from '../test-utils';

function loadBlocks() {
  BlocksStore.getState().load(blocks);
}

describe('BlocksStore', () => {
  afterEach(() => {
    BlocksStore.getState().clear();
  });

  describe('load', () => {
    it('loads blocks into the store, preserving existing ones', () => {
      // Load a block into the store
      BlocksStore.getState().load([block1]);
      // Load a second block into the store
      BlocksStore.getState().load([block2]);

      // Both blocks should be in the store
      expect(BlocksStore.getState().blocks).toEqual([block1, block2]);
    });
  });

  describe('add', () => {
    it('adds a block to the store', () => {
      // Load a block into the store
      BlocksStore.getState().load([block1]);

      // Add a second block to the store
      BlocksStore.getState().add(block2);

      // Both blocks should be in the store
      expect(BlocksStore.getState().blocks).toEqual([block1, block2]);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      // Load blocks into the store
      loadBlocks();
    });

    it('updates the specified block in the store', () => {
      // Update a block
      BlocksStore.getState().update(block1.id, { title: 'New title' });

      // Get the block from the store
      const block = BlocksStore.getState().blocks.find(
        ({ id }) => id === block1.id,
      ) as Block;

      // Block title should be updated
      expect(block).toEqual({ ...block1, title: 'New title' });
    });

    it('does nothing if the block does not exist', () => {
      const initialState = [...BlocksStore.getState().blocks];

      // Update a missing block
      BlocksStore.getState().update('foo', {
        title: 'New title',
      });

      // Blocks state should remain unchanged
      expect(BlocksStore.getState().blocks).toEqual(initialState);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      // Load blocks into the store
      loadBlocks();
    });

    it('removes the block from the store', () => {
      // Remove a block
      BlocksStore.getState().remove(block1.id);

      // block should no longer be in the store
      expect(
        BlocksStore.getState().blocks.find((block) => block.id === block1.id),
      ).toBeUndefined();
    });
  });
});
